import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavigationActions, DrawerItems } from 'react-navigation';
import { ScrollView, Text, View } from 'react-native';

import DrawerHeader from './../components/drawerHeader';
import DrawerOption from './DrawerOption';
import { Constants } from 'expo';

class CustomDrawer extends Component {
  render() {
    const { navigation, company_config, profile, activeItemKey } = this.props;
    const { services, colors } = company_config;

    return (
      <View
        style={[ styles.container, {paddingTop: Constants.statusBarHeight,backgroundColor: colors.primary } ]}>
        <View>
          <DrawerHeader navigation={navigation} colors={colors} />
        </View>

        <ScrollView>
          <View>
            <View style={styles.navSectionStyle}>
              <DrawerOption
                navigation={navigation}
                activeItemKey={activeItemKey}
                name="Home"
                address="Home"
                colors={colors}
              />
              <View style={{borderBottomColor: colors.lightGray, borderBottomWidth: 1}} />
              <DrawerOption
                navigation={navigation}
                activeItemKey={activeItemKey}
                name="Wallets"
                address="Wallets"
                colors={colors}
              />
              <View style={{borderBottomColor: colors.lightGray, borderBottomWidth: 1}} />
              {services.rewards ? (
                <DrawerOption
                  navigation={navigation}
                  activeItemKey={activeItemKey}
                  name="Rewards"
                  address="Rewards"
                  colors={colors}
                />
              ) : null}
              {/* {!profile.verified ? ( */}
              <DrawerOption
                navigation={navigation}
                activeItemKey={activeItemKey}
                name="Verification"
                address="GetVerified"
                colors={colors}
              />
              {/* ) : null} */}
              <DrawerOption
                navigation={navigation}
                activeItemKey={activeItemKey}
                name="Settings"
                address="Settings"
                colors={colors}
              />
              <View style={{borderBottomColor: colors.lightGray, borderBottomWidth: 1}} />
              <DrawerOption
                navigation={navigation}
                activeItemKey={activeItemKey}
                name="Log out"
                address="Logout"
                colors={colors}
              />
            </View>
          </View>
          {/* <DrawerItems
            {...this.props}
            items={items}
            activeTintColor={colors.secondaryContrast}
            activeBackgroundColor={colors.secondary}
            inactiveTintColor={colors.primary}
            inactiveBackgroundColor="transparent"
            labelStyle={{
              margin: 15,
              alignItems: 'center',
              fontSize: 16,
              fontWeight: 'normal',
            }}
          /> */}
        </ScrollView>
      </View>
    );
  }
}

CustomDrawer.propTypes = {
  navigation: PropTypes.object,
  profile: PropTypes.object,
  company_config: PropTypes.object,
  activeItemKey: PropTypes.string,
};

const styles = {
  container: {
    flex: 1,
  },
  navSectionStyle: {
  }
};

const mapStateToProps = ({ auth, user }) => {
  const { company_config } = auth;
  const { profile } = user;
  return { company_config, profile };
};

export default connect(mapStateToProps, {})(CustomDrawer);
