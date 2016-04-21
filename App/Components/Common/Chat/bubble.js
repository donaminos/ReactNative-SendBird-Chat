import React, {Text, View, Animated, Image, StyleSheet} from 'react-native';
var HTMLView = require('react-native-htmlview');

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    Object.assign(styles, this.props.styles);
  }

  renderMessage(text = "", position) {
    if (this.props.renderCustomText) {
      return this.props.renderCustomText(text, position);
    } else {
      if (text) {
        // Message contains text
        var otherData = this.props.otherData;

        if (otherData) {
          // MESSAGE CONTAINS OTHER DATA
          // Other Data contains Image data uri
          if (this.isDataURL(otherData)) {
            return (
              <View>
                <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
                  {text}
                  </Text>
                <Image style={styles.imageMessage} source={{uri: otherData}} />
              </View>
            )
          } else if (this.isHTMLString(text)) {
            // The text is a HTML string
           console.log('HTML: ' + text);
           return (
             <HTMLView
               value={text}
             />
           )
          }
        } else {
          if (this.isHTMLString(text)) {
            // The text is a HTML string
           console.log('HTML: ' + text);
           return (
             <HTMLView
               value={text}
             />
           )
          } else {
            // ONLY-TEXT message
            return (
              <Text style={[styles.text, (position === 'left' ? styles.textLeft : styles.textRight)]}>
                {text}
                </Text>
            );
         }
        }
      } else if (this.props.otherData) {
        return (
          <Image style={styles.imageMessage} source={{uri: this.props.otherData}} />
        )
      } else {
        // NOTHING TO RENDER
        return null;
      }
    }

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
        {this.renderMessage(this.props.text, this.props.position)}
      </View>
    )
  }

  isDataURL(string) {
    var regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
    return regex.test(string);
  }

  isHTMLString(string) {
    var regex = /<(?:([a-zA-Z\?][\w:\-]*)(\s(?:\s*[a-zA-Z][\w:\-]*(?:\s*=(?:\s*"(?:\\"|[^"])*"|\s*'(?:\\'|[^'])*'|[^\s>]+))?)*)?(\s*[\/\?]?)|\/([a-zA-Z][\w:\-]*)\s*|!--((?:[^\-]|-(?!->))*)--|!\[CDATA\[((?:[^\]]|\](?!\]>))*)\]\])>/g;
    return regex.test(string);
  }
}

Bubble.propTypes = {
  position: React.PropTypes.oneOf(['left','right']),
  status: React.PropTypes.string,
  text: React.PropTypes.string,
  renderCustomText: React.PropTypes.func
}

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
    marginBottom: 5,
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
  imageMessage: {
    width: 100, height: 100
  },
});
