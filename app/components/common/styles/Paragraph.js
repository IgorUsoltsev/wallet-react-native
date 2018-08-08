/* BUTTON */
/* Component | Stateless | Styled */
/* This is the main button component. Takes props to adjust it's size, type, color etc */
import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

class Paragraph extends Component {
  render() {
    const { onPress, children } = this.props;
    const { _containerStyle } = styles;
    return <View style={_containerStyle}>{children}</View>;
  }
}

Paragraph.propTypes = {
  label: PropTypes.string, // Text displayed on button
};

Paragraph.defaultProps = {
  label: '',
};

const styles = {
  _containerStyle: {
    // flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
};

export { Paragraph };
