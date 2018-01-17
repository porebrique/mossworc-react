import React, {Component} from "react";
import PropTypes from "prop-types";
import * as lodash from "lodash";
import {Divider, List, RaisedButton, Subheader} from "material-ui";
import WordDialog from "./word-form";
import Question from "./Question";

import "./styles.scss";

export default class extends Component {

  static propTypes = {
    selectedWord: PropTypes.object,
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDeleteWord: PropTypes.func.isRequired,
    onSaveWord: PropTypes.func.isRequired
  };

  static sectionTitles = {
    h: 'Across',
    v: 'Down'
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'saveWord',
      'editWord',
      'openWordForm',
      'closeWordForm',
      'renderWord',
      'renderWordDialog'
    ]);

    this.state = {
      selectedWord: null,
      isWordFormVisible: false
    };
  }


  openWordForm(){
    this.setState({ isWordFormVisible: true });
  }

  closeWordForm(){
    this.setState({ isWordFormVisible: false, selectedWord: null });
  }

  editWord(word) {
    this.setState({ selectedWord: word });
    this.openWordForm();
  }

  saveWord(word) {
    this.props.onSaveWord(word);
    this.closeWordForm();
  }

  renderWord(word, key) {
    const { selectedWord, onDeleteWord } = this.props;
    const isSelected = selectedWord === word;

    const props = {
      key,
      number: key + 1,
      word,
      isSelected,
      onDelete: onDeleteWord,
      onEdit: this.editWord
    };
    return <Question {...props} />;
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

  renderWordDialog() {
    const { isWordFormVisible, selectedWord: word } = this.state;

    if (!isWordFormVisible) {
      return null;
    }

    const props = {
      word,
      onSubmit: this.saveWord,
      onClose: this.closeWordForm
    };
    return <WordDialog {...props} />;
  }

  render() {
    const sections = [
      this.renderSection('h'),
      <Divider key="divider" />,
      this.renderSection('v')
    ];

    const dialog = this.renderWordDialog();

    return (
      <div className="mw-words">
        {sections}
        <RaisedButton onClick={this.openWordForm}>Add word</RaisedButton>
        {dialog}
      </div>
    );
  }
}
