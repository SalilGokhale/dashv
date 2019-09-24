import React, { Component } from 'react';
import TechItem from '../tech-item/TechItem';
import './App.css';
import TechnologyService from '../../services/TechnologyService';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';
import { technologies } from "../../data/Technologies";

const override = css`
    display: block;
    margin: 15 auto;
`;

class App extends Component {

  technologyService = new TechnologyService();

  constructor(props) {
    super(props);
    this.state = {
      technologies: technologies
    }
    this.getTechnologies = this.getTechnologies.bind(this);
  }

  componentDidMount() {
    this.getTechnologies();
  }

  getTechnologies() {
    this.state.technologies.forEach(tech => {
      this.technologyService.getTechnology(tech).then(techResult => {
        if (techResult === null) {
          console.log('Tech result is null');
          return;
        }
        let index = this.state.technologies.findIndex(x => x.name.toLowerCase() === techResult.name.toLowerCase());
        if (index === -1) {
          console.log('Could not find technology in state');
        }
        const newTechList = JSON.parse(JSON.stringify(this.state.technologies));
        newTechList[index] = techResult;
        this.setState({
          technologies: newTechList
        });
      }).catch(err => {
        throw err;
      });
    });
  }

  getColumnNumber(array) {
    let remainder = array.length % 9;
    if (remainder === 0) {
      return array.length / 3;
    }
    return (array.length + (9 - remainder)) / 3;
  }

  content() {
    if (this.state.technologies.length === 0) {
      return this.loadingSpinner;
    }
    let numberOfColumns = this.getColumnNumber(this.state.technologies);
    return (
      <ReactCSSTransitionGroup
          transitionName="example"
          transitionAppear={true}
          transitionAppearTimeout={1000}
          transitionEnter={false}
          transitionLeave={false}>

      <div className="container">
        <div className="row">
          {
            Array(numberOfColumns).fill(1).map((col, i) => {
            if (i * 3 >= this.state.technologies.length) {
              return (<div key={i} className="col-sm d-flex justify-content-around column phantom-column">
                { Array(3).fill(1).map((cell, j) => {
                  return <div key={i.toString() + j.toString()} className="mx-2 empty-item"></div>;
                })}
              </div>);
            }
            return (
              <div key={i} className="col-sm d-flex justify-content-around column">
                { Array(3).fill(1).map((cell, j) => {
                  if (i * 3 + j < this.state.technologies.length) {
                    let technology = this.state.technologies[i * 3 + j];
                    return <TechItem key={technology.name} title={technology.displayName} versionNumber={technology.versionNumber}
                      versionLastDate={technology.versionLastDate} imageUrl={technology.imageUrl} repoUrl={technology.repoUrl} />
                  }
                  return <div key={i.toString() + j.toString()} className="mx-2 empty-item"></div>;
                })}
              </div>);
          })
        }
        </div>
      </div>
      </ReactCSSTransitionGroup>
    );
  }

  loadingSpinner = (
      <div key="L" className="h-50 w-100 d-flex justify-content-center align-items-center test">
        <div className='sweet-loading'>
          <BounceLoader
              css={override}
              sizeUnit={"px"}
              size={40}
              color={'black'}
              loading={true}
          />
        </div>
      </div>
  );

  render() {
    return (
      <div className="h-100">
        <header className="app-header d-flex align-items-center justify-content-center flex-column">
          <h1 className="app-title">D A S H V</h1>
          <h5 className="app-sub-title pt-3">A site to show the current versions of popular open source technologies</h5>
        </header>
        {this.content()}
      </div>
    );
    
  }
}

export default App;
