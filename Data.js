'use strict';

import React from 'react';

import { AsyncStorage } from 'react-native';

var API_COVER_URL = "http://news-at.zhihu.com/api/4/start-image/1080*1776";

var KEY_COVER = '@Cover';

function Data() {
  if (typeof Data.instance == 'object') {
    return Data.instance;
  }
  Data.instance = this;
}

Data.prototype.safeStorage = function (key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key, (error, resutl) => {
      var resultData = JSON.parse(resutl);
      if (error) {
        console.error(error);
        resolve(null);
      } else {
        resolve(resultData);
      }
    })
  })
}

Data.prototype.getCover = function () {
  return this.safeStorage(KEY_COVER);
}

Data.prototype.updateCover = function () {
  fetch(API_COVER_URL)
    .then((response) => response.json())
    .then((responseData) => {
      AsyncStorage.setItem(KEY_COVER, JSON.stringify(responseData));
    })
    .catch((error) => {
      console.log(error);
    })
    .done();
}

module.exports = Data;
