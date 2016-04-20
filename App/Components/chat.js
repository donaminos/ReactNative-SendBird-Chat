var React = require('react-native');
var {
  View,
  Text,
  ListView,
  StyleSheet
} = React;

var sendbird = require('sendbird').getInstance();
var NavigationBar = require('./Common/navigationBar');
var ChatBox = require('./Common/chatbox');

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
      channel: null
    };
  },

  componentWillMount: function() {
    // Get Channel Info
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data});
    });
  },

  onBackBTNPress: function() {
    // Pop back to the previous screen
    this.props.navigator.pop();
    // Disconnect from the current channel
    sendbird.leaveChannel(this.state.channel.channel_url,
      {
        successFunc: function() {
          sendbird.disconnect();
        },
        errorFunc: function(status, error) {
          console.error(status, error);
        }
      });
  },

  render: function() {
    // Check whether the channel's data is NOT already available.
    // If it's true, then we must wait until it's available.
    if (!this.state.channel) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyLabel}>Loading...</Text>
        </View>
      );
    }
    // Otherwise, showing the messages.
    return (
      <View style={styles.container}>
        <NavigationBar onBackPress={this.onBackBTNPress}
          title={this.state.channel.name}/>
        <View style={styles.chatContainer}>
          <ChatBox />
        </View>
      </View>
    );
  }

});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  emptyLabel: {
    fontSize: 18,
    color: '#555555'
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#f7f8fc'
  }
});
