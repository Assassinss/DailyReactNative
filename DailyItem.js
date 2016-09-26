'user strict'

import React, { Component } from 'react';
import { 
  View,
  Text,
  Image, 
  StyleSheet,
  Platform,
  TouchableHightlight,
  TouchableNativeFeedback,
} from 'react-native';

export default class DailyItem extends Component {

  render() {
    var TouchableElement = TouchableHightlight;
    if (Platform.OS == 'android') {
      TouchableElement = TouchableNativeFeedback;
    }

    return (
      <View {...this.props}>
        <TouchableElement 
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlisht}>
          <View style={styles.row}>
            <Image 
              source={{uri: this.props.stories.images[0]}}
              style={styles.thumbnail}/>
            <Text
            style={styles.title}>{this.props.stories.title}
            </Text>
          </View>
        </TouchableElement>
      </View>
    )
  }
}

const style = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 18,
  },

  thumbnail: {
    height: 80,
    marginRight: 10,
    width: 80,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 5,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  },
});

module.exports = DailyItem;
