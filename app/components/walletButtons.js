import React, { Component } from 'react';
import { View, FlatList, Dimensions, Animated, Text } from 'react-native';
import { connect } from 'react-redux';
import {
  setActiveWalletIndex,
  setSendWallet,
  resetSend,
  setWithdrawWallet,
  resetWithdraw,
  viewWallet,
  hideWallet,
} from './../redux/actions';

import WalletAction from './WalletAction';
import HeaderCurrency from './HeaderCurrency';
import { EmptyListMessage } from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;

class walletButtons extends Component {
  scrollX = new Animated.Value(0);

  componentDidMount() {
    if (this.props.wallets.length > 1) {
      this.flatListRef.scrollToIndex({
        animated: false,
        index: this.props.activeWalletIndex || 0,
      });
    }
  }

  renderButtons() {
    const { viewStyleButtons, viewButtonsContainer } = styles;
    const { colors } = this.props;
    return (
        <View style={[viewButtonsContainer, { backgroundColor: colors.quinary }]}>
          <FlatList
              contentContainerStyle={viewStyleButtons}
              data={this.props.buttons}
              horizontal
              scrollEnabled={false}
              renderItem={({ item }) => (
                  <WalletAction
                      type={item.type}
                      onPress={() => this.onButtonPress(item.type)}
                      color={this.props.colors.primary}
                  />
              )}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
          />
        </View>
    );
  }

  onButtonPress(type) {
    const {
      wallets,
      activeWalletIndex,
      setWithdrawWallet,
      resetSend,
      setSendWallet,
      navigation,
      resetWithdraw,
    } = this.props;
    switch (type) {
      case 'send': {
        resetSend();
        setSendWallet(
            wallets.length > 1 ? wallets[activeWalletIndex] : wallets[0],
        );
        navigation.navigate('Send');
        break;
      }
      case 'receive': {
        navigation.navigate('Receive');
        break;
      }
      case 'withdraw': {
        resetWithdraw();
        setWithdrawWallet(
            wallets.length > 1 ? wallets[activeWalletIndex] : wallets[0],
        );
        navigation.navigate('Withdraw');
        break;
      }
      case 'deposit': {
        navigation.navigate('Deposit');
        break;
      }
      case 'more':
        navigation.navigate('Wallets', {
          wallet: wallets[activeWalletIndex],
        });
        break;
      default:
        console.log('Error: unknown button type');
    }
  }

  render() {
    const { colors, wallets } = this.props;
    const { viewStyleContainer, viewStyleBox, textStyle } = styles;
    return (
      <View style={[viewStyleContainer]}>
        {this.renderButtons()}
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'column',
    // elevation: 4,
    // shadowColor: '#000',
    // shadowOffset: { width: 2, height: 2 },
    // shadowRadius: 5,
    // shadowOpacity: 0.3,
    // zIndex: 10,
  },
  viewStyleButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    padding: 8,
  },
  viewStyleBox: {
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  viewButtonsContainer: {
    padding: 0,
  }
};

const mapStateToProps = ({ accounts }) => {
  const { user, activeWalletIndex, tempWallet } = accounts;
  return {
    user,
    activeWalletIndex,
    tempWallet,
  };
};

export default connect(mapStateToProps, {
  setActiveWalletIndex,
  setSendWallet,
  resetSend,
  setWithdrawWallet,
  resetWithdraw,
  viewWallet,
  hideWallet,
})(walletButtons);
