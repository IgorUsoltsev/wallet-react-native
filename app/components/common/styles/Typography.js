/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

class Typography extends Component {
  render() {
    const { onPress, children } = this.props;
    const { _textStyle } = styles;
    return <Text style={_textStyle}>{children}</Text>;
  }
}

Typography.propTypes = {
  label: PropTypes.string, // Text displayed on button
};

Typography.defaultProps = {
  label: '',
};

const styles = {
  _textStyle: {
    // flex: 1,
    // margin: 8,
  },
};

export { Typography };
