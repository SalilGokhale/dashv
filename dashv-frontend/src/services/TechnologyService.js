import { mockTechnologies } from "./MockTechResults";
import { Technology } from "../entities/Technology";
import { images } from "./TechImages";

class TechnologyService {
  constructor() {}

  getTechnologies() {
    let technologies = [];
    // Make promise call here
    mockTechnologies.forEach(mockTech => {
      let image = images.find(x => x.name === mockTech.name);
      technologies.push(new Technology(
        mockTech.name, mockTech.versionNumber, mockTech.versionLastDate, image ? image.imageUrl : null
      ))
    });
    return technologies;
  }

}

export default TechnologyService;