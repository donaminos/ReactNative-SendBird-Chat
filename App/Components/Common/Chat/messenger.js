var React = require('react-native');
import Message from './message';
var GiftedSpinner = require('react-native-gifted-spinner');
var {
  Text,
  View,
  ListView,
  TextInput,
  Dimensions,
  Animated,
  Image,
  TouchableHighlight,
  Platform,
  PixelRatio
} = React;

var Button = require('react-native-button');

module.exports = React.createClass({
  firstDisplay: true,
  listHeight: 0,
  footerY: 0,

  getDefaultProps: function() {
    return {
      displayNames: true,
      placeholder: 'Type a message...',
      styles: {},
      autoFocus: true,
      loadEarlierMessagesButton: false,
      loadEarlierMessagesButtonText: 'Load earlier messages',
      onLoadEarlierMessages: (oldestMessage, callback) => {},
      parseText: false,
      initialMessages: [],
      messages: [],
      handleSend: (message, rowID) => {},
      maxHeight: Dimensions.get('window').height,
      senderName: 'Sender',
      sendButtonText: 'Send',
      hideTextInput: false,
      submitOnReturn: false,
      onChangeText: (text) => {},
    };
  },

  propTypes: {
    displayNames: React.PropTypes.bool,
    placeholder: React.PropTypes.string,
    styles: React.PropTypes.object,
    autoFocus: React.PropTypes.bool,
    loadEarlierMessagesButton: React.PropTypes.bool,
    loadEarlierMessagesButtonText: React.PropTypes.string,
    onLoadEarlierMessages: React.PropTypes.func,
    parseText: React.PropTypes.bool,
    initialMessages: React.PropTypes.array,
    messages: React.PropTypes.array,
    handleSend: React.PropTypes.func,
    onCustomSend: React.PropTypes.func,
    renderCustomText: React.PropTypes.func,
    maxHeight: React.PropTypes.number,
    senderName: React.PropTypes.string,
    sendButtonText: React.PropTypes.string,
    hideTextInput: React.PropTypes.bool,
    onChangeText: React.PropTypes.func,
  },

  getInitialState: function() {
    this._data = [];
    this._rowIds = [];
    var textInputHeight = 0;
    if (this.props.hideTextInput === false) {
      textInputHeight = 44;
    }

    this.listViewMaxHeight = this.props.maxHeight - textInputHeight;

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
      if (typeof r1.status !== 'undefined') {
        return true;
      }
      return r1 !== r2;
    }});
    return {
      dataSource: ds.cloneWithRows([]),
      text: '',
      disabled: true,
      height: new Animated.Value(this.listViewMaxHeight),
      isLoadingEarlierMessages: false,
      allLoaded: false,
      appearAnim: new Animated.Value(0),
    };
  },

  getMessage: function(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID)]];
      }
    }
    return null;
  },

  getPreviousMessage: function(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID - 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]] !== 'undefined') {
      return this._data[this._rowIds[this._rowIds.indexOf(rowID - 1)]];
    }
  }
  return null;
  },

  getNextMessage: function(rowID) {
    if (typeof this._rowIds[this._rowIds.indexOf(rowID + 1)] !== 'undefined') {
      if (typeof this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]] !== 'undefined') {
        return this._data[this._rowIds[this._rowIds.indexOf(rowID + 1)]];
      }
    }
    return null;
  },

  renderRow: function(rowData = {}, sectionID = null, rowID = null) {
    var diffMessage = null;
      if (rowData.isOld === true) {
        diffMessage = this.getPreviousMessage(rowID);
      } else {
        diffMessage = this.getNextMessage(rowID);
      }

      return (
        <View>
          <Message
            rowData={rowData}
            rowID={rowID}
            displayNames={this.props.displayNames}
            diffMessage={diffMessage}
            position={rowData.position}
            styles={this.styles}
          />
        </View>
      )
  },

  renderChatBox: function() {
    return (
      <Animated.View style={{height: this.state.height}}>
        <ListView
          ref='listView'
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          renderHeader={this.renderLoadEarlierMessages}
          onLayout={(event) => {
            var layout = event.nativeEvent.layout;
            this.listHeight = layout.height;
            if (this.firstDisplay === true) {
              requestAnimationFrame(() => {
                this.firstDisplay = false;
                this.scrollWithoutAnimationToBottom();
              });
            }
          }}
          renderFooter={() => {
            return <View onLayout={(event)=>{
              var layout = event.nativeEvent.layout;
              this.footerY = layout.y;
            }}></View>
          }}
          style={this.styles.listView}
          enableEmptySections={true}
          onKeyboardWillShow={this.onKeyboardWillShow}
          onKeyboardDidShow={this.onKeyboardDidShow}
          onKeyboardWillHide={this.onKeyboardWillHide}
          keyboardShouldPersistTaps={true}
          keyboardDismissMode='interactive'


          initialListSize={10}
          pageSize={this.props.messages.length}

          {...this.props}
        />
      </Animated.View>
    )
  },

  renderInputBox() {
    if (this.props.hideTextInput === false) {
      return (
        <View style={this.styles.textInputContainer}>
          <TextInput
            style={this.styles.textInput}
            placeholder={this.props.placeholder}
            ref='textInput'
            onChangeText={this.onChangeText}
            value={this.state.text}
            autoFocus={this.props.autoFocus}
            returnKeyType={this.props.submitOnReturn ? 'send' : 'default'}
            onSubmitEditing={this.props.submitOnReturn ? this.onSend : null}

            blurOnSubmit={false}
          />
          <Button
            style={this.styles.sendButton}
            onPress={this.onSend}
            disabled={this.state.disabled}
          >
            {this.props.sendButtonText}
          </Button>
        </View>
      );
    }
    return null;
  },

  render: function() {
    return (
      <View style={this.styles.container} ref='container'>
        {this.renderChatBox()}
        {this.renderInputBox()}
      </View>
    )
  },

  onChangeText: function(text) {
    this.setState({text: text});
    if (text.trim().length > 0) {
      this.setState({disabled: false});
    } else {
      this.setState({disabled: true});
    }

    this.props.onChangeText(text);
  },

  componentDidMount: function() {
    this.scrollResponder = this.refs.listView.getScrollResponder();

    if (this.props.messages.length > 0) {
      this.appendMessages(this.props.messages);
    } else if (this.props.initialMessages.length > 0) {
      this.appendMessages(this.props.initialMessages);
    } else {
      this.setState({
        allLoaded: true
      });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this._data = [];
    this._rowIds = [];
    this.appendMessages(nextProps.messages);
  },

  postLoadEarlierMessages: function(messages = [], allLoaded = false) {
    this.prependMessages(messages);
    this.setState({
      isLoadingEarlierMessages: false
    });
    if (allLoaded === true) {
      this.setState({
        allLoaded: true,
      });
    }
  },

  preLoadEarlierMessages: function() {
    this.setState({
      isLoadingEarlierMessages: true
    });
    this.props.onLoadEarlierMessages(this._data[this._rowIds[this._rowIds.length - 1]], this.postLoadEarlierMessages);
  },

  renderLoadEarlierMessages: function() {
    if (this.props.loadEarlierMessagesButton === true) {
      if (this.state.allLoaded === false) {
        if (this.state.isLoadingEarlierMessages === true) {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <GiftedSpinner />
            </View>
          );
        } else {
          return (
            <View style={this.styles.loadEarlierMessages}>
              <Button
                style={this.styles.loadEarlierMessagesButton}
                onPress={() => {this.preLoadEarlierMessages()}}
              >
                {this.props.loadEarlierMessagesButtonText}
              </Button>
            </View>
          );
        }
      }
    }
    return null;
  },

  prependMessages: function(messages = []) {
    var rowID = null;
    for (let i = 0; i < messages.length; i++) {
      this._data.push(messages[i]);
      this._rowIds.unshift(this._data.length - 1);
      rowID = this._data.length - 1;
    }
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds),
    });
    return rowID;
  },

  prependMessage: function(message = {}) {
    var rowID = this.prependMessages([message]);
    return rowID;
  },

  appendMessages: function(newMessages = []) {
    var rowID = null;

    for (let i = 0; i < newMessages.length; i++) {
      newMessages[i].isOld = true;
      this._data.push(newMessages[i]);
      this._rowIds.push(this._data.length - 1);
      rowID = this._data.length - 1;
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds)
    })

    return rowID;
  },

  appendMessage: function(newMessage) {
    var rowID = this.appendMessages([newMessage]);
    return rowID;
  },

  refreshRows: function() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._data, this._rowIds)
    });
  },

  onSend: function() {
    var message = {
      text: this.state.text.trim(),
      name: this.props.senderName,
      position: 'right',
      date: new Date(),
    };
    if (this.props.onCustomSend) {
      this.props.onCustomSend(message);
    } else {
      var rowID = this.appendMessage(message);
      this.props.handleSend(message, rowID);
      this.onChangeText('');
    }
  },

  // KEYBOARD
  onKeyboardWillHide(e) {
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight,
      duration: 150,
    }).start();
  },

  onKeyboardWillShow(e) {
    Animated.timing(this.state.height, {
      toValue: this.listViewMaxHeight - (e.endCoordinates ? e.endCoordinates.height : e.end.height),
      duration: 200,
    }).start();
  },

  onKeyboardDidShow(e) {
    this.scrollToBottom();
  },

  scrollToBottom() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this.scrollResponder.scrollTo({y:-scrollDistance});
    }
  },

  scrollWithoutAnimationToBottom() {
    if (this.listHeight && this.footerY && this.footerY > this.listHeight) {
      var scrollDistance = this.listHeight - this.footerY;
      this.scrollResponder.scrollWithoutAnimationTo(-scrollDistance);
    }
  },

  componentWillMount() {
    this.styles = {
      container: {
        flex: 1,
        backgroundColor: '#FFF',
      },
      listView: {
        flex: 1,
      },
      textInputContainer: {
        height: 44,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#b2b2b2',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
      },
      textInput: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
        margin: 0,
        fontSize: 15,
      },
      sendButton: {
        marginTop: 11,
        marginLeft: 10,
      },
      date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 8,
      },
      link: {
        color: '#007aff',
        textDecorationLine: 'underline',
      },
      linkLeft: {
        color: '#000',
      },
      linkRight: {
        color: '#fff',
      },
      loadEarlierMessages: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
      },
      loadEarlierMessagesButton: {
        fontSize: 14,
      },
    };

    Object.assign(this.styles, this.props.styles);
  }

});
