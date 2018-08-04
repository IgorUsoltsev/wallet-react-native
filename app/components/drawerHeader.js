import React, { Component } from 'react';
import { View, TouchableHighlight, Image, Text } from 'react-native';
import { connect } from 'react-redux';

class DrawerHeader extends Component {
  render() {
    const { profile, colors } = this.props;
    const {
      viewStyleContainer,
      imageStylePhoto,
      viewStyleName,
      textStyleName,
      textStyleEmail,
    } = styles;
    return (
      <TouchableHighlight
        onPress={() =>
          this.props.navigation.navigate('SettingsPersonalDetails')
        }>
        <View style={[viewStyleContainer, { backgroundColor: colors.tertiary }]}>
          <Image
            style={[imageStylePhoto, { borderColor: colors.quinary }]}
            source={
              profile.profile
                ? {
                    uri: profile.profile,
                    // cache: 'only-if-cached',
                  }
                : require('./../../assets/icons/profile.png')
            }
          />
          <View style={viewStyleName}>
            <Text style={[textStyleName, { color: colors.primary }]}>
              {profile.first_name
                ? profile.first_name + ' ' + profile.last_name
                : profile.username}
            </Text>
            <Text style={[textStyleEmail, { color: colors.primary, opacity: 0.7 }]}>
              {profile.email || ''}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = {
  viewStyleContainer: {
    padding: 16,
  },
  imageStylePhoto: {
    width: 64,
    height: 64,
    paddingBottom: 16,
    borderRadius: 50,
    borderWidth: 1,
  },
  viewStyleName: {
    paddingVertical: 12,
  },
  textStyleName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textStyleEmail: {
    fontSize: 14,
    opacity: 0.7
  },
};

const mapStateToProps = ({ user }) => {
  const { profile } = user;
  return { profile };
};

export default connect(mapStateToProps, {})(DrawerHeader);
