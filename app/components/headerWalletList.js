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
  fetchAccounts,
  showModal
} from './../redux/actions';

import WalletAction from './WalletAction';
import HeaderCurrency from './HeaderCurrency';
import { EmptyListMessage } from './common';
import {performDivisibility, standardizeString} from "../util/general";
import CardList from "./CardList";
import HeaderWallet from "./headerWallet";
import TransactionList from "./TransactionList";
import Colors from './../config/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

class HeaderWalletList extends Component {
  scrollX = new Animated.Value(0);

  getItemLayout = (data, index) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  componentDidMount() {
    this.props.hideWallet();
  }

  send = item => {
    this.props.resetSend();
    this.props.setSendWallet(item);
    this.props.navigation.navigate('Send');
  };

  renderContent(item) {
    const balance =
        item.currency.currency.symbol +
        ' ' +
        performDivisibility(
            item.currency.balance,
            item.currency.currency.divisibility,
        ).toFixed(item.currency.currency.divisibility);
    const available =
        item.currency.currency.symbol +
        ' ' +
        performDivisibility(
            item.currency.available_balance,
            item.currency.currency.divisibility,
        ).toFixed(item.currency.currency.divisibility);

    //@todo: replace color '#FFFFFF' with dynamic company color
    return (
        <View style={[styles.viewStyleContainer,{flexDirection: 'row', paddingBottom: 16 }]}>
          <View style={styles.cardLabelWrapper}>
            <Text style={[styles.cardLabel, {color: '#FFFFFF'}]}>Balance</Text>
            <Text style={[styles.cardValue, {color: '#FFFFFF'}]}>{balance}</Text>
          </View>
          <View style={styles.cardLabelWrapper}>
            <Text style={[styles.cardLabel, {color: '#FFFFFF'}]}>Available</Text>
            <Text style={[styles.cardValue, {color: '#FFFFFF'}]}>{available}</Text>
          </View>
        </View>
    );
  }

  renderDetail(item, navigation) {
    // const { wallet } = this.state;
    let i = 0;
    let buttons = [];
    if (this.props.company_bank_account.length > 0) {
      buttons[i] = { id: i++, type: 'deposit' };
    }
    // buttons[i] = { id: i++, type: 'withdraw' };
    buttons[i] = { id: i++, type: 'receive' };
    buttons[i] = { id: i++, type: 'send' };
    return (
        <View style={styles.viewStyleDetailCard}>
          <HeaderWallet
              wallets={[item]}
              buttons={buttons}
              navigation={navigation}
              showClose
              colors={this.props.colors}
          />
          <TransactionList
              // updateBalance={this.getBalanceInfo}
              currencyCode={item.currency.currency.code}
              // showDialog={this.showDialog}
              // logout={this.logout}
          />
        </View>
    );
  }

  renderWallets() {
    const {
      activeWalletIndex,
      fetchAccounts,
      viewWallet,
      showModal,
      wallets,
      colors,
      tempWallet,
      loading_accounts
    } = this.props;
    return (
        <View style={styles.container}>
          <Text style={styles.sectionTitle}>Wallets</Text>
          <CardList
              colors={colors}
              type="wallet"
              navigation={this.props.navigation}
              data={wallets}
              tempItem={tempWallet}
              loadingData={loading_accounts}
              identifier="reference"
              onRefresh={fetchAccounts}
              activeItem={
                () => {}
              }
              showDetail={false}
              renderContent={this.renderContent}
              renderDetail={this.renderContent}
              itemActive={item => (item ? item.currency.active : false)}
              textTitleLeft={item => (item ? item.currency.currency.code : '')}
              // onPressTitleLeft={item => this.showModal(item)}
              title={item => (item ? item.currency.currency.description : '')}
              subtitle={item => (item ? standardizeString(item.account_name) : '')}
              onPressTitle={
                (item, index) => {
                  this.props.navigation.navigate('Wallets', {
                    wallet: wallets[index],
                  })
                }
              }
              onPressContent={
                (item, index) => {
                  this.props.navigation.navigate('Wallets', {
                    wallet: wallets[index],
                  })
                }
              }
              emptyListMessage="No wallets added yet"
              titleStyle="secondary"
              keyExtractor={item => item.index.toString()}
              textActionOne={false}
              textActionTwo={false}
              canActive
          />
        </View>
    );
  }

  render() {
    const { colors, wallets } = this.props;
    const { viewStyleContainer, viewStyleBox, textStyle, container } = styles;
    return (
      <View style={[viewStyleContainer, { backgroundColor: colors.primary }]}>
        {wallets && wallets.length > 0 ?
            this.renderWallets()
            : (
          <View style={viewStyleBox}>
            <Text style={[textStyle, { color: colors.primaryContrast }]}>
              No company currencies available
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flex: 1,
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
  viewStyleDetailCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    // borderRadius: 2,
    // borderColor: '#ffffff',
    // borderWidth: 1,
    shadowColor: 'rgba(0, 0, 0, 0.6)',
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    shadowOffset: {
      height: 1,
      width: 2,
    },
  },
  sectionTitle: {
    fontSize: 14,
    padding: 16,
    paddingBottom: 0,
    color: Colors.titleColor
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cardLabelWrapper: {
    flex: 1,
    marginTop: 4
  },
  cardLabel: {
    opacity: 0.7
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold'
  }
};

const mapStateToProps = ({ accounts }) => {
  const { user, activeWalletIndex, tempWallet } = accounts;
  return {
    user,
    activeWalletIndex,
    tempWallet
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
  fetchAccounts,
  showModal
})(HeaderWalletList);
