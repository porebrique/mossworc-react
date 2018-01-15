import React from 'react';
import PropTypes from 'prop-types';

export default class extends React.Component {

  static propTypes = {
    letter: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static defaultProps = {
    letter: null,
  };

  render() {
    const { letter} = this.props;
    // Very first coord cell in first row contains 0, we don't need to display it,
    // because it doesn't really point to meaningful letter cells
    const renderedLetter = letter || null;

    return (
      <span className="mw-grid-cell mw-grid-cell-coord">
        <span className="cell-letter">{renderedLetter}</span>
      </span>
    );
  }
}
