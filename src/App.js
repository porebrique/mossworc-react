import React, { Component } from 'react';
import './styles/App.scss';
import { Header, Editor } from 'mw/components';
import WORDS_MOCK from './WordsMock';

export default class extends Component {

  render() {
    const words = WORDS_MOCK;

    const editorProps = {
      words
    };

    return (
      <div className="App">
        <Header />
        <div className="page-content">
          <Editor {...editorProps} />
        </div>
      </div>
    );
  }
}
