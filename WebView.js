'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheetrequireNativeComponent,
  requireNativeComponent
} from 'react-native';


class ObservableWebView extends Component {
  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    if (!this.props.onScrollChange) {
      return;
    }
    this.props.onScrollChange(event.nativeEvent.ScrollY);
  }

  render() {
    return <RCTWebView {...this.props} onChange={this._onChange} />;
  }
}

ObservableWebView.propTypes = {
  ...View.propTypes,
  url: PropTypes.string,
  html: PropTypes.string,
  css: PropTypes.string,
  onScrollChange: PropTypes.func,
};

var RCTWebView = requireNativeComponent('RCTWebView', ObservableWebView, {
  nativeOnly: { onChange: true }
});

module.exports = ObservableWebView;