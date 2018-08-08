import React, { Component } from 'react';
import {
  View,
  AsyncStorage,
  Text,
  ListView,
  TouchableHighlight,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import {
  setWithdrawWallet,
  setWithdrawBankAccount,
  validateWithdrawAmount,
  validateWithdrawRecipient,
  validateWithdrawNote,
  setWithdrawState,
  updateAccountField,
  withdraw,
} from '../../redux/actions';

import { Input, FullScreenForm, Output } from './../../components/common';
import Colors from './../../config/colors';
import Header from './../../components/header';
import PinModal from './../../components/PinModal';

class WithdrawScreen extends Component {
  static navigationOptions = () => ({
    title: 'Withdraw Amount',
  });

  state = {
    pinVisible: false,
  };

  componentDidMount() {
    const { withdrawWallet, wallets, activeWalletIndex } = this.props;
    console.log('1', withdrawWallet);
    console.log('2', wallets);
    console.log('3', activeWalletIndex);
    if (withdrawWallet === null) {
      console.log('lol');
      this.props.setWithdrawWallet(wallets[activeWalletIndex]);
    }
  }

  performWithdraw() {
    const {
      withdrawWallet,
      withdrawAmount,
      // withdrawRecipient,
      withdrawBankAccount,
      withdrawNote,
    } = this.props;

    let data = {
      amount: withdrawAmount,
      currency: withdrawWallet.currency.currency,
      metadata: { bank_account: withdrawBankAccount },
      note: withdrawNote,
      reference: withdrawWallet.account_reference,
    };
    this.props.withdraw(data);
  }

  renderMainContainer() {
    const {
      withdrawing,
      withdrawState,
      withdrawWallet,
      withdrawAccount,
      validateWithdrawAmount,
      validateWithdrawRecipient,
      validateWithdrawNote,
      withdrawAmount,
      validateWithdrawAccount,
      withdrawNote,
      withdrawError,
      setWithdrawState,
      company_config,
    } = this.props;

    const { viewStyleBottomContainer } = styles;

    let textFooterRight = 'Next';
    let onPressFooterRight = () => {};

    switch (withdrawState) {
      case 'amount':
        onPressFooterRight = () =>
          validateWithdrawAmount(withdrawWallet, withdrawAmount);
        break;
      case 'account':
        onPressFooterRight = () => validateWithdrawAccount(withdrawAccount);
        break;
      case 'note':
        onPressFooterRight = () => validateWithdrawNote(withdrawNote);
        break;
      case 'confirm':
        textFooterRight = 'Confirm';
        onPressFooterRight = () => {
          if (company_config.pin.withdraw) {
            this.setState({ pinVisible: true });
          } else {
            this.performWithdraw();
          }
        };
        break;
      case 'success':
        textFooterRight = 'Close';
        onPressFooterRight = () => this.props.navigation.goBack();
        break;
      case 'fail':
        textFooterRight = 'Close';
        onPressFooterRight = () => this.props.navigation.goBack();
        break;
    }

    return (
      <FullScreenForm
        textFooterRight={textFooterRight}
        onPressFooterRight={onPressFooterRight}
        loading={withdrawing}
        colors={company_config.colors}>
        {this.renderTop()}
        <View style={viewStyleBottomContainer}>{this.renderBottom()}</View>
      </FullScreenForm>
    );
  }

  renderTop() {
    const {
      withdrawState,
      withdrawWallet,
      withdrawAmount,
      withdrawBankAccount,
      withdrawNote,
      withdrawError,
      setWithdrawState,
    } = this.props;
    const currency = withdrawWallet ? withdrawWallet.currency.currency : null;

    const {
      viewStyleTopContainer,
      buttonStyleOutput,
      viewStyleError,
      textStyleError,
    } = styles;
    return (
      <View style={viewStyleTopContainer}>
        {withdrawState === 'success' ? (
          <View style={viewStyleError}>
            <Text style={textStyleError}>Withdraw successful!</Text>
          </View>
        ) : null}
        {withdrawState === ('note' || 'account' || 'confirm' || 'success') ? (
          <TouchableHighlight
            onPress={() => setWithdrawState('amount')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output
              label="Amount"
              value={
                currency.symbol +
                ' ' +
                parseFloat(withdrawAmount).toFixed(currency.divisibility)
              }
            />
          </TouchableHighlight>
        ) : null}
        {withdrawState === ('note' || 'confirm' || 'success') ? (
          <TouchableHighlight
            onPress={() => setWithdrawState('account')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output label="Account" value={withdrawBankAccount.name} />
          </TouchableHighlight>
        ) : null}
        {withdrawState === ('confirm' || 'success') && withdrawNote ? (
          <TouchableHighlight
            onPress={() => setWithdrawState('note')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output label="Note" value={withdrawNote} />
          </TouchableHighlight>
        ) : null}
        {withdrawState === 'fail' ? (
          <View style={viewStyleError}>
            <Text style={textStyleError}>Withdraw failed</Text>
            <Text style={textStyleError}>{withdrawError}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  renderBottom() {
    const {
      withdrawState,
      withdrawAmount,
      withdrawWallet,
      withdrawAccountName,
      updateAccountField,
      withdrawNote,
      validateWithdrawAmount,
      setWithdrawBankAccount,
      validateWithdrawNote,
      withdrawError,
      bank_account,
      loading_bank_account,
      setWithdrawState,
      company_config,
    } = this.props;
    const { colors } = company_config;

    switch (withdrawState) {
      case 'amount':
        return (
          <Input
            key="amount"
            placeholder="e.g. 10"
            label={'Amount [' + withdrawWallet.currency.currency.symbol + ']'}
            prefix={withdrawWallet.currency.currency.symbol}
            inputError={withdrawError}
            reference={input => {
              this.input = input;
            }}
            keyboardType="numeric"
            value={withdrawAmount}
            onChangeText={value =>
              updateAccountField({ prop: 'withdrawAmount', value })
            }
            returnKeyType="next"
            autoFocus
            onSubmitEditing={() =>
              validateWithdrawAmount(withdrawWallet, withdrawAmount)
            }
            colors={colors}
          />
        );
      case 'account':
        return (
          <Input
            key="account"
            placeholder="e.g. FNB"
            label={'Please select account'}
            value={withdrawAccountName}
            onChangeText={value =>
              updateAccountField({ prop: 'withdrawAccountName', value })
            }
            inputError={withdrawError}
            reference={input => {
              this.input = input;
            }}
            returnKeyType="next"
            autoFocus
            type="account"
            popUp
            data={bank_account}
            loadingData={loading_bank_account}
            title="name"
            subtitle="number"
            onPressListItem={item => {
              setWithdrawBankAccount(item);
              setWithdrawState('note');
            }}
            colors={colors}
          />
        );
      case 'note':
        return (
          <Input
            key="note"
            placeholder="e.g. Rent"
            label="Note:"
            value={withdrawNote}
            onChangeText={value =>
              updateAccountField({ prop: 'withdrawNote', value })
            }
            inputError={withdrawError}
            reference={input => {
              this.input = input;
            }}
            returnKeyType="next"
            autoFocus
            onSubmitEditing={() => validateWithdrawNote(withdrawNote)}
            colors={colors}
          />
        );
      default:
        return <View />;
    }
  }

  render() {
    const { pin, fingerprint, company_config } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          colors={company_config.colors}
          title="Withdraw"
          back
        />
        <KeyboardAvoidingView
          keyboardShouldPersistTaps={'never'}
          style={styles.viewStyleContainer}
          behavior={'padding'}>
          {this.state.pinVisible ? (
            <PinModal
              pin={pin}
              fingerprint={fingerprint}
              modalVisible={this.state.pinVisible}
              onSuccess={() => {
                this.setState({ pinVisible: false });
                this.performSend();
              }}
              onDismiss={() => this.setState({ pinVisible: false })}
            />
          ) : null}
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}
            accessible={false}>
            {/* <View /> */}
            {this.renderMainContainer()}
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.primary,
    // paddingTop: 10,
  },
  viewStyleTopContainer: {
    // justifyContent: 'center',
    paddingTop: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  buttonStyleOutput: { width: '100%', borderRadius: 3, marginHorizontal: 8 },
  viewStyleBottomContainer: {
    borderRadius: 2,
  },
  textStyleOutput: {
    fontSize: 16,
    // alignSelf: 'center',
    padding: 8,
    paddingBottom: 0,
  },
  viewStyleError: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyleError: {
    fontSize: 20,
    fontWeight: 'bold',
  },
};

const mapStateToProps = ({ accounts, user, auth }) => {
  const { pin, fingerprint, company_config } = auth;
  const {
    wallets,
    withdrawAmount,
    withdrawWallet,
    withdrawBankAccount,
    withdrawNote,
    withdrawReference,
    withdrawAccountName,
    withdrawState,
    tempCurrency,
    withdrawError,
    withdrawing,
  } = accounts;
  const { bank_account, loading_bank_account } = user;
  return {
    wallets,
    tempCurrency,
    withdrawAmount,
    withdrawWallet,
    withdrawBankAccount,
    withdrawNote,
    withdrawReference,
    withdrawAccountName,
    withdrawState,
    withdrawError,
    withdrawing,
    bank_account,
    loading_bank_account,
    pin,
    fingerprint,
    company_config,
  };
};

export default connect(mapStateToProps, {
  updateAccountField,
  setWithdrawWallet,
  validateWithdrawAmount,
  setWithdrawBankAccount,
  validateWithdrawRecipient,
  validateWithdrawNote,
  setWithdrawState,
  withdraw,
})(WithdrawScreen);
