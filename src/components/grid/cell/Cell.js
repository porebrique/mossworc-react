import React from 'react';
import PropTypes from 'prop-types';
import * as lodash from 'lodash';
import classNames from 'classnames';

export default class extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    wordNumber: PropTypes.number,
    letter: PropTypes.string,
    isInvalid: PropTypes.bool,
    isSelected: PropTypes.bool,
    onSelect: PropTypes.func.isRequired
  };

  static defaultProps = {
    isInvalid: false,
    isSelected: false,
    wordNumber: null,
    letter: null
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'onSelect',
    ]);
  }

  onSelect() {
    this.props.onSelect(this.props);
  }

  render() {
    const { letter, isSelected, isInvalid, wordNumber } = this.props;
    const cellClassNames = classNames('mw-grid-cell', {
      'is-invalid': isInvalid,
      'is-selected': isSelected,
      'is-empty': !letter
    });

    const cellProps = {
      className: cellClassNames,
      onClick: this.onSelect
    };

    const letterToDisplay = isInvalid ? '?' : letter;

    return (
      <span {...cellProps}>
        <span className="cell-word-number">{wordNumber}</span>
        <span className="cell-letter">{letterToDisplay}</span>
      </span>
    );
  }
}
