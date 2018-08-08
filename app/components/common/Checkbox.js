import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Colors from './../../config/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { WebBrowser } from 'expo';

class Checkbox extends Component {
  render() {
    const {
      toggleCheck,
      value,
      title,
      link,
      description,
      error,
      colors,
    } = this.props;
    const {
      textStyle,
      textStyleRequired,
      viewStyleContainer,
      viewStyleContainerCheckbox,
      textStyleLink,
      viewStyleTextLink,
      viewStyleText,
      viewStyleCheckbox,
    } = styles;
    return (
      <View
        style={[
          viewStyleContainer,
          { backgroundColor: colors.primary },
        ]}>
        <View style={viewStyleContainerCheckbox}>
          <View style={viewStyleCheckbox}>
            <MaterialIcons
              onPress={toggleCheck} //value ? {this.setState({ value })} : 'square-outline'}
              name={value ? 'check-box' : 'check-box-outline-blank'}
              size={32}
              color={value ? colors.primaryContrast : 'lightgrey'}
            />
          </View>
          <View style={viewStyleText}>
            <Text style={textStyle}>{title}</Text>
            <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(link)}>
              <View style={viewStyleTextLink}>
                <Text style={textStyleLink}>{description}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {error ? (
          <View>
            <Text style={textStyleRequired}>{error}</Text>
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // minHeight: 72,
    margin: 8,
    padding: 8,
    borderRadius: 5,
    // overflow: 'hidden',
  },
  viewStyleContainerCheckbox: {
    // flex: 1,
    flexDirection: 'row',
    // minHeight: 72,
  },
  viewStyleCheckbox: {
    margin: 4,
    justifyContent: 'center',
    // marginVertical: 12,
  },
  viewStyleText: {
    // flexDirection: 'column',
    paddingLeft: 8,
    paddingRight: 16,
  },
  viewStyleTextLink: {
    // flexDirection: 'column',
    flexWrap: 'wrap',
    marginRight: 16,
  },
  textStyle: {
    color: 'black',
    fontSize: 16,
    // paddingBottom: 2,
  },
  textStyleLink: {
    color: Colors.primaryContrast,
    fontSize: 12,
    paddingTop: 2,
    // flex: 1,
    marginRight: 8,
  },
  textStyleRequired: {
    color: 'red',
    padding: 8,
    paddingTop: 4,
    // paddingRight: 5,
    // minHeight: 72,
  },
};

// make component available to other parts of app
export { Checkbox };
