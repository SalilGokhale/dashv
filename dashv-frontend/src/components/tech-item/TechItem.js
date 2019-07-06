import React, { Component } from 'react';
import './TechItem.css';
const vue_logo = require('../../assets/images/Angular.svg.png');

class TechItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      version: props.versionNumber ? props.versionNumber : '',
      date: props.versionLastDate ? this.parseDate(props.versionLastDate) : '',
      imageUrl: props.imageUrl
    };
  }

  parseDate(dateString) {
    var date = new Date(dateString);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

  render() {

    return (
      <div className="tech-item-container mx-2">
        <div className="tech-item h-100 w-100 d-flex flex-column align-items-center">
          <div className="title mb-1 mt-2">{this.state.title}</div>
          <img src={this.state.imageUrl} className="logo"></img>
          <div className="version mt-1">{this.state.version}</div>
          <div className="date">{this.state.date}</div>
        <div></div>
        </div>
      </div>
      
    );
  }
}

export default TechItem;
