'use strict'

import React, { Component } from 'react';
import {
  View,
  Text, 
  StyleSheet 
} from 'react-native';

import Animated from 'Animated';
import Data from './Data';

var data = new Data();

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      img: null,
      bounceValue: new Animated.Value(0),
    };
  }

  loadData() {
    data.getCover()
      .then((result) => {
        if(result) {
          this.setState({img: result.img});
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }

  componentDidMount() {
    this.loadData();
    this.state.bounceValue.setValue(1);
    Animated.timing(                        
      this.state.bounceValue,                
      {
        toValue: 1.2,                       
        duration: 5000,                       
      }
    ).start();           
  }

  render() {
    var cover;
    if(this.state.img) {
      cover = {uri: this.state.img}
    } else {
      cover = {uri: 'https://pic4.zhimg.com/v2-b427763c3d75885c041d4de069923e93.jpg'};
    }
    return (
      <Animated.Image
        source={cover}
        style={{
          flex: 1,
          transform: [
            {scale: this.state.bounceValue},
          ]
        }}
      />
    );
  }
}