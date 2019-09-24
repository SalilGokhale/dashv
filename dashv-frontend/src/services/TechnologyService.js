import { technologies } from "../data/Technologies";
import { apiUrl } from "../ApiUrl"
const axios = require('axios');

class TechnologyService {

  getTechnology(technology) {
    return new Promise((resolve, reject) => {
      axios.get(apiUrl + 'owner=' + technology.owner + '&name=' + technology.name)
          .then(result => {
            if (result.data) {
              const value = result.data;
              var keys = Object.keys(value);
              if (keys.length === 1) {
                var projectName = keys[0];
                const versionInfo = value[projectName]; 
                technology.versionNumber = versionInfo.versionNumber;
                technology.versionLastDate = versionInfo.versionDate;
                technology.repoUrl = versionInfo.url;
              }
              resolve(technology);
            } else {
              reject(null);
            }
          })
          .catch(err => {
            reject(err);
          });
    })
  }

}

export default TechnologyService;