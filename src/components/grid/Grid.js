import React from 'react';
import * as lodash from 'lodash';
import PropTypes from 'prop-types';
import { directionKeys } from 'mw/config/consts';
import Cell from './Cell';
import * as gridUtils from './utils';
import './style.scss';

export default class extends React.Component {

  static propTypes = {
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
    onMoveWord: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'createGrid',
      'createRow',
      'moveWord',
      'selectWord',
      'renderCell',
      'renderRow'
    ]);
    this.state = {
      // TODO: consider passing this word to parent component instead of storing here
      // (could be useful for highlighting a question in a list)
      selectedWord: null
    };
  }

  createGrid() {
    const { height } = this.props;
    return lodash.range(height).map(this.createRow);
  }

  createRow(rowIndex) {
    const { width } = this.props;
    return lodash.range(width).map(index => this.createCell(index, rowIndex));
  }

  createCell(x, y) {
    const cellCoords = { x, y };
    const words = this.findCellWords(cellCoords);
    const cell =  {
      id: `${x}-${y}`,
      x,
      y,
      words
    };
    const isValid = gridUtils.isCellValid(cell);
    const letter = isValid ? this.findCellLetter(cellCoords, words) : null;
    return {
      ...cell,
      letter,
      isValid
    };
  }

  findCellLetter(cellCoords, [word]) {
    if (!word) {
      return null;
    }
    return gridUtils.getLetterByCoords(word, cellCoords);
  }

  findCellWords(cellCoords) {
    const { x, y } = cellCoords;
    const { words } = this.props;
    const result = words.filter(word => {
      // TODO: avoid re-generating for every cell, maybe store extended words data in state?
      const wordLettersCoords = gridUtils.getWordCoords(word);
      return lodash.find(wordLettersCoords, { x, y });
    });
    return result;
  }

  selectWord(cell) {
    const { selectedWord: currentlySelectedWord } = this.state;
    const selectedWord = cell.words.find(word => word !== currentlySelectedWord) || null;
    this.setState({ selectedWord });
  }

  moveWord({ key }) {
    const { selectedWord } = this.state;
    const isMovingAllowed = selectedWord && gridUtils.isKeySupported(key);
    if (isMovingAllowed) {
      this.props.onMoveWord(selectedWord, directionKeys[key])
    }
  }

  renderCell(cell, key) {
    const { selectedWord } = this.state;
    const { isValid } = cell;
    const isSelected = lodash.includes(cell.words, selectedWord);
    const props = {
      key,
      isInvalid: !isValid,
      isSelected,
      ...cell,
      onSelect: this.selectWord
    };
    return <Cell {...props} />;
  }

  renderRow(row, key) {
    const cells = row.map(this.renderCell);
    const rowProps = {
      key,
      className: 'mw-grid-row',
      children: cells
    };
    return <div {...rowProps} />;
  }

  render() {
    const renderedRows = this.createGrid().map(this.renderRow);

    const gridProps = {
      className: 'mw-grid',
      tabIndex: 0,
      children: renderedRows,
      onKeyDown: this.moveWord
    };

    return <div {...gridProps} />;
  }
}
