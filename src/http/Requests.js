'use strict';

export default class Requests {

  get(path) {
    return fetch(path)
             .then((response) => response.json());
  }

}