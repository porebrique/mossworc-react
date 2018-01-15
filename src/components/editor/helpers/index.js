import { directions } from 'mw/config/consts';

export const isMovingAllowed = ({ word, direction, width, height }) => {
  const { up, right, down, left } = directions;
  let { x, y } = word.start;
  let isMovingAllowed = false;

  switch (direction) {
    case up:
      isMovingAllowed = y !== 0;
      break;
    case right: {
      const requiredSpace = word.direction === 'h' ? word.answer.length : 1;
      isMovingAllowed = x < (width - requiredSpace);
      break;
    }
    case down: {
      const requiredSpace = word.direction === 'v' ? word.answer.length : 1;
      isMovingAllowed = y < (height - requiredSpace);
      break;
    }
    case left:
      isMovingAllowed = x !== 0;
      break;
    default:
      throw new Error('Grid: Not supported direction');
  }

  return isMovingAllowed;
};