import { mockTechnologies } from "./MockTechResults";
import { Technology } from "../entities/Technology";
import { technologies } from "../data/Technologies";
import { apiUrl } from "../ApiUrl"
const axios = require('axios');

class TechnologyService {
  constructor() {}

  getTechnologies() {
    let requests = [];

    requests = technologies.map(x => {
      var request = new Promise((resolve, reject) => {
        axios.get(apiUrl + 'owner=' + x.owner + '&name=' + x.name)
        .then(result => {
          if (result.data) {
            resolve(result.data);
          } else {
            reject('No result');
          }
        })
        .catch(err => {
          reject(err);
        });
      });
      return request;
    });

    return Promise.all(requests).then(values => {
      var resultDictionary = {}
      values.forEach(value => {
        var keys = Object.keys(value);
        if (keys.length == 1) {
          var projectName = keys[0];
          resultDictionary[projectName] = value[projectName]; 
        }
      });
      return this.parseTechnologies(resultDictionary);
    });
  }

  parseTechnologies(technologyVersionList) {
    technologies.forEach(technology => {
      var versionInfo = technologyVersionList[technology.name];
      if (versionInfo != null) {
        technology.versionNumber = versionInfo.versionNumber;
        technology.versionLastDate = versionInfo.versionDate;
        technology.repoUrl = versionInfo.url;
      }
    });
    return technologies;
  }

}

export default TechnologyService;