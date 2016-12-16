'use strict'

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

import Animated from 'Animated';
import Data from './data';
import Loading from './loading';

var data = new Data();

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
      loadingFailure: false,
      bounceValue: new Animated.Value(0),
    };
  }

  loadData() {
    data.getCover()
      .then((result) => {
        if (result) {
          this.setState({ img: result.img });
        }
      })
      .catch((error) => {
        this.setState({ img: null, loadingFailure: true });
      })
      .done();
    data.updateCover();
  }

  componentDidMount() {
    this.loadData();
    this.state.bounceValue.setValue(1);
    Animated.timing(
      this.state.bounceValue,
      {
        toValue: 1.3,
        duration: 5000,
      }
    ).start();
  }

  render() {
    var cover;
    if (this.state.img) {
      cover = { uri: this.state.img }
    } else {
      cover = { uri: 'https://pic4.zhimg.com/v2-b427763c3d75885c041d4de069923e93.jpg' };
    }

    if (this.state.loadingFailure) {
      return <Loading text={'加载出错了..'} />
    } else {
      return (
        <Animated.Image
          source={cover}
          style={{
            flex: 1,
            transform: [
              { scale: this.state.bounceValue },
            ]
          }}
          />
      )
    }
  }
}