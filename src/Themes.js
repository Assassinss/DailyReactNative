'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  TouchableNativeFeedback,
  StyleSheet
} from 'react-native';
import createDataSource from './utils/createDataSource';
import DataRepository from './DataRepository';

var repository = new DataRepository();

export default class Themes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: createDataSource()
    }
  }

  fetchThemes() {
    repository.fetchThemes()
      .then((themes) => {
        this.setState({ dataSource: this.state.dataSource.cloneWithRows(themes) })
      })
      .catch((error) => console.log(error))
      .done();
  }

  componentDidMount() {
    this.fetchThemes();
  }

  renderHeader() {
    return (
      <View style={styles.headerContent}>
        <View style={{ height: 150, backgroundColor: 'skyblue' }} />
        <TouchableNativeFeedback
          onPress={this.onSelectTheme.bind(this, null)}
          background={TouchableNativeFeedback.SelectableBackground()} >
          <View style={{ flex: 1, marginTop: 8 }}>
            <Text style={styles.headerItemText}>首页</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  onSelectTheme(theme) {
    this.props.onSelectTheme(theme);
  }

  renderThemes(theme) {
    return (
      <TouchableNativeFeedback
        onPress={this.onSelectTheme.bind(this, theme)}
        background={TouchableNativeFeedback.SelectableBackground()}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>{theme.name}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    return (
      <ListView style={{ flex: 1 }}
        dataSource={this.state.dataSource}
        renderRow={this.renderThemes.bind(this)}
        renderHeader={this.renderHeader.bind(this)} />
    )
  }

}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'column'
  },

  headerItemText: {
    fontSize: 14,
    padding: 16,
    color: '#000000'
  },

  text: {
    fontSize: 14,
    padding: 16,
    color: '#000000'
  }
});
