import json

import requests
import dotenv
import os

dotenv.load_dotenv()

tag_query = """{
  repository(owner: "golang", name: "go") {
    tags: refs(refPrefix: "refs/tags/", first: 100) {
      edges {
        tag: node {
          name
          target {
            ... on Tag {
              sha: oid
              tagger {
                name
                email
                date
              }
            }
          }
        }
      }
    }
  }
}"""

release_query = """
  repository(owner: "golang", name:"go") {
    releases(first: 100, after: $after) {
      edges {
        node {
          name
          tag {
            name
          }
          releaseAssets(first: 100) {
            edges {
              node {
                name
                downloadCount
              }
            }
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
"""

# query = "query { viewer { login }}"


response = requests.post("https://api.github.com/graphql",
                         json={"query": tag_query},
                         headers={'Authorization': 'bearer {}'.format(os.environ["GITHUB_ACCESS_TOKEN"])})

result = response.json()
tag_version_dates = []
print(json.dumps(result, indent=4, sort_keys=True))

for edge in result["data"]["repository"]["tags"]["edges"]:
    tag_version_dates.append((edge["tag"]["name"], edge["tag"]["target"]["tagger"]["date"]))

print(tag_version_dates)
