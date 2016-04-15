/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

 var React = require('react-native');
 var {
   AppRegistry
 } = React;

var Main = require('./App/main')

AppRegistry.registerComponent('MultiCellReact', () => Main);
