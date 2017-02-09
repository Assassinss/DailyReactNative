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
  RefreshControl,
  DrawerLayoutAndroid
} from 'react-native';

import Requests from './http/Requests';
import Loading from './Loading';
import Themes from './Themes';
import createDataSource from './utils/createDataSource';
import getDate from './utils/DateUtils';
import NavIcon from './icons/ic_menu_white.png';

var API_LATEST_URL = "http://news-at.zhihu.com/api/4/news/latest";
var API_BEFORE_URL = "http://news.at.zhihu.com/api/4/news/before/";
var isFirstin = true;
var dayCount = 1;
var datas = [];
var requests = new Requests();

export default class MainScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: createDataSource(),
      isLoading: false,
      isLoadingTail: false,
      isRefresh: false
    };
  }

  componentDidMount() {
    this.loadLatest(true);
  }

  loadLatest(isRefresh) {
    var url;
    if (!isFirstin) url = API_BEFORE_URL + getDate(dayCount);
    else url = API_LATEST_URL;

    requests.get(url)
      .then((data) => data.stories)
      .then((stories) => {
        this.addDatas(stories);
        this.setState({
          isLoading: (isRefresh ? false : this.state.isLoading),
          isLoadingTail: (isRefresh ? this.state.isLoadingTail : false),
          dataSource: this.getDataSource(datas)
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: (isRefresh ? false : this.state.isLoading),
          isLoadingTail: (isRefresh ? this.state.isLoadingTail : false)
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
          <Text style={styles.title}>
            {stories.title}
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

  renderNavigationView() {
    return <Themes />
  }

  render() {
    if (this.state.isLoadingTail) {
      return <Loading text={'正在加载..'} />
    } else {
      return (
        <DrawerLayoutAndroid
          ref={'drawer'}
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.left}
          renderNavigationView={this.renderNavigationView}>
          <View style={styles.container}>
            <ToolbarAndroid
              titleColor={'#ffffff'}
              style={styles.toolbar}
              title={'首页'}
              navIcon={NavIcon}
              onIconClicked={() => this.refs['drawer'].openDrawer()} />
            <ListView style={styles.listContent}
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
        </DrawerLayoutAndroid>
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
    flexDirection: 'column'
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