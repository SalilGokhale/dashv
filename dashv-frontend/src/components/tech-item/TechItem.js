import React, { Component } from 'react';
import './TechItem.css';
import { BeatLoader } from 'react-spinners';
import css from '@emotion/css';

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

  componentDidUpdate(prevProps) {
    if (prevProps.versionNumber !== this.props.versionNumber) {
      this.setState({
        title: this.props.title,
        version: this.props.versionNumber ? this.props.versionNumber : '',
        date: this.props.versionLastDate ? this.parseDate(this.props.versionLastDate) : '',
        imageUrl: this.props.imageUrl,
        repoUrl: this.props.repoUrl
      });
    }
  }

  parseDate(dateString) {
    var date = new Date(dateString);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  handleClick() {
    window.open(this.state.repoUrl);
  }

  versioning() {
    const override = css`
    display: flex;
    padding-top: 1rem;
    `;
    if (this.state.version === '') {
      return <div><BeatLoader
      css={override}
      sizeUnit={"px"}
      size={10}
      color={'grey'}
      loading={true}
  /></div>
    } else {
      return this.populatedVersion();
    }
  }

  populatedVersion() {
  return (<div className="d-flex flex-column align-items-center">
    <div className="version mt-1">{this.state.version}</div>
    <div className="date">{this.state.date}</div>
  </div>
  );
  }

  render() {

    return (
      <div className="tech-item-container mx-2">
        <div className="tech-item h-100 w-100 d-flex flex-column align-items-center" onClick={this.handleClick}>
          <div className="title mb-1 mt-2">{this.state.title}</div>
          <img src={this.state.imageUrl} alt={this.state.title} className="logo"></img>
          {this.versioning()}
        <div></div>
        </div>
      </div>
      
    );
  }
}

export default TechItem;
