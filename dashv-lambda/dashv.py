import abc
import json
from collections import defaultdict
import requests
import os
import re
import semantic_version
import logging

logger = logging.getLogger(__name__)


def dashv_backend_lambda(github_targets, github_auth_token):
    project_results = defaultdict(dict)
    for owner, name in github_targets:
        project = GithubVersionedProject(owner, name, github_auth_token)
        project_results[owner][name] = {"url": project.url, "releases": []}
        for release in project.releases:
            project_results[owner][name]["releases"].append({
                "version": str(release[0]),
                "date": release[1]
            })
    return project_results


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
            tags: refs(refPrefix: "refs/tags/", first: 100, orderBy:{{field:TAG_COMMIT_DATE, direction: DESC}}) {{
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

    def __init__(self, owner, name, github_auth_token):
        self.owner = owner
        self.name = name
        self._github_auth_token = github_auth_token

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
            json={"query": self.version_query_template.format(owner=self.owner, name=self.name)},
            headers={'Authorization': 'bearer {}'.format(self._github_auth_token)}
        )
        response.raise_for_status()
        return response.json()
