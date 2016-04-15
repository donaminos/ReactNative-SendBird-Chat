var React = require('react-native');
var {
  View,
  Text,
  Image,
  TextInput,
  ListView,
  StyleSheet,
  TouchableHighlight
} = React;

var sendbird = require('sendbird').getInstance();

// Constants
var PULLDOWN_DISTANCE = 40;

module.exports = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      channelList: [],
      dataSource: ds.cloneWithRows([]),
      page: 0,
      next: 0
    };
  },

  componentWillMount: function() {
    this.getChannelList(1);
  },

  getChannelList(page) {
    if (page == 0) {
      return;
    }

    sendbird.getChannelList({
      page: page,
      limit: 20,
      successFunc : (data) => {
        this.setState({channelList: this.state.channelList.concat(data.channels)}, () => {
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this.state.channelList),
            page: data.page,
            next: data.next
          });
        });
      },
      errorFunc: (status, error) => {
        console.log(status, error);
      }
    });
  },

  onChannelPress(channel_url) {
    // Join this channel
    sendbird.joinChannel(
      channel_url,
      {
        successFunc: (data) => {
          // Open a WebSocket connection
          sendbird.connect({
            successFunc: (data) => {
              // Get the channel's info
              sendbird.getChannelInfo((channel) => {
                sendbird.connect({
                  successFunc: (data) => {
                    console.log("Connect to channel: " + channel.name + " (" + channel.channel_url + ")");
                    // Navigate to Chat screen
                    this.props.navigator.push({ name: 'chat' });
                  },
                  errorFunc: (status, error) => {
                    console.error(status, error);
                  }
                });
              });
            },
            errorFunc: (status, error) => {
              console.error(status, error);
            }
          });
        },
        errorFunc: (status, error) => {
          console.error(status, error);
        }
      }
    );
  },

  renderRow(rowData) {
    return (
      <TouchableHighlight onPress={() => this.onChannelPress(rowData.channel_url)}>
        <View style={styles.listItem}>
            <View style={styles.listIcon}>
                <Image style={styles.channelIcon} source={{uri: rowData.cover_img_url}} />
            </View>
            <View style={styles.listInfo}>
                <Text style={styles.titleLabel}>{rowData.name}</Text>
                <Text style={styles.memberLabel}>{rowData.member_count} members</Text>
            </View>
        </View>
      </TouchableHighlight>
    );
  },

  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            renderRow={this.renderRow}
            onEndReached={() => this.getChannelList(this.state.next)}
            onEndReachedThreshold={PULLDOWN_DISTANCE} />
        </View>
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#ffffff'
  },
  listContainer: {
    flex: 11,
    justifyContent: 'center',
    alignItems: 'stretch',
    marginTop: 10
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#D0DBE4',
    padding: 5
  },
  listIcon: {
    justifyContent: 'flex-start',
    paddingLeft: 10,
    paddingRight: 15
  },
  channelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  listInfo: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  titleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  memberLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#abb8c4',
  }
});
