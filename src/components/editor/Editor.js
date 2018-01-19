import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';
import { RaisedButton } from 'material-ui';
import { directions } from 'mw/config/consts';
import { Grid, QuestionsListEditable } from 'mw/components';
import { isMovingAllowed } from './helpers';
import { ExportDialog } from './dialogs';

import './styles.scss';

export default class extends Component {

  static propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    words: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  static defaultProps = {
    height: 6,
    width: 8
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'isMovingAllowed',
      'deleteWord',
      'saveWord',
      'moveWord',
      'selectWord',
      'toggleExportDialog',
      'renderExportDialog'
    ]);

    this.state = {
      selectedWord: null,
      isExportDialogVisible: false,
      words: [ ...props.words ]
    }
  }

  isMovingAllowed(word, direction) {
    const { width, height } = this.props;
    return isMovingAllowed({ word, direction, width, height });
  }

  moveWord(word, direction) {
    const { up, right, down, left } = directions;
    let { x, y } = word.start;

    const isMovingAllowed = this.isMovingAllowed(word, direction);

    if (!isMovingAllowed) {
      return null;
    }

    switch (direction) {
      case up:
        y--;
        break;
      case right: {
        x++;
        break;
      }
      case down: {
        y++;
        break;
      }
      case left:
        x--;
        break;
      default:
        throw new Error('Not supported direction');
    }

    word.start = { x, y };
    this.setState({ words: [...this.state.words] });
  }

  deleteWord(word) {
    const words = [...this.state.words];
    lodash.remove(words, word);
    this.setState({ words: [...words] });
  }

  saveWord(word) {
    const { words: currentWords } = this.state;
    const newWords = [];

    const existingWords = lodash.filter(currentWords, item => item === word);

    if(existingWords.length) {
      lodash.merge(existingWords[0], word);
    } else {
      const newWord = {
        ...word,
        // TODO: find appropriate starting position, not matching with start of same-direction words
        // TODO: consider edit case after which word becomes larger than its position in Grid allows (incl. direction)
        start: {
          x: 0,
          y: 0
        }
      };
      newWords.push(newWord);
    }

    const words = [ ...currentWords, ...newWords ];
    this.setState({ words });
  }

  toggleExportDialog() {
    const isExportDialogVisible = !this.state.isExportDialogVisible;
    this.setState({ isExportDialogVisible })
  }

  selectWord(selectedWord) {
    this.setState({ selectedWord });
  }

  renderExportDialog() {
    const { isExportDialogVisible, words } = this.state;
    if (!isExportDialogVisible) {
      return null;
    }
    const props = {
      words,
      onClose: this.toggleExportDialog
    };
    return <ExportDialog {...props} />;
  }

  render() {
    const { words, selectedWord } = this.state;
    const { width, height } = this.props;

    const questionsProps = {
      words,
      selectedWord,
      onDeleteWord: this.deleteWord,
      onSaveWord: this.saveWord
    };

    const gridProps = {
      words,
      width,
      height,
      selectedWord,
      onSelectWord: this.selectWord,
      onMoveWord: this.moveWord
    };

    const exportProps = {
      title: 'Export crossword settings',
      onClick: this.toggleExportDialog
    };
    const exportDialog = this.renderExportDialog();

    return (
      <div className="mw-editor">
        <div className="mw-editor-sections">
          <div className="mw-editor-section mw-editor-words">
            <QuestionsListEditable {...questionsProps} />
          </div>
          <div className="mw-editor-section  mw-editor-grid">
            <Grid  {...gridProps} />
          </div>
        </div>
        <div className="editor-actions">
          <RaisedButton {...exportProps}>Export</RaisedButton>
        </div>
        {exportDialog}
      </div>
    );
  }
}

