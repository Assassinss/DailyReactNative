'use strict';

import React, { Component } from 'react';
import {
  View,
  Text, 
  StyleSheet,
  ToolbarAndroid,
  Image,
  PixelRatio,
  Animated,
  TouchableOpacity
} from 'react-native';

import MyWebView from './WebView'; 

var STORY_URL = "http://news-at.zhihu.com/api/4/news/";

var PIXELRATIO = PixelRatio.get();
var HEADER_SIZE = 200;

export default class StoryDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      detail: null,
      url: null,
      scrollY: 0,
      scrollValue: new Animated.Value(0)
    };
  }

  componentDidMount() {
    this.loadStoryDetail();
  }

  loadStoryDetail() {
    var url = STORY_URL + this.props.stories.id;
    this.setState({
      isLoading: true,
      detail: null
    });
    fetch(url)
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          isLoading: false,
          detail: null
        });
      })
      .then((responseData) => {
        console.log(responseData.css[0]);
        this.setState({
          isLoading: false,
          detail: responseData,
        });
      })
      .done();
  }

  webViewScroll(event) {
    var scrollY = -event / PIXELRATIO;
    this.state.scrollValue.setValue(scrollY);
  }

  onExit() {
    this.props.navigator.pop();
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={[styles.container, styles.center]}>
          <Text>
            正在加载...
          </Text>
        </View>
      )
    } else {
      if (this.state.detail) {
        var translateY = this.state.scrollValue.interpolate({
          inputRange: [0, HEADER_SIZE, HEADER_SIZE + 1], outputRange: [0, HEADER_SIZE, HEADER_SIZE]
        });
         var html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="'
          + this.state.detail.css[0]
          + '" /></head><body>' + this.state.detail.body
          + '</body></html>';
        return (
          <View style={styles.container}>
            <View style={styles.toolbar}>
              <TouchableOpacity onPress={this.onExit.bind(this)}>
                 <Image style={styles.navIcon} source={require('image!ic_back_white')}/>
              </TouchableOpacity>
              <Text style={styles.navTitle}>Story</Text>
            </View>
            <MyWebView
              style={styles.content}
              html={html}
              onScrollChange={this.webViewScroll.bind(this)}/>
            <Animated.View style={[styles.header, {transform: [{translateY}]}]}>
              <Image
                ref={'header'}
                source={{uri: this.state.detail.image}}
                style={styles.headerImage} >
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {this.props.stories.title}
                  </Text>
                </View> 
              </Image>
            </Animated.View>
          </View> 
        )
      } else {
        return (
          <View style={[styles.container, styles.center]}>
            <Text>
              加载失败
            </Text>
          </View>
        )
      }
    }
  }
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: '#009688',
    height: 56,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row'
  },

  header: {
    height: 200,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 56,
  },

  headerImage: {
    height: 200,
    flexDirection: 'row',
    backgroundColor: '#DDDDDD',
  },

  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  title: {
    fontSize: 24,
    fontWeight: '500',
    color: 'white',
  },

  container: {
    flex: 1,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    top:0,
  },

  navIcon: {
    width: 24,
    height: 24,
    marginRight: 32,
  },

  navTitle: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold'
  }
});