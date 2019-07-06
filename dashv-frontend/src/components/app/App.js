import React, { Component } from 'react';
import TechItem from '../tech-item/TechItem';
import './App.css';
import { Technology } from '../../entities/Technology';
import TechnologyService from '../../services/TechnologyService';
import { technologies } from '../../data/Technologies';

class App extends Component {

  technologyService = new TechnologyService();

  constructor(props) {
    super(props);
    this.state = {
      technologies: technologies
    }
    this.getTechnologies();
  }

  getTechnologies() {
    this.technologyService.getTechnologies().then(technologies => {
      if (technologies === null) {
        return;
      }
      
      this.setState({
        technologies: technologies
      });
    })
    .catch(err => {
      throw err;
    });
  }

  getColumnNumber(array) {
    let remainder = array.length % 9;
    return (array.length + (9 - remainder)) / 3;
  }

  render() {
    debugger;

    if (this.state.technologies.length == 0) {
      // Put Loading Indicator here
      return <div></div>
    }
    let numberOfColumns = this.getColumnNumber(this.state.technologies);
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
                    if (i * 3 + j < this.state.technologies.length) {
                      let technology = this.state.technologies[i * 3 + j];
                      return <TechItem key={technology.name} title={technology.displayName} versionNumber={technology.versionNumber}
                        versionLastDate={technology.versionLastDate} imageUrl={technology.imageUrl} />
                    }
                    return <div key={i.toString() + j.toString()} className="mx-2 empty-item"></div>;
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
