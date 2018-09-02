import json

import requests
import dotenv
import os
import re
import semantic_version

dotenv.load_dotenv()

# angular angular
# python cython
# facebook react
# golang go
# nodejs node
# postgres postgres - custom versioning, REL9_3_16
# ruby ruby
# apple swift swift-4.2-DEVELOPMENT-SNAPSHOT-2018-07-30-a
# docker docker-ce v18.09.0-ce-tp5 - todo leading zero in version parts
tag_query = """{
  repository(owner: "docker", name: "docker-ce") {
    tags: refs(refPrefix: "refs/tags/", first: 100, orderBy:{field:TAG_COMMIT_DATE, direction: DESC}) {
      edges {
        tag: node {
          name
          target {
            ... on Commit {
              author {
                date
              }
            }
            ... on Tag {
              tagger {
                date
              }
            }
          }
        }
      }
    }
  }
}"""

response = requests.post("https://api.github.com/graphql",
                         json={"query": tag_query},
                         headers={'Authorization': 'bearer {}'.format(os.environ["GITHUB_ACCESS_TOKEN"])})

result = response.json()
tag_version_dates = []
print(json.dumps(result, indent=4, sort_keys=True))

# TODO parse versions which don't have a patch no, e.g. 9.5
# TODO custom version string handling funcs which take (org/repo), ver_string, returning a Semantic Version
# possibly a function which takes all the version strings for a repo and has custom logic to pick the important ones
for edge in result["data"]["repository"]["tags"]["edges"]:
    tag = edge["tag"]["target"]
    name = edge["tag"]["name"]
    fuzzy_match = re.search("(\\d+)[._](\\d+)[._](\\d+)(.*)", name)
    print(name)
    print(fuzzy_match)
    if semantic_version.validate(name):
        v = semantic_version.Version(name)
        if len(v.prerelease) == 0 and v.patch == 0:
            date = tag["author"]["date"] if "author" in tag else tag["tagger"]["date"]
            tag_version_dates.append((v, date))
    elif fuzzy_match:
        parsed = "{}.{}.{}{}".format(*fuzzy_match.groups())
        v = semantic_version.Version.coerce(fuzzy_match[0])
        if len(v.prerelease) == 0:
            date = tag["author"]["date"] if "author" in tag else tag["tagger"]["date"]
            tag_version_dates.append((v, date))
    else:
        pass


print(tag_version_dates)
