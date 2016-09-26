'use strict';

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  BackAndroid
} from 'react-native';

import SplashScreen from './SplashScreen';
import MainScreen from './MainScreen';
import TimerMixin from 'react-timer-mixin';
import StoryDetail from './StoryDetail';

var _navigator;

BackAndroid.addEventListener('hardwareBackPress', function() {
  if(_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
})

class DailyReactNative extends Component {
  componentDidMount() {
    this.timer = setTimeout(
      () => {
        this.setState({splashed: true});
      }, 2000
    )
  }

  configureScene(route) {
    return Navigator.SceneConfigs.FadeAndroid;
  }

  constructor(props) {
    super(props);
    this.state = { splashed: false }
  }

  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.name == 'home') {
      return (
        <View style={styles.container}>
          <MainScreen navigator={navigator} />
        </View>
      )
    } else if (route.name == 'stories') {
      return (
        <View style={styles.container}>
          <StoryDetail 
            style={{flex: 1}}
            navigator={navigator}
            stories={route.stories}
          />
        </View>
      )
    }
  }

  render() {
    if(this.state.splashed) {
      var route = {name: 'home'};
      return (
        <Navigator 
          style={styles.container}
          initialRoute={route}
          configureScene={this.configureScene}
          renderScene={this.renderScene}
        />
      );
    } else {
       return <SplashScreen />
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

});


AppRegistry.registerComponent('DailyReactNative', () => DailyReactNative);
