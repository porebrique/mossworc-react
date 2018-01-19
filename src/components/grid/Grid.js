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
    selectedWord: PropTypes.object,
    onSelectWord: PropTypes.func.isRequired,
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
  }

  isCellInSelectedWord(cell) {
    const { selectedWord } = this.props;
    return lodash.includes(cell.words, selectedWord);
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
      isBlank: !words.length,
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
    const { selectedWord: currentlySelectedWord } = this.props;
    const selectedWord = cell.words.find(word => word !== currentlySelectedWord) || null;
    this.props.onSelectWord(selectedWord);
  }

  moveWord({ key }) {
    const { selectedWord } = this.props;
    const isMovingAllowed = selectedWord && gridUtils.isKeySupported(key);
    if (isMovingAllowed) {
      this.props.onMoveWord(selectedWord, directionKeys[key])
    }
  }

  renderCell(cell, key) {
    const { isValid } = cell;
    const isSelected = this.isCellInSelectedWord(cell);
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
