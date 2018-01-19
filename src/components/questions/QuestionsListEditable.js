import React from "react";
import PropTypes from "prop-types";
import * as lodash from "lodash";
import { RaisedButton } from "material-ui";
import WordDialog from "./word-form";
import QuestionsList from "./QuestionsList";

export default class extends QuestionsList {

  static propTypes = {
    ...QuestionsList.propTypes,
    onDeleteWord: PropTypes.func.isRequired,
    onSaveWord: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'saveWord',
      'editWord',
      'openWordForm',
      'closeWordForm',
      'renderWordDialog'
    ]);

    this.state = {
      ...this.state,
      isWordFormVisible: false
    };
  }


  getQuestionProps(word, key) {
    const { onDeleteWord } = this.props;
    const props = super.getQuestionProps(word, key);
    return {
      ...props,
      onDelete: onDeleteWord,
      onEdit: this.editWord
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
    const sections = this.renderSections();
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
