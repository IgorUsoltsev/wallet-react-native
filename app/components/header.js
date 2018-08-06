import React, { Component } from 'react';
import { Constants } from 'expo';
import { View, Text, StyleSheet, NetInfo } from 'react-native';
// import colors from './../config/colors';
import { HeaderButton } from './common';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      offline: false,
      online: false,
      firstTime: true,
    };
  }

  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({
        offline: !isConnected,
      });
    });

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  handleFirstConnectivityChange = isConnected => {
    this.setState({
      offline: !isConnected,
    });
    if (!this.state.firstTime && isConnected) {
      this.setState({
        online: true,
      });
      setTimeout(() => {
        this.setState({
          online: false,
        });
      }, 5000);
    }

    this.setState({
      firstTime: false,
    });
  };

  render() {
    const {
      navigation,
      noAccounts,
      creditSwitch,
      debitSwitch,
      drawer,
      back,
      title,
      right,
      smallTitle,
      headerRightText,
      headerRightOnPress,
      headerRightIcon,
      colors,
      home,
      inverted
    } = this.props;

    const bg = inverted ? colors.primary : colors.tertiary;
    const text = inverted ? colors.primaryContrast : colors.primary;
    const icons = inverted ? colors.drawerColor : colors.primary;

    return (
      <View
        style={[
          {
            //elevation: 10,
            //elevation: 4,
            zIndex: 11,
            paddingTop: Constants.statusBarHeight,
            backgroundColor: bg,
          },
          !home
            ? {
                shadowColor: '#000',
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 5,
                shadowOpacity: 0.3,
              }
            : null,
        ]}>
        {creditSwitch === false &&
          debitSwitch === true && (
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 20,
                backgroundColor: colors.red,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: text, textAlign: 'center' }}>
                Deposits are temporarily disabled.
              </Text>
            </View>
          )}
        {debitSwitch === false &&
          creditSwitch === true && (
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 20,
                backgroundColor: colors.red,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: text, textAlign: 'center' }}>
                Withdrawals are temporarily disabled.
              </Text>
            </View>
          )}
        {debitSwitch === false &&
          creditSwitch === false && (
            <View
              style={{
                paddingVertical: 4,
                paddingHorizontal: 20,
                backgroundColor: colors.red,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{ color: text, textAlign: 'center' }}>
                Transactions are temporarily disabled.
              </Text>
            </View>
          )}
        {this.state.offline && (
          <View
            style={{
              paddingVertical: 4,
              backgroundColor: colors.red,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: text }}>No internet Connection</Text>
          </View>
        )}
        {this.state.online && (
          <View
            style={{
              paddingVertical: 4,
              backgroundColor: colors.green,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{ color: text }}>Connected</Text>
          </View>
        )}
        <View style={styles.options}>
          <View style={styles.left}>
            {drawer ? (
              <HeaderButton
                onPress={() => this.props.navigation.openDrawer()}
                icon="menu"
                color={icons}
              />
            ) : null}
            {back ? (
              <HeaderButton
                onPress={() => navigation.goBack()}
                style={{ padding: 20 }}
                icon="arrow-back"
                color={icons}
              />
            ) : null}
          </View>
          <View style={styles.title}>
            {title ? (
              <Text
                style={[styles.titleText, { color: text,fontSize: smallTitle ? 16 : 20 }]}>
                {title}
              </Text>
            ) : null}
          </View>
          <View style={styles.rightIcon}>
            {right ? (
              <HeaderButton
                onPress={() => navigation.navigate('QRCodeScanner')}
                icon="camera"
                color={icons}
              />
            ) : null}
            {headerRightText || headerRightIcon ? (
              <HeaderButton
                text={headerRightText}
                onPress={headerRightOnPress}
                icon={headerRightIcon}
                color={icons}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  options: {
    width: '100%',
    flexDirection: 'row',
    height: 64,
  },
  left: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 3,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightIcon: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 20,
    paddingLeft: 0,
    textAlign: 'center'
  },
};
