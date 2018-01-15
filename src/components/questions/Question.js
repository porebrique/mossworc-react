import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import { ListItem, IconMenu, MenuItem, IconButton } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import './styles.scss';

export default class extends Component {

  static propTypes = {
    number: PropTypes.number.isRequired,
    word: PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired
    }).isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
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

  getActionsMenu() {
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
    const { number, word } = this.props;
    const { question, answer } = word;

    const rightIconMenu = this.getActionsMenu();
    const props = {
      primaryText: `${number}. ${question}`,
      secondaryText: `(${answer})`,
      rightIconButton: rightIconMenu,
      onClick: this.onWordClick
    };
    return <ListItem {...props} />;
  }


}
