import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import { TextField, RadioButtonGroup, RadioButton } from 'material-ui';

export default class extends Component {

  static propTypes = {
    question: PropTypes.string,
    answer: PropTypes.string,
    direction: PropTypes.string,
    onUpdate: PropTypes.func.isRequired
  };

  static defaultProps = {
    question: null,
    answer: null,
    direction: null
  };

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'update'
    ]);
  }

  update(event) {
    const { name, value } = event.target;
    this.props.onUpdate({ name, value });
  }

  renderDirectionSwitch() {
    const { direction } = this.props;

    const hOptionProps = {
      label: 'Across',
      className: 'option-row',
      value: 'h'
    };

    const vOptionProps = {
      label: 'Down',
      className: 'option-row',
      value: 'v'
    };

    const groupProps = {
      name: 'direction',
      defaultSelected: direction,
      className: 'direction-switch',
      onChange: this.update
    };

    return (
      <RadioButtonGroup {...groupProps}>
        <RadioButton {...hOptionProps} />
        <RadioButton {...vOptionProps} />
      </RadioButtonGroup>
    );
  }

  render() {
    const { question, answer } = this.props;
    const questionProps = {
      name: 'question',
      floatingLabelText: 'Question',
      defaultValue: question,
      onChange: this.update,
      fullWidth: true
    };

    const answerProps = {
      name: 'answer',
      defaultValue: answer,
      floatingLabelText: 'Answer',
      onChange: this.update,
      fullWidth: true
    };

    const directionSwitch = this.renderDirectionSwitch();
    return (
      <div className="mw-word-form">
        <TextField {...questionProps} />
        <TextField {...answerProps} />
        {directionSwitch}
      </div>
    );
  }
}
