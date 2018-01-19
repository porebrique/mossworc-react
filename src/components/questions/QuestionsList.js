import React, {Component} from "react";
import PropTypes from "prop-types";
import * as lodash from "lodash";
import {Divider, List, Subheader} from "material-ui";
import Question from "./Question";

import "./styles.scss";

export default class extends Component {

  static propTypes = {
    selectedWord: PropTypes.object,
    words: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static sectionTitles = {
    h: 'Across',
    v: 'Down'
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'renderWord'
    ]);

    this.state = {
      selectedWord: null
    };
  }

  getQuestionProps(word, key) {
    const { selectedWord } = this.props;
    const isSelected = selectedWord === word;

    return {
      key,
      number: key + 1,
      word,
      isSelected
    };
  }

  renderWord(word, key) {
    const props = this.getQuestionProps(word, key);
    return <Question {...props} />;
  }

  renderSections() {
    return (
      <div>
        {this.renderSection('h')}
        <Divider key="divider" />
        {this.renderSection('v')}
      </div>
    );
  }

  renderSection(direction) {
    const { words } = this.props;
    const sectionTitle = this.constructor.sectionTitles[direction];
    const filteredWords = lodash.filter(words, { direction });
    const renderedWords = filteredWords.map(this.renderWord);
    return (
      <List className="mw-words-direction-section" key={direction}>
        <Subheader>{sectionTitle}</Subheader>
        {renderedWords}
      </List>
    );
  }

  render() {
    const sections = this.renderSections();
    return (
      <div className="mw-words">
        {sections}
      </div>
    );
  }
}
