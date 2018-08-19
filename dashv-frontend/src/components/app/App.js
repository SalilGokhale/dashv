import React, { Component } from 'react';
import TechItem from '../tech-item/TechItem';
import './App.css';
import { Technology } from '../../entities/Technology';
import TechnologyService from '../../services/TechnologyService';

class App extends Component {

  technologies = Array(14).fill(new Technology("Angular", "6.1.1", "14/05/18"));
  technologyService = new TechnologyService();

  constructor(props) {
    super(props);
  }

  getColumnNumber(array) {
    let remainder = array.length % 9;
    return (array.length + (9 - remainder)) / 3;
  }

  render() {
    debugger;
    let numberOfColumns = this.getColumnNumber(this.technologies);

    return (
      <div className="h-100">
        <header className="app-header d-flex align-items-center justify-content-center">
          <h1 className="app-title">D A S H V</h1>
        </header>
        <div className="container">
          <div className="row">
            {
              Array(numberOfColumns).fill(1).map((col, i) => {
              return (
                <div className="col-sm d-flex justify-content-around column">
                  { Array(3).fill(1).map((cell, j) => {
                    if (i * 3 + j < this.technologies.length) {
                      let technology = this.technologies[i * 3 + j];
                      return <TechItem title={technology.name} versionNumber={technology.versionNumber}
                        versionLastDate={technology.versionLastDate} />
                    }
                    return <div className="mx-2 empty-item"></div>;
                  })}
                </div>);
            })
          }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
