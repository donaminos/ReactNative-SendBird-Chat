var React = require('react-native');
var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;

var sendbird = require('sendbird').getInstance();

// App Keys
var appId = 'A05BA4C7-2F99-4F9A-B6E6-A71B9A6D889B';
var apiToken = '63d1c03ec0da695e1dfb5d9dca10ded53e8b4c95';

module.exports = React.createClass({
  componentWillMount: function() {
    // Enable sendbird debug-mode log
    sendbird.setDebugMessage(false);
  },
  getInitialState: function() {
    return {
      username: ''
    };
  },
  onPress() {
    sendbird.init({
      app_id: appId,
      guest_id: this.state.username,
      user_name: this.state.username,
      image_url: "",
      access_token: "",
      successFunc: (data) => {
        this.props.navigator.immediatelyResetRouteStack([{ name: 'channel' }]);
      },
      errorFunc: (status, error) => {
        this.setState({username: ''});
      }
    })
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TextInput style={styles.input}
            value={this.state.username}
            onChangeText= {(text) => this.setState({ username: text})}
            placeholder={ 'Enter your name...' }
            multiline={false} />
          <TouchableHighlight style={styles.button}
            underlayColor={'blue'}
            onPress={this.onPress}>
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>

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
    backgroundColor: '#232937'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#32C5E6',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#0082FA',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#0082FA'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff'
  }
});
