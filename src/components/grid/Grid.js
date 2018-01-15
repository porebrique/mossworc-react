import React from 'react';
import * as lodash from 'lodash';
import PropTypes from 'prop-types';
import { directionKeys } from 'mw/config/consts';
import Cell from './Cell';
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
      'getWordsOfCell',
      'getInvalidCells',
      'isCellInWord',
      'generateGrid',
      'generateEmptyRow',
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
    const rows = lodash.range(height).map(this.generateEmptyRow);
    const cells = lodash.concat(...rows);
    this.populateCells(cells, props);
    return cells;
  }

  generateEmptyRow(rowIndex) {
    const { width } = this.props;
    return lodash.range(width).map(index => this.generateEmptyCell(index, rowIndex));
  }

  generateEmptyCell(x, y) {
    return {
      id: `${x}-${y}`,
      x,
      y,
      letter: null
    };
  }

  populateCells(cells, props = this.props) {
    const { words } = props;
    const wordsByDirection = lodash.groupBy(words, 'direction');
    lodash.forEach(wordsByDirection, sameDirectionWords => {
      sameDirectionWords.forEach(this.populateCellsOfWord.bind(this, cells));
    });
  }

  getInvalidCells() {
    const { words } = this.props;
    const { cells: allCells } = this.state;

    const aggregatedCells = words.map(word => {
      const cells = this.getCellsOfWord(word, allCells);
      return { word, cells };
    });

    return lodash.reduce(aggregatedCells, (result, { word, cells }) => {
      const invalidCells = lodash.filter(cells, (cell, index) => cell.letter !== word.answer[index]);
      return [ ...result, ...invalidCells ];
    }, []);
  }

  getCellsOfWord(word, cells) {
    const { start, direction, answer } = word;
    return lodash.map(answer, (letter, letterIndex) => {
      const shiftX = direction === 'h' ? letterIndex : 0;
      const shiftY = direction === 'v' ? letterIndex : 0;
      const coordsToMatch = {
        x: start.x + shiftX,
        y: start.y + shiftY
      };
      return lodash.find(cells, coordsToMatch);
    });
  }

  getWordsOfCell(cell) {
    const { words } = this.props;
    return words.filter(word => this.isCellInWord(cell, word));
  }

  isCellInWord(cell, word) {
    const { cells } = this.state;
    const cellsForWord = this.getCellsOfWord(word, cells);
    return lodash.some(cellsForWord, { id: cell.id });
  }

  populateCellsOfWord(cells, word, wordIndex) {
    const { answer } = word;
    const cellsForWord = this.getCellsOfWord(word, cells);

    // TODO: prevent such situations
    const isWordOutsideOfGrid = answer.length > lodash.compact(cellsForWord).length;
    if (isWordOutsideOfGrid) {
      throw new Error(`Grid.populateCellsOfWord: word ${answer} is beyond Grid's boundaries`);
    }

    cellsForWord.forEach((cell, index) => {
      cell.letter = answer[index];
    });
    cellsForWord[0].wordNumber = wordIndex + 1;
  }

  // TODO: Consider support for more than two containing works (now selection just switches between two of them)
  selectWord(cell) {
    let selectedWord = null;
    // TODO: Not sure that having a letter is correct criteria
    if (cell.letter) {
      const { selectedWord: currentlySelectedWord } = this.state;
      const containingWords = this.getWordsOfCell(cell);
      // Next string implicitly covers the case when there is only one word containing given cell
      selectedWord = containingWords.find(word => word !== currentlySelectedWord);
    }

    this.setState({ selectedWord });
  }

  moveWord({ key }) {
    const { selectedWord } = this.state;
    if (!selectedWord) {
      return null;
    }
    const allowedKeys = Object.keys(directionKeys);
    const isKeySupported = lodash.includes(allowedKeys, key);
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
