import React, { Component } from 'react';
import {View, Text, FlatList} from 'react-native';
import { connect } from 'react-redux';
import {
  fetchAccounts,
  resetSend,
  setSendWallet,
  viewWallet,
  hideWallet,
  showModal,
  setActiveCurrency,
} from './../../redux/actions';

import Header from './../../components/header';
// import Wallet from './../../components/wallet';
import { Output, PopUpGeneral } from '../../components/common';
import { standardizeString, performDivisibility } from './../../util/general';
import HeaderWallet from '../../components/HeaderWallet';
import WalletButtons from '../../components/walletButtons';
import TransactionList from './../../components/TransactionList';
import CardList from './../../components/CardList';
import WalletAction from "../../components/WalletAction";

class WalletsScreen extends Component {
  static navigationOptions = {
    title: 'Wallets',
  };

  state = {
    showModal: false,
    wallet: null,
  };

  componentDidMount() {
    let wallet = null;
    if (this.props.navigation.state.params) {
      wallet = this.props.navigation.state.params.wallet;
      this.props.navigation.state.params.wallet = null;
    }
    if (wallet) {
      this.props.viewWallet(wallet);
    } else {
      this.props.hideWallet();
    }
  }

  showModal = item => {
    this.setState({ showModal: true, wallet: item });
  };

  hideModal = () => {
    this.setState({ showModal: false, wallet: null });
  };

  // showDetails(wallet) {
  //   this.setState({
  //     showDetails: true,
  //     wallet: wallet,
  //   });
  // }

  // hideDetails = () => {
  //   this.setState({
  //     showDetails: false,
  //     wallet: null,
  //     headerRightIcon: '',
  //     headerRightOnPress: () => {},
  //   });
  // };

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
      <View>
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
    //@todo: fix buttons stack to bottom
    return (
      <View style={[styles.viewStyleDetailHeader, {backgroundColor: this.props.company_config.colors.primary}]}>
        <HeaderWallet
            wallets={[item]}
            buttons={buttons}
            navigation={navigation}
            showClose
            colors={this.props.company_config.colors}
        />
        <TransactionList
            // updateBalance={this.getBalanceInfo}
            currencyCode={item.currency.currency.code}
            // showDialog={this.showDialog}
            // logout={this.logout}
        />
        <WalletButtons
            wallets={[item]}
            buttons={buttons}
            navigation={navigation}
            showClose
            colors={this.props.company_config.colors}
        />
      </View>
    );
  }

  render() {
    const {
      fetchAccounts,
      loading_accounts,
      wallets,
      hideWallet,
      viewWallet,
      showModal,
      setActiveCurrency,
      tempWallet,
      company_config,
    } = this.props;
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          colors={company_config.colors}
          drawer
          title="Wallets"
        />
        <CardList
          colors={company_config.colors}
          type="wallet"
          navigation={this.props.navigation}
          data={wallets}
          tempItem={tempWallet}
          loadingData={loading_accounts}
          identifier="reference"
          onRefresh={fetchAccounts}
          activeItem={item => showModal('wallet', item, 'active')}
          // showDetail={showWallet}
          renderContent={this.renderContent}
          renderDetail={(item, navigation) =>
            this.renderDetail(item, navigation)
          }
          itemActive={item => (item ? item.currency.active : false)}
          textTitleLeft={item => (item ? item.currency.currency.code : '')}
          // onPressTitleLeft={item => this.showModal(item)}
          title={item => (item ? item.currency.currency.description : '')}
          subtitle={item => (item ? standardizeString(item.account_name) : '')}
          onPressTitle={item => viewWallet(item)}
          onPressContent={item => viewWallet(item)}
          emptyListMessage="No wallets added yet"
          titleStyle="secondary"
          keyExtractor={item => item.index.toString()}
          textActionOne="SEND"
          onPressActionOne={item => this.send(item)}
          textActionTwo="RECEIVE"
          onPressActionTwo={item =>
            this.props.navigation.navigate('Receive', {
              currencyCode: item.currency.code,
            })
          }
          canActive
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  viewStyleDetailHeader: {
    flex: 1,
    flexGrow: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  viewStyleDetailCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    // borderRadius: 2,
    // borderColor: '#ffffff',
    // borderWidth: 1,
    // shadowColor: 'rgba(0, 0, 0, 0.6)',
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 2,
    // },
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

const mapStateToProps = ({ accounts, user, auth }) => {
  const { wallets, loading_accounts, tempWallet, showWallet } = accounts;
  const { company_bank_account } = user;
  const { company_config } = auth;
  return {
    wallets,
    loading_accounts,
    tempWallet,
    showWallet,
    company_bank_account,
    company_config,
  };
};

export default connect(mapStateToProps, {
  fetchAccounts,
  resetSend,
  setSendWallet,
  viewWallet,
  hideWallet,
  showModal,
  setActiveCurrency,
})(WalletsScreen);
