import React, { Component } from 'react';
import './TechItem.css';

class TechItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      version: props.versionNumber ? props.versionNumber : '',
      date: props.versionLastDate ? this.parseDate(props.versionLastDate) : '',
      imageUrl: props.imageUrl,
      repoUrl: props.repoUrl
    };
    this.handleClick = this.handleClick.bind(this);
  }

  parseDate(dateString) {
    var date = new Date(dateString);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

  handleClick() {
    window.open(this.state.repoUrl);
  }

  render() {

    return (
      <div className="tech-item-container mx-2">
        <div className="tech-item h-100 w-100 d-flex flex-column align-items-center" onClick={this.handleClick}>
          <div className="title mb-1 mt-2">{this.state.title}</div>
          <img src={this.state.imageUrl} alt={this.state.title} className="logo"></img>
          <div className="version mt-1">{this.state.version}</div>
          <div className="date">{this.state.date}</div>
        <div></div>
        </div>
      </div>
      
    );
  }
}

export default TechItem;
