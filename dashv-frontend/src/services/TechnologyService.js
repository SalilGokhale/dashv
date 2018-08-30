import { mockTechnologies } from "./MockTechResults";
import { Technology } from "../entities/Technology";
import { images } from "./TechImages";
const axios = require('axios');

class TechnologyService {
  constructor() {}

  getTechnologies() {
    let technologies = [];
    // Remote Call
    return new Promise((resolve, reject) => {
      axios.get('http://localhost:5000/api/technologies')
      .then(result => {
        debugger;
        if (result.data) {
          result.data.forEach(tech => {
            let image = images.find(x => x.name === tech.name);
            technologies.push(new Technology(
              tech.name, tech.versionNumber, tech.versionLastDate, image ? image.imageUrl : null
            ))
          });
      
          resolve(technologies);
        } else {
          reject();
        }
      })
      .catch(err => {
        reject(err);
      });
    });

    // Local Mocking
    // mockTechnologies.forEach(mockTech => {
    //   let image = images.find(x => x.name === mockTech.name);
    //   technologies.push(new Technology(
    //     mockTech.name, mockTech.versionNumber, mockTech.versionLastDate, image ? image.imageUrl : null
    //   ))
    // });

    // return technologies;
  }

}

export default TechnologyService;