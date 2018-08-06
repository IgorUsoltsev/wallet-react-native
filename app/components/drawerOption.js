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
          address === activeItemKey ? colors.secondary : 'transparent',
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
        color: address === activeItemKey ? colors.secondaryContrast : 'black',
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
    padding: 8,
    paddingLeft: 16,
    paddingVertical: 12,
    // marginVertical: 2,
    width: '100%',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
};
