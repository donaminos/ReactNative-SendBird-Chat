var React = require('react-native')
var {
  Navigator,
  StyleSheet
} = React;

var Login = require('./Components/login');
var Channel = require('./Components/channel');
var Chat = require('./Components/chat');

var ROUTES = {
  login: Login,
  channel: Channel,
  chat: Chat
}

module.exports = React.createClass({
  renderScene: function(route, navigator) {
    var Component = ROUTES[route.name];
    return <Component route={route} navigator={navigator} />;
  },
  render: function() {
    return (
      <Navigator
      style={ styles.container }
      initialRoute={ {name: 'login'} }
      renderScene={this.renderScene}
      configureScene={ () => { return Navigator.SceneConfigs.FloatFromRight; } }
      />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
