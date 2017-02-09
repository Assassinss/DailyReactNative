'use strict';

var newDate = new Date();

export default function getDate(dayCount) {
  newDate.setDate(newDate.getDate() + dayCount);
  var yyyy = newDate.getFullYear().toString();
  var mm = (newDate.getMonth() + 1).toString();
  var dd = newDate.getDate().toString();
  return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
}