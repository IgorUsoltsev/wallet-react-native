import React, { Component } from 'react';
import { Text, TouchableHighlight } from 'react-native';

export default class DrawerOption extends Component {
  _containerStyle() {
    const { address, activeItemKey, colors } = this.props;
    // console.log()
    const { containerStyle } = styles;
    return [
      containerStyle,
      {
        backgroundColor:
          address === activeItemKey ? 'transparent' : 'transparent',
      },
    ];
  }

  _textStyle() {
    const { address, activeItemKey, colors } = this.props;
    // console.log()
    const { textStyle } = styles;
    return [
      textStyle,
      {
        color: address === activeItemKey ? colors.quinary : '#5A5A5A',
      },
    ];
  }

  render() {
    const { name, address, navigation, colors } = this.props;
    return (
      <TouchableHighlight
        // activeOpacity={0.4}
        underlayColor={colors.secondary}
        style={this._containerStyle()}
        onPress={() => navigation.navigate(address)}>
        <Text style={this._textStyle()}>{name}</Text>
      </TouchableHighlight>
    );
  }
}

const styles = {
  containerStyle: {
    padding: 16,
    // marginVertical: 2,
    width: '100%',
  },
  textStyle: {
    fontSize: 16,
    fontWeight: 'normal',
  },
};
