'use strict'

import React, { 
  Component,
  PropTypes,
} from 'react';
import {
  requireNativeComponent,
  createReactNativeComponentClass,
  NativeModules,
  ReactNativeViewAttributes,
  StyleSheet,
  View,
} from 'react-native';

var RCTUIManager = NativeModules.UIManager;

var RK_SWIPE_REF = 'swipeRefreshlayout';
var INNERVIEW_REF = 'innerView';

var SwipeRefreshlayoutAndroid = React.createClass({
  propTypes: {
    onRefresh: PropTypes.func,
  },

  getInnerViewNode() {
    return this.refs[INNERVIEW_REF].getInnerViewNode();
  },

  render() {
    var childrenWrapper =
      <View ref={INNERVIEW_REF} style={styles.mainSubview} collapsable={false}>
        {this.props.children}
      </View>;
      return (
        <AndroidSwipeRefreshLayout>
          {this.props}
          ref={RK_SWIPE_REF}
          style={styles.base}
          onRefresh={this.onRefresh}>
          {childrenWrapper}
        </AndroidSwipeRefreshLayout>
      );
  },

  onRefresh() {
    if(this.props.onRefresh) {
      this.props.onRefresh();
    }
  },

  startRefresh() {
    RCTUIManager.dispatchViewManagerCommand(
      this.getSwipeRefreshLayoutHandle(),
      RCTUIManager.AndroidSwipeRefreshLayout.Commands.startRefresh,
      null
    );
  },

  finishRefresh() {
    RCTUIManager.dispatchViewManagerCommand(
      this.getSwipeRefreshLayoutHandle(),
      RCTUIManager.AndroidSwipeRefreshLayout.Commands.finishRefresh,
      null
    );
  },

  getSwipeRefreshLayoutHandle() {
    return React.findNodeHandle(this.refs[RK_SWIPE_REF]);
  },

});

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },

  mainSubView: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  }
});

let AndroidSwipeRefreshLayout = requireNativeComponent('SwipeRefreshlayoutAndroid', SwipeRefreshlayoutAndroid, {});
module.exports = SwipeRefreshlayoutAndroid;
