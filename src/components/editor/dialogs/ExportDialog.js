import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import {
  Dialog,
  FlatButton,
  TextField,
  RadioButton,
  RadioButtonGroup
} from 'material-ui';

export default class extends Component {

  static propTypes = {
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
    onClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'toggleMode',
      'getSerializedConfig'
    ]);
    this.state = {
      mode: this.constructor.modes.play
    };
  }

  static modes = {
    edit: 'edit',
    play: 'play'
  };

  static hints = {
    common: 'This is crossword\'s configuration, you can copy-paste it somewhere.',
    edit: 'This one is for further edit, it contains readable answers too',
    play: 'This is a version for playing, it doesn\'t contain readable answers'
  };

  getPlayableWordConfig(word) {
    return {
      ...word,
      answer: '',
      length: word.answer.length
    };
  }

  toggleMode(event, mode) {
    this.setState({ mode });
  }

  getSerializedConfig() {
    const { words } = this.props;
    const { modes } = this.constructor;
    const { mode } = this.state;
    const config = mode === modes.edit ? words : words.map(this.getPlayableWordConfig);
    return JSON.stringify(config);
  }

  getHint() {
    const { hints } = this.constructor;
    const { mode } = this.state;
    return (
      <div>
        <div>{hints.common}</div>
        <div>{hints[mode]}</div>
      </div>
    );
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

  renderModeSwitch() {
    const { mode } = this.state;
    const { modes } = this.constructor;

    const groupProps = {
      onChange: this.toggleMode,
      valueSelected: mode,
      name: 'mode-switch'
    };

    const playProps = {
      className: 'inline',
      value: modes.play,
      label: 'For play'
    };

    const editProps = {
      className: 'inline',
      value: modes.edit,
      label: 'For edit'
    };

    return (
      <RadioButtonGroup {...groupProps}>
        <RadioButton {...playProps} />
        <RadioButton {...editProps} />
      </RadioButtonGroup>
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
    const modeSwitch = this.renderModeSwitch();
    const hint = this.getHint();

    return (
      <Dialog {...props}>
        <div className="mw-export-dialog">
          <div className="mode-switch">
            {modeSwitch}
          </div>
          <div className="hint">
            {hint}
          </div>
          {form}
        </div>
      </Dialog>
    );
  }
}
