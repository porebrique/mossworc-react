import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import classNames from 'classnames';
import { ListItem, IconMenu, MenuItem, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import './styles.scss';

export default class extends Component {

  static propTypes = {
    number: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    word: PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
  };

  static defaultProps = {
    onDelete: null,
    onEdit: null
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'isEditable',
      'onEdit',
      'onDelete'
    ]);
  }

  onWordClick() {
    // TODO
  }

  onEdit() {
    this.props.onEdit(this.props.word);
  }

  onDelete() {
    const { word, onDelete } = this.props;
    onDelete(word);
  }

  isEditable() {
    const { onDelete, onEdit } = this.props;
    return !!(onDelete && onEdit);
  }
  getActionsMenu() {
    if (!this.isEditable()) {
      return null;
    }
    const menuTrigger = (
      <IconButton
        touch={true}
        tooltip="Actions"
        tooltipPosition="bottom-left"
      >
        <MoreVertIcon />
      </IconButton>
    );

    return (
      <IconMenu iconButtonElement={menuTrigger}>
        <MenuItem onClick={this.onEdit}>Edit</MenuItem>
        <MenuItem onClick={this.onDelete}>Delete</MenuItem>
      </IconMenu>
    );
  }

  render() {
    const { number, word, isSelected } = this.props;
    const { question, answer } = word;

    const rightIconMenu = this.getActionsMenu();
    const className = classNames({ 'is-selected': isSelected });
    const props = {
      primaryText: `${number}. ${question}`,
      secondaryText: `(${answer})`,
      rightIconButton: rightIconMenu,
      className,
      onClick: this.onWordClick
    };
    return <ListItem {...props} />;
  }


}
