'user strict'

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ToolbarAndroid,
  ListView,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl
} from 'react-native';

var API_LATEST_URL = "http://news-at.zhihu.com/api/4/news/latest";
var API_BEFORE_URL = "http://news.at.zhihu.com/api/4/news/before/";
var isFirstin = true;
var newDate = new Date();
var dayCount = 1;
var datas = [];

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      isLoading: false,
      isLoadingTail: false,
      isRefresh: false,
    };
  }

  componentDidMount() {
    this.loadLatest(true);
  }

  getDate(dayCount) {
    newDate.setDate(newDate.getDate() + dayCount);
    var yyyy = newDate.getFullYear().toString();
    var mm = (newDate.getMonth() + 1).toString();
    var dd = newDate.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
  }

  loadLatest(isRefresh) {
    var api;
    if (!isFirstin) api = API_BEFORE_URL + this.getDate(dayCount);
    else api = API_LATEST_URL;
    fetch(api)
      .then((response) => response.json())
      .catch((error) => {
        this.setState({
          isLoading: (isRefresh ? false : this.state.isLoading),
          isLoadingTail: (isRefresh ? this.state.isLoadingTail : false),
          dataSource: this.state.dataSource,
        });
      })
      .then((responseData) => {
        this.addDatas(responseData.stories);
        this.setState({
          isLoading: (isRefresh ? false : this.state.isLoading),
          isLoadingTail: (isRefresh ? this.state.isLoadingTail : false),
          dataSource: this.getDataSource(datas)
        });
      })
      .done();
  }

  addDatas(stories) {
    stories.forEach(storie => {
      datas.push(storie);
    })
  }

  getDataSource(stories) {
    return this.state.dataSource.cloneWithRows(stories);
  }

  onEndReached() {
    if (this.state.isLoadingTail) {
      return;
    }
    if (isFirstin) dayCount = 0;
    else dayCount = -1;
    isFirstin = false;
    this.loadLatest(false);
  }

  selectDaily(stories) {
    this.props.navigator.push({
      title: stories.title,
      name: 'stories',
      stories: stories,
    });
  }

  renderLatest(stories) {
    return (
      <TouchableOpacity style={{ flex: 1 }}
        onPress={this.selectDaily.bind(this, stories)}>
        <View style={styles.row}>
          <Image
            source={{ uri: stories.images[0] }}
            style={styles.thumbnail} />
          <Text
            style={styles.title}>{stories.title}
          </Text>
        </View>
      </TouchableOpacity >
    )
  }

  onRefresh() {
    this.setState({ isRefresh: true });
    datas = [];
    isFirstin = true;
    setTimeout(() => {
      this.setState({
        isLoading: false,
        isLoadingTail: false,
        isRefresh: false
      });

      this.loadLatest(true);
    }, 1500);
  }

  render() {
    if (this.state.isLoadingTail) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            正在加载...
          </Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <ToolbarAndroid
            titleColor={'#ffffff'}
            style={styles.toolbar}
            title={'Daily'} />
          <View style={styles.listContent}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderLatest.bind(this)}
              onEndReached={this.onEndReached.bind(this)}
              onEndReachedThreshold={datas.length}
              style={styles.listView}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefresh}
                  onRefresh={this.onRefresh.bind(this)}
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffffff"
                  />
              }>
            </ListView>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
  },

  listContent: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
  },

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

  listView: {
    padding: 0,
  },

  toolbar: {
    backgroundColor: '#000000',
    height: 56,
  }
});