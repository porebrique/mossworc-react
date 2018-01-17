import * as lodash from 'lodash';
import { directionKeys } from 'mw/config/consts';

/**
 * Returns an array containing coords of all word's letters
 * @param {Object} word { start: { x, y }, answer}
 * @returns {Array}
 */
const getWordCoords = word => {
  return lodash.range(word.answer.length).map(index => {
    const { start, direction } = word;
    const shiftX = direction === 'h' ? index : 0;
    const shiftY = direction === 'v' ? index : 0;
    return {
      x: start.x + shiftX,
      y: start.y + shiftY
    }
  });
};

/**
 * Returns a word's letter at given coords
 * @param word
 * @param {Object} coords { x, y}
 * @returns {String|null}
 */
const getLetterByCoords = (word, { x, y }) => {
  const wordLettersCoords = getWordCoords(word);
  const index = lodash.findIndex(wordLettersCoords, { x, y });
  return word.answer[index] || null;
};

/**
 * Returns true if letter's words intersect with no conflicts (i.e "cat" and "bat" don't intersect by first letter)
 * @param {Object} cell
 * @returns {Boolean}
 */
const isCellValid = cell => {
  const { words, x, y } = cell;
  if (words.length < 2) {
    return true;
  }
  const letters = cell.words.map(word => getLetterByCoords(word, { x, y}));
  return lodash.every(letters, letter => letter === letters[0]);
};

/**
 * Returns true if key is supported to move selected word around grid
 * @param {String} key
 * @returns {Boolean}
 */
const isKeySupported = key => {
  const allowedKeys = Object.keys(directionKeys);
  return lodash.includes(allowedKeys, key);
};

export {
  isCellValid,
  isKeySupported,
  getWordCoords,
  getLetterByCoords
}
