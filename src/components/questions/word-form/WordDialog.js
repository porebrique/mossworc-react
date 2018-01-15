import React, { Component } from 'react';
import PropTypes from 'prop-types';
import  * as lodash from 'lodash';
import { Dialog, FlatButton } from 'material-ui';
import WordForm from './WordForm';
import './styles.scss';

export default class extends Component {

  static propTypes = {
    word: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  static defaultProps = {
    word: null
  };

  static requiredFields = ['question', 'answer', 'direction'];

  constructor(props) {
    super(props);
    lodash.bindAll(this, [
      'isValid',
      'update',
      'close',
      'submit'
    ]);

    this.state = {
      formData: {
        ...props.word
      }
    };
  }

  isValid() {
    const { formData } = this.state;
    const { requiredFields } = this.constructor;
    return lodash.every(requiredFields, fieldName => !!formData[fieldName]);
  }

  close() {
    this.props.onClose();
  }

  submit() {
    const initialWord = this.props.word || {};
    const { formData } = this.state;
    lodash.merge(initialWord, formData);
    this.props.onSubmit(initialWord);
  }

  update({ name, value }) {
    const formData = {
      ...this.state.formData,
      [name]: value
    };
    this.setState({ formData });
  }

  renderButton(type) {
    let props;
    switch(type) {
      case 'submit':
        props = {
          disabled: !this.isValid(),
          label: 'OK',
          primary: true,
          onClick: this.submit
        };
        break;
      case 'cancel':
        props = {
          label: 'Cancel',
          onClick: this.close
        };
        break;
      default:
        break;
    }

    return <FlatButton {...props} />;
  }

  renderForm() {
    const { question, answer, direction } = this.state.formData;
    const props = {
      question,
      answer,
      direction,
      onUpdate: this.update
    };
    return <WordForm {...props}/>;
  }

  render() {
     const actions = [
       this.renderButton('submit'),
       this.renderButton('cancel')
     ];

    const props = {
      open: true,
      actions,
      modal: false,
      onRequestClose: this.close
    };

    const form = this.renderForm();

    return (
      <Dialog {...props}>
        <div className="mw-word-dialog">
          {form}
        </div>
      </Dialog>
    );
  }
}
