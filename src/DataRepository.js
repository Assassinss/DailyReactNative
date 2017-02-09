'use strict';

import React from 'react';

import { AsyncStorage } from 'react-native';
import Requests from './http/Requests';

var requests = new Requests();

var API_COVER_URL = "https://news-at.zhihu.com/api/4/start-image/1080*1776";
var API_THEMES_URL = "https://news-at.zhihu.com/api/4/themes";

var KEY_COVER = '@Cover';
var KEY_THEMES = "@Themes";

export default class DataRepository {

  safeStorage(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (error, result) => {
        var resultData = JSON.parse(result);
        if (error) {
          console.error("safeStorage: " + error);
          resolve(null);
        } else {
          resolve(resultData);
        }
      })
    })
  }

  getCover(key) {
    return this.safeStorage(KEY_COVER);
  }

  updateCover() {
    requests.get(API_COVER_URL)
      .then((responseData) => {
        AsyncStorage.setItem(KEY_COVER, JSON.stringify(responseData));
      })
      .catch((error) => {
        console.log(error);
      })
      .done();
  }

  safeFetch(url) {
    return new Promise((resolve, reject) => {
      requests.get(url)
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          console.log("safeFetch: " + error);
          resolve(null);
        })
    })
  }

  fetchThemes() {
    return this.safeStorage(KEY_THEMES)
      .then((result) => {
        if (result) {
          return result.others;
        } else {
          throw new Error("No data");
        }
      })
      .then((themes) => themes)
      .catch((error) => {
        console.log("fetchThemes: " + error);
        return this.safeFetch(API_THEMES_URL)
          .then((result) => {
            AsyncStorage.setItem(KEY_THEMES, JSON.stringify(result));
            return result.others;
          })
      })

  }

}
