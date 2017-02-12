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
  RefreshControl,
  DrawerLayoutAndroid
} from 'react-native';

import Requests from './http/Requests';
import Loading from './Loading';
import Themes from './Themes';
import createDataSource from './utils/createDataSource';
import getDate from './utils/DateUtils';

var API_LATEST_URL = "http://news-at.zhihu.com/api/4/news/latest";
var API_BEFORE_URL = "http://news.at.zhihu.com/api/4/news/before/";
var isFirstin = true;
var dayCount = 1;
var datas = [];
var requests = new Requests();
var dailyTheme = null;

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
    if (dailyTheme) {
      url = 'http://news.at.zhihu.com/api/4/theme/' + dailyTheme.id;
    } else {
      if (isRefresh) {
        url = API_LATEST_URL;
      } else {
        url = API_BEFORE_URL + getDate(dayCount);
      }
    }

    requests.get(url)
      .then((data) => {
        if (isRefresh) datas = [];
        return data;
      })
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

  onSelectTheme(theme) {
    this.refs['drawer'].closeDrawer();
    dailyTheme = theme;
    this.refs['listView'].scrollTo({y: 0, animated: false});
    this.loadLatest(true);
  }

  onEndReached() {
    if (this.state.isLoadingTail || dailyTheme) {
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
    let image = null;
    if (stories && stories.images) {
      image = <Image
        source={{ uri: stories.images[0] }}
        style={styles.thumbnail} />
    }
    return (
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackground()}
        onPress={this.selectDaily.bind(this, stories)}>
        <View style={styles.row}>
          {image}
          <Text style={styles.title}>
            {stories.title}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  onRefresh() {
    this.setState({ isRefresh: true });
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
    return <Themes onSelectTheme={(theme) => this.onSelectTheme(theme)} />
  }

  render() {
    let title = dailyTheme == null ? "首页" : dailyTheme.name;
    if (this.state.isLoadingTail) {
      return <Loading text={'正在加载..'} />
    } else {
      return (
        <DrawerLayoutAndroid
          ref={'drawer'}
          drawerWidth={300}
          drawerPosition={DrawerLayoutAndroid.positions.left}
          renderNavigationView={this.renderNavigationView.bind(this)}>
          <View style={styles.container}>
            <ToolbarAndroid
              titleColor={'#ffffff'}
              style={styles.toolbar}
              title={title}
              navIcon={require('image!ic_menu_white_24dp')}
              onIconClicked={() => this.refs['drawer'].openDrawer()} />
            <ListView 
              ref={'listView'}
              style={styles.listContent}
              dataSource={this.state.dataSource}
              renderRow={this.renderLatest.bind(this)}
              onEndReached={this.onEndReached.bind(this)}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.isRefresh}
                  onRefresh={this.onRefresh.bind(this)}
                  colors={['#ff0000', '#00ff00', '#0000ff']}
                  progressBackgroundColor="#ffffff" />
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
    fontSize: 16,
    color: '#000000'
  },

  thumbnail: {
    height: 64,
    width: 64,
    marginRight: 16
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    margin: 6,
    borderColor: '#dddddd',
    borderStyle: null,
    borderWidth: 0.5,
    borderRadius: 2,
  },

  toolbar: {
    backgroundColor: '#000000',
    height: 56,
  }
});