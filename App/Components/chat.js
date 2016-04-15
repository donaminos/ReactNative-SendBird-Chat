var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  StyleSheet,
  Dimensions
} = React;

var SB = require('sendbird');
var sendbird = SB.getInstance();
var windowSize = Dimensions.get('window');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      message: '',
      messageList: [],
      user: null,
      channel: null
    };
  },

  componentWillMount: function() {
    sendbird.getUserInfo((data) => {
      this.setState({user: data});
    });
    sendbird.events.onMessageReceived = (obj) => {
      var _position = 'left';
      if (obj.user && obj.user.guest_id == this.state.user.guest_id) {
        _position = 'right';
      }
      var newMessage = {
        text: obj.message,
        name: obj.user.name,
        image: {uri: obj.user.image},
        position: _position,
        date: new Date(obj.ts)
      }
      this.setState({messageList: this.state.messageList.concat([newMessage])});
    };
  },

  componentDidMount: function() {
    // Get the previous messages
    this.getMessages();
  },

  getMessages: function() {
    sendbird.getMessageLoadMore({
      limit: 40,
      successFunc: (data) => {
        var _messageList = [];
          data.messages.reverse().forEach((msg, index) => {
            var _position = 'left';
            if (msg.payload.user && msg.payload.user.guest_id == this.state.user.guest_id) {
              _position = 'right';
            }
            if(sendbird.isMessage(msg.cmd)) {
              _messageList.push({
                text: msg.payload.message,
                name: msg.payload.user.name,
                image: {uri: msg.payload.user.image},
                position: _position,
                date: new Date(msg.payload.ts)
              });
            } else if (sendbird.isFileMessage(msg.cmd)) {
              _messageList.push({
                text: msg.payload.name,
                name: msg.payload.user.name,
                image: {uri: msg.payload.user.image},
                position: _position,
                date: new Date(msg.payload.ts)
              });
            }
      });

      this.setState({ messageList: _messageList.concat(this.state.messageList) });
    },
    errorFunc: (status, error) => {
      console.error(status, error);
    }
  });
  },

  onBackBTNPress: function() {
    // Close the connection with sendbird
    sendbird.disconnect();
    // Pop back to the previous screen
    this.props.navigator.pop();
  },

  onSendBTNPress: function() {
    // Send a message
    sendbird.message(this.state.message);
    this.setState({message: ''});
  },

  render: function() {
    var list = this.state.messageList.map((item, index) => {
      return (
        <View
          style={styles.messageContainer}
          key={index}
          >
          <Text style={this.nameLabel}>
            {item.name}
            <Text style={styles.messageLabel}> : {item.text}</Text>
          </Text>
        </View>
      );
    });

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <TouchableHighlight onPress={this.onBackBTNPress}
            style={{marginLeft: 15}}
            underlayColor={'#4e4273'}>
            <Text style={{color: 'white'}}>&lt; Back</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.chatContainer}>
          <ScrollView
            ref={(scrollView) => this._scrollView = scrollView}
            onScroll={this.onScrollHandle}
            scrollEventThrottle={16}
            onContentSizeChange={(e) => {}}>
            {list}
          </ScrollView>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textContainer}>
            <TextInput
              style={styles.input}
              value={this.state.message}
              onChangeText={(text) => this.setState({message: text})}
            />
          </View>
          <View style={styles.sendContainer}>
            <TouchableHighlight
              underlayColor={'#4e4273'}
              onPress={() => this.onSendBTNPress()}
              >
              <Text style={styles.sendLabel}>SEND</Text>
            </TouchableHighlight>
          </View>
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
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#6E5BAA',
    paddingTop: 20,
  },
  chatContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#f7f8fc'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#6E5BAA'
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  sendContainer: {
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  sendLabel: {
    color: '#ffffff',
    fontSize: 15
  },
  input: {
    width: windowSize.width - 70,
    color: '#555555',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
    height: 32,
    borderColor: '#6E5BAA',
    borderWidth: 1,
    borderRadius: 2,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5
  },
  nameLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333e4a'
  },
  messageLabel: {
    fontSize: 15,
    fontWeight: '400',
    color: '#60768b'
  }
});
