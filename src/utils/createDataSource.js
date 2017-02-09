'use strict';

import { ListView } from 'react-native';

export default function createDataSource() {
  let dataSource = new ListView.DataSource({
    rowHasChanged: (row1, row2) => row1 != row2
  })
  return dataSource;
}
