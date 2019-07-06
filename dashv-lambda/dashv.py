import abc
import logging
import multiprocessing as mp
import re
from collections import defaultdict
from typing import List, Any

import requests
import semantic_version

logger = logging.getLogger(__name__)


def get(target: object, github_auth_token: object) -> object:
    ProjectRetrieverSettings.github_auth_token = github_auth_token
    project_target = (target["owner"], target["name"])
    return get_project(project_target)


# Keeping this for when lambda supports multiprocessing.Pool
def get_all(github_targets: List[Any], github_auth_token: str):
    project_results = defaultdict(dict)

    cpu_count: int = mp.cpu_count()

    n = len(github_targets) if len(github_targets) <= cpu_count else cpu_count

    partitioned_targets = partition_targets(n, github_targets)

    ProjectRetrieverSettings.github_auth_token = github_auth_token

    with mp.Pool(n) as p:
        results = p.map(get_projects, partitioned_targets)

        for projects in results:
            for project in projects:
                project_results.update(project)

    return project_results


def get_projects(targets: List[Any]):
    projects = []
    for target in targets:
        projects.append(get_project(target))
    return projects


def get_project(target: object) -> object:
    token = ProjectRetrieverSettings.github_auth_token
    owner = target[0]
    name = target[1]
    project = GithubVersionedProject(owner, name, token, 25)
    project_result = {name: {"url": project.url, "releases": []}}
    if len(project.releases) > 0:
        project_result[name]["versionNumber"] = str(project.releases[0][0])
        project_result[name]["versionDate"] = project.releases[0][1]
        project_result[name]["releases"].append({
            "version": str(project.releases[0][0]),
            "date": project.releases[0][1]
        })
    return project_result


def partition_targets(partition_number, github_targets):
    partitioned_list: List[List[Any]] = []
    # first iteration
    for i in range(partition_number):
        partitioned_list.append([github_targets[i]])

    if partition_number < len(github_targets):
        for j in range(partition_number, len(github_targets)):
            partitioned_list[j % partition_number].append(github_targets[j])

    return partitioned_list


class ProjectRetrieverSettings:

    def __init__(self, github_auth_token):
        self._github_auth_token = github_auth_token


class SemanticVersionException(Exception):
    pass


class VersionedProject(abc.ABC):

    @property
    @abc.abstractmethod
    def url(self):
        pass

    @property
    @abc.abstractmethod
    def releases(self):
        pass

    @staticmethod
    def _get_semantic_version(tag):
        three_numbered_version = re.search("(\\d+)[._](\\d+)[._](\\d+)(.*)", tag)
        two_numbered_version = re.search("(\\d+)[._](\\d+)(.*)", tag)
        if semantic_version.validate(tag):
            semver = semantic_version.Version(tag)
        elif three_numbered_version:
            if len(three_numbered_version.groups()) == 4:
                major, minor, patch, trailing = three_numbered_version.groups()
                semver = semantic_version.Version.coerce("{}.{}.{}{}".format(major, minor, patch, trailing))
            else:
                major, minor, patch = three_numbered_version.groups()
                semver = semantic_version.Version.coerce("{}.{}.{}".format(major, minor, patch))
        elif two_numbered_version:
            if len(two_numbered_version.groups()) == 3:
                major, minor, trailing = two_numbered_version.groups()
                semver = semantic_version.Version.coerce("{}.{}.0{}".format(major, minor, trailing))
            else:
                major, minor = two_numbered_version.groups()
                semver = semantic_version.Version.coerce("{}.{}.0".format(major, minor))
        else:
            raise SemanticVersionException("Was not able to parse {} as a semantic versioned tag".format(tag))
        return semver


class GithubVersionedProject(VersionedProject):
    """A project located on Github with releases"""

    version_query_template = """
        {{
          repository(owner: "{owner}", name: "{name}") {{
            tags: refs(refPrefix: "refs/tags/", first: {number_of_releases}, orderBy:{{field:TAG_COMMIT_DATE, direction: DESC}}) {{
              edges {{
                tag: node {{
                  name
                  target {{
                    ... on Commit {{
                      author {{
                        date
                      }}
                    }}
                    ... on Tag {{
                      tagger {{
                        date
                      }}
                    }}
                  }}
                }}
              }}
            }}
          }}
        }}
    """

    def __init__(self, owner, name, github_auth_token, number_of_releases):
        self.owner = owner
        self.name = name
        self._github_auth_token = github_auth_token
        self.number_of_releases = number_of_releases

    @property
    def url(self):
        return "https://github.com/{}/{}".format(self.owner, self.name)

    @property
    def releases(self):
        raw_data = self._get_raw_tag_data()
        releases = []
        failed_tags = []
        for edge in raw_data["data"]["repository"]["tags"]["edges"]:
            tag = edge["tag"]["target"]
            name = edge["tag"]["name"]
            try:
                version = self._get_semantic_version(name)
                if len(version.prerelease) == 0:
                    date = tag["author"]["date"] if "author" in tag else tag["tagger"]["date"]
                    releases.append((version, date))
            except SemanticVersionException:
                failed_tags.append(name)

        if failed_tags:
            logger.warning("Semantic Version Parsing failed for tags: {}".format(", ".join(failed_tags)))
        return releases

    def _get_raw_tag_data(self):
        response = requests.post(
            "https://api.github.com/graphql",
            json={"query": self.version_query_template.format(owner=self.owner, name=self.name,
                                                              number_of_releases=self.number_of_releases)},
            headers={'Authorization': 'bearer {}'.format(self._github_auth_token)}
        )
        response.raise_for_status()
        return response.json()
