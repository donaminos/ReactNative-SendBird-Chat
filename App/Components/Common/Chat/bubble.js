import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';

let styles = StyleSheet.create({
  bubble: {
    borderRadius: 15,
    paddingLeft: 14,
    paddingRight: 14,
    paddingBottom: 10,
    paddingTop: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 10
  },
  text: {
    color: '#222222',
  },
  textLeft: {
  },
  textRight: {
    
  },
  bubbleLeft: {
    marginRight: 70,
    backgroundColor: '#B3E5FC',
    alignSelf: "flex-start",
  },
  bubbleRight: {
    marginLeft: 70,
    backgroundColor: '#E5EEF3',
    alignSelf: "flex-end"
  },
  bubbleError: {
    backgroundColor: '#e01717'
  },

});

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderText(text = "", position) {

    if (this.props.renderCustomText) {
      return this.props.renderCustomText(text, position);
    }
    return (
      <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
        {text}
      </Text>
    );
  }

  render(){
    var flexStyle = {};
    if ( this.props.text.length > 40 ) {
     flexStyle.flex = 1;
    }

    return (
      <View style={[styles.bubble,
        (this.props.position === 'left' ? styles.bubbleLeft : styles.bubbleRight),
        (this.props.status === 'ErrorButton' ? styles.bubbleError : null),
        flexStyle]}>
        {this.renderText(this.props.text, this.props.position)}
      </View>
    )
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left','right']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func
}