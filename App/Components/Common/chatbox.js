var React = require('react-native');
var {
  Platform,
  Dimensions,
  View,
  Text,
  StyleSheet
} = React;

// Components
var GiftedSpinner = require('react-native-gifted-spinner');
var Messenger = require('./Chat/messenger');
var Button = require('react-native-button');

// Sendbird Instance
var sendbird = require('sendbird').getInstance();

// Constants
const NUMBER_OF_LOADED_MESSAGES = 10;

module.exports = React.createClass({

  getInitialState: function() {
    return {
      channel: null,
      message: '',
      messageList: [],
      user: null,
      isLoading: false,
      reloadMessage: true
    };
  },
  componentWillMount: function() {
    // Get User Info
    sendbird.getUserInfo((data) => {
      this.setState({user: data});
    });
    // Get Channel Info
    sendbird.getChannelInfo((data) => {
      this.setState({channel: data}, () => {
        // Mark this channel's messages as read
        sendbird.markAsRead(this.state.channel.channel_url);
      });
    });
    // Messages Received event
    sendbird.events.onMessageReceived = (obj) => {
      var _position = 'left';
      if (obj.user && obj.user.guest_id == this.state.user.guest_id) {
        _position = 'right';
      }
      var newMessage = {
        text: obj.message,
        name: obj.user.name,
        image: {uri: obj.user.image},
        otherData: obj.data,
        position: _position,
        date: new Date(obj.ts)
      }
      // Append new message to the existing message list
      this.setState({messageList: this.state.messageList.concat([newMessage])});
      // Mark this channel's messages as read
      sendbird.markAsRead(this.state.channel.channel_url);
    };

    sendbird.events.onFileMessageReceived = (obj) => {

    };
  },
    componentDidMount: function() {
      // Get the previous messages
      this.getMessages();
    },

    getMessages: function() {
      // Whenever we fetch messages, it's time to wait
      // until the messages are loaded
      this.setState({isLoading: true}, () => {
        // Get Messages
        sendbird.getMessageLoadMore({
          limit: NUMBER_OF_LOADED_MESSAGES,
            successFunc: (data) => {
              console.log(data);
              var newMessages = [];
              data.messages.reverse().forEach((msg, index) => {
                var _position = 'left';
                if (msg.payload.user && msg.payload.user.guest_id == this.state.user.guest_id) {
                  _position = 'right';
                }
                if(sendbird.isMessage(msg.cmd)) {
                  newMessages.push({
                    text: msg.payload.message,
                    name: msg.payload.user.name,
                    image: {uri: msg.payload.user.image},
                    otherData: msg.payload.data,
                    position: _position,
                    date: new Date(msg.payload.ts)
                  });
                } else if (sendbird.isFileMessage(msg.cmd)) {
                  newMessages.push({
                    text: msg.payload.name,
                    name: msg.payload.user.name,
                    image: {uri: msg.payload.user.image},
                    otherData: msg.payload.data,
                    position: _position,
                    date: new Date(msg.payload.ts)
                  });
                }
              });
              // Store new messages
              this.setState({messageList: newMessages.concat(this.state.messageList)}, () => {
                // Finish loading, then scroll to bottom of the chat box
                this.setState({isLoading: false});
              });
            },
            errorFunc: (status, error) => {
              console.error(status, error);
            }
        });
      });
    },

    onSendPress: function(message) {
      // Send message to the server
      sendbird.message(message);
      this.setState({message: ''});
    },

  render: function() {
    // If the channel's data or guest_id hasn't been loaded yet,
    // then show the loading spinner
    if (!this.state.channel.channel_url || !this.state.user.guest_id) {
      return (
        <View style={styles.loadMoreMessages}>
          <GiftedSpinner />
        </View>
      );
    }

    // Otherwise, showing messages
    return (
      <Messenger
        ref={(c) => this._Messenger = c}

        styles={{
          bubbleRight: {
            marginLeft: 70,
            backgroundColor: '#E5EEF3',
          },
        }}

        messages={this.state.messageList}
        handleSend={ (message = {}, rowID = null) => {} }
        maxHeight={Dimensions.get('window').height - 80}
        senderName={this.state.user.nickname}
        displayNames={true}
        submitOnReturn={true}
        loadEarlierMessagesButton={false}

        onCustomSend={(message, otherData) => {
          this._Messenger.onChangeText('');
          if (typeof otherData !== 'undefined') {
            sendbird.messageWithData(message.text, otherData);
          } else {
            sendbird.message(message.text);
          }
        }}

        onLayout={(event) => {
          var layout = event.nativeEvent.layout;
          this.listHeight = layout.height;
        }}

        renderFooter={() => {
          return <View onLayout={(event)=>{
            var layout = event.nativeEvent.layout;
            this.footerY = layout.y;
          }}></View>
        }}

        renderHeader={() => {

          if (this.state.isLoading) {
            return (
              <View style={styles.loadMoreMessages}>
                <GiftedSpinner />
              </View>
            );
          } else {
            return (
              <View style={styles.loadMoreMessages}>
                <Button
                  style={styles.loadMoreMessagesButton}
                  onPress={() => {
                    this.getMessages();
                  }}
                >
                  Load More Messages
                </Button>
              </View>
            );
          }
        }}
      />
    );
  }
});

var styles = StyleSheet.create({
  loadMoreMessages: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadMoreMessagesButton: {
    fontSize: 14,
    fontWeight: '200'
  },
});
