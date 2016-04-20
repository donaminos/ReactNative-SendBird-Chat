var React = require('react-native');
var {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image
} = React;
import Bubble from './bubble';

export default class Message extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Load style from its parent
    Object.assign(styles, this.props.styles);
  }

  renderName(name, displayNames, diffMessage){
    if (displayNames === true) {
      if (diffMessage === null || name !== diffMessage.name) {
        return (
          <Text style={[styles.name]}>
            {name}
          </Text>
        );
      }
    }
    return null;
  }

  renderStatus(status) {
    // Render STRING message
    if (typeof status === 'string') {
      if (status.length > 0) {
        return (
          <View>
            <Text style={styles.status}>{status}</Text>
          </View>
        );
      }
    }
    // TODO: Render ONLY-IMAGE message

  }

  render() {
    var {
      rowData,
      rowID,
      position,
      displayNames,
      diffMessage
    } = this.props;

    var flexStyle = {};
    var RowView = Bubble;
    if ( rowData.text.length > 40 ) {
      flexStyle.flex = 1;
    }

    if ( rowData.view ) {
      RowView = rowData.view;
    }

    return (
      <View>
        {position === 'left' ? this.renderName(rowData.name, displayNames, diffMessage) : null}
        <View style={styles.rowContainer,
          {justifyContent: position==='left'?"flex-start":"flex-end"}}>
          <RowView
          {...rowData}
          renderCustomText={this.props.renderCustomText}
          styles={styles}
          />
        </View>
        {rowData.position === 'right' ? this.renderStatus(rowData.status) : null}
      </View>
    )
  }
}

var styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  name: {
    color: '#222222',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
    marginBottom: 5,
    marginTop: 12,
  },
  imagePosition: {
    height: 30,
    width: 30,
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginRight: 8,
  },
  image: {
    alignSelf: 'center',
    borderRadius: 15,
  },
  imageLeft: {
  },
  imageRight: {
  },
  spacer: {
    width: 10,
  },
  status: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'right',
    marginRight: 15,
    marginBottom: 10,
    marginTop: -5,
  },
});
