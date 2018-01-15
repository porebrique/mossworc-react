import React from 'react';
import * as lodash from 'lodash';
import PropTypes from 'prop-types';
import { directionKeys } from 'mw/config/consts';
import { Cell, CoordCell } from './cell';
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
      'populateCells',
      'getCellsOfWord',
      'getWordsOfCell',
      'getInvalidCells',
      'isCellInWord',
      'generateGrid',
      'generateRow',
      'getRows',
      'moveWord',
      'validate',
      'selectWord',
      'renderCell',
      'renderRow'
    ]);
    const cells = this.generateGrid();
    this.state = {
      cells,
      invalidCells: [],
      selectedWord: null
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.words !== nextProps.words) {
      const cells = this.generateGrid(nextProps);
      this.setState({ cells }, this.validate);
    }
  }

  getRows() {
    const { width } = this.props;
    const { cells } = this.state;
    return lodash.chunk(cells, width);
  }

  generateGrid(props = this.props) {
    const { height } = props;
    const rows = lodash.range(height).map(this.generateRow);
    const cells = lodash.concat(...rows);
    this.populateCells(cells, props);
    return cells;
  }

  generateRow(rowIndex) {
    const { width } = this.props;
    return lodash.range(width).map(index => this.generateCell(index, rowIndex));
  }

  generateCell(x, y) {
    return {
      id: `${x}-${y}`,
      x,
      y,
      letter: null
    };
  }

  populateCells(cells, props = this.props) {
    const { words } = props;
    const splitWords = lodash.groupBy(words, 'direction');
    lodash.forEach(splitWords, value => {
      value.forEach(this.populateCellsOfWord.bind(this, cells));
    });
  }

  getInvalidCells() {
    const { words } = this.props;

    const aggregatedCells = words.map(word => {
      const cells = this.getCellsOfWord(word);
      return { word, cells };
    });

    return lodash.reduce(aggregatedCells, (result, { word, cells }) => {
      const invalidCells = lodash.filter(cells, (cell, index) => {
        return cell.letter !== word.answer[index];
      });
      return [ ...result, ...invalidCells ];
    }, []);
  }

  getCellsOfWord(word, cells = this.state.cells) {
    return lodash.map(word.answer, (letter, letterIndex) => {
      const { start, direction } = word;
      const coordsToMatch = {
        x: direction === 'h' ? start.x + letterIndex : start.x,
        y: direction === 'v' ? start.y + letterIndex : start.y,
      };
      return lodash.find(cells, coordsToMatch);
    });
  }

  getWordsOfCell(cell) {
    const { words } = this.props;
    return words.filter(word => {
      return this.isCellInWord(cell, word);
    });
  }

  isCellInWord(cell, word) {
    const cellsForWord = this.getCellsOfWord(word);
    return lodash.some(cellsForWord, { id: cell.id });
  }

  populateCellsOfWord(cells, word, wordIndex) {
    const cellsForWord = this.getCellsOfWord(word, cells);

    // TODO: prevent such situations
    if (word.answer.length > lodash.compact(cellsForWord).length) {
      throw new Error(`Grid.populateCellsOfWord: word ${word.answer} is beyond Grid's boundaries`);
    }

    cellsForWord.forEach((cell, index) => {
      cell.letter = word.answer[index];
      if (index === 0) {
        cell.wordNumber = wordIndex + 1;
      }
    });
  }

  selectWord(cell) {
    let selectedWord;
    if (cell.letter) {
      const { selectedWord: currentlySelectedWord } = this.state;
      const containingWords = this.getWordsOfCell(cell);
      selectedWord = lodash.find(containingWords, word => {
        // If clicked cell is contained in only one word, simply select it
        // If there is several words, let's return one which is not currently selected
        return containingWords.length === 1 ? true : word !== currentlySelectedWord;
      });
    } else {
      selectedWord = null;
    }

    this.setState({ selectedWord });
  }

  moveWord(event) {
    const { selectedWord } = this.state;
    if (!selectedWord) {
      return null;
    }
    const { key } = event;
    const allowedKeys = Object.keys(directionKeys);
    const isKeySupported = allowedKeys.indexOf(key) !== -1;
    if(isKeySupported) {
      this.props.onMoveWord(selectedWord, directionKeys[key])
    }
  }

  validate() {
    // TODO: words should not have common border, only intersections are allowed
    // TODO: notify Editor about validity
    const invalidCells = this.getInvalidCells();
    this.setState({ invalidCells });
  }

  renderCell(cell, key) {
    const { selectedWord, invalidCells } = this.state;
    const isInvalid = lodash.includes(invalidCells, cell);
    const isSelected = selectedWord ? this.isCellInWord(cell, selectedWord) : false;
    const props = {
      key,
      isInvalid,
      isSelected,
      ...cell,
      onSelect: this.selectWord
    };
    const CellComponent = cell.isCoord ? CoordCell : Cell;
    return <CellComponent {...props} />;
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
    const renderedRows = this.getRows().map(this.renderRow);

    const gridProps = {
      className: 'mw-grid',
      tabIndex: 0,
      children: renderedRows,
      onKeyDown: this.moveWord
    };

    return <div {...gridProps} />;
  }
}
