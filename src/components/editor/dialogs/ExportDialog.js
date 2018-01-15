import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import { Dialog, FlatButton, TextField } from 'material-ui';

export default class extends Component {

  static propTypes = {
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'getSerializedConfig'
    ]);

  }

  getSerializedConfig() {
    const { words } = this.props;
    return JSON.stringify(words);
  }

  renderButton(type) {
    let props;
    switch(type) {
      case 'close':
        props = {
          label: 'Close',
          onClick: this.props.onClose
        };
        break;
      default:
        break;
    }

    return <FlatButton {...props} />;
  }

  renderForm() {

    const textProps = {
      className: 'mw-crossword-config-field',
      name: 'config',
      value: this.getSerializedConfig(),
      underlineShow: false,
      multiLine: true,
      rows: 10,
      fullWidth: true
    };
    return (
      <div>
        <TextField {...textProps} />
      </div>
    );
  }

  render() {
    const actions = [
      this.renderButton('close')
    ];

    const props = {
      open: true,
      title: 'Export crossword',
      actions,
      modal: false,
      onRequestClose: this.close
    };

    const form = this.renderForm();

    return (
      <Dialog {...props}>
        <div className="mw-export-dialog">
          <div>This is crossword's configuration. Select and copy-paste it somewhere.</div>
          {form}
        </div>
      </Dialog>
    );
  }
}
