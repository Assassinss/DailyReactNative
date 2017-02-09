'use strict'

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

import Animated from 'Animated';
import DataRepository from './DataRepository';
import Loading from './Loading';

var data = new DataRepository();

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
    if (this.state.img != null) {
      this.state.bounceValue.setValue(1);
      Animated.timing(
        this.state.bounceValue,
        {
          toValue: 1.3,
          duration: 5000,
        }
      ).start();
    }
  }

  renderCover() {
    return <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{ width: 50, height: 50, backgroundColor: 'powderblue' }} />
      <View style={{ width: 50, height: 50, backgroundColor: 'skyblue' }} />
      <View style={{ width: 50, height: 50, backgroundColor: 'steelblue' }} />
    </View>
  }

  render() {
    var cover;
    if (this.state.img) {
      cover = { uri: this.state.img }
    } else {
      return this.renderCover();
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