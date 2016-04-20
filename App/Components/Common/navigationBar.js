var React = require('react-native');

var {
  Text,
  View,
  TouchableHighlight,
  StyleSheet
} = React;

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.leftButton}>
          <TouchableHighlight style={styles.button}
            underlayColor={'#232937'}
            onPress={this.props.onBackPress}>
              <Text style={{color: 'white'}}>&lt; Back</Text>
          </TouchableHighlight>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start' }}>
          <Text style={styles.titleLabel}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#232937',
    paddingTop: 20,
  },
  titleLabel: {
    color:'#fff',
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 18
  },
  button: {
    height: 30
  },
  leftButton: {
    justifyContent: 'flex-start',
    paddingLeft: 5
  },
  rightButton: {
    justifyContent: 'flex-end',
    paddingRight: 10
  }
});
