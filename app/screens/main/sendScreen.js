import React, { Component } from 'react';
import {
  View,
  Platform,
  Text,
  ListView,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  setSendWallet,
  validateSendAmount,
  validateSendRecipient,
  validateSendNote,
  validateSendMemo,
  setSendState,
  updateAccountField,
  send,
  setContactType,
  updateContactField,
} from '../../redux/actions';
import { getContacts } from './../../redux/reducers/ContactsReducer';

import {
  Input,
  FullScreenForm,
  Output,
  Button,
} from './../../components/common';
import Colors from './../../config/colors';
import Header from './../../components/header';
import PinModal from './../../components/PinModal';

class SendScreen extends Component {
  static navigationOptions = () => ({
    title: 'Send',
  });

  state = {
    input: '',
    balance: 0,
    ready: false,
    refreshing: false,
    reference: '',
    searchText: '',
    data: [],
    contacts: new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    }),

    showContacts: false,
    contactButtonText: 'Show contacts',

    pinVisible: false,
  };

  componentDidMount() {
    if (this.props.sendWallet === null) {
      this.props.setSendWallet(wallets[activeWalletIndex]);
    }
  }

  goToBarcodeScanner = () => {
    this.props.navigation.navigate('QRCodeScanner');
  };

  performSend() {
    const {
      sendWallet,
      sendAmount,
      sendRecipient,
      sendNote,
      sendType,
      sendMemo,
    } = this.props;

    let data = {
      type: sendType,
      amount: sendAmount,
      recipient: sendRecipient,
      note: sendNote,
      memo: sendMemo,
      currency: sendWallet.currency.currency,
      reference: sendWallet.account_reference,
    };
    this.props.send(data);
  }

  renderMainContainer() {
    const {
      sending,
      sendState,
      sendWallet,
      validateSendAmount,
      validateSendRecipient,
      validateSendNote,
      validateSendMemo,
      sendAmount,
      contactsSearch,
      contactsType,
      sendType,
      sendMemo,
      sendNote,
      sendError,
      setSendState,
      updateAccountField,
      company_config,
    } = this.props;

    const { viewStyleBottomContainer } = styles;

    let textFooterRight = 'Next';
    let onPressFooterRight = () => {};

    switch (sendState) {
      case 'amount':
        onPressFooterRight = () => validateSendAmount(sendWallet, sendAmount);
        break;
      case 'recipient':
        onPressFooterRight = () => {
          updateAccountField({
            prop: 'sendRecipient',
            value: contactsSearch,
          });
          validateSendRecipient(sendType, contactsType, contactsSearch);
        };
        break;
      case 'memo':
        onPressFooterRight = () => validateSendMemo(sendMemo);
        break;
      case 'note':
        onPressFooterRight = () => validateSendNote(sendNote);
        break;
      case 'confirm':
        textFooterRight = 'Confirm';
        onPressFooterRight = () => {
          if (company_config.pin.send) {
            this.setState({ pinVisible: true });
          } else {
            this.performSend();
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
        loading={sending}
        color={'focus'}
        colors={company_config.colors}>
        {this.renderTop()}
        <View style={viewStyleBottomContainer}>{this.renderBottom()}</View>
      </FullScreenForm>
    );
  }

  renderTop() {
    const {
      sendState,
      sendWallet,
      sendAmount,
      sendRecipient,
      sendMemo,
      sendNote,
      sendError,
      setSendState,
    } = this.props;
    const currency = sendWallet.currency.currency;

    const {
      viewStyleTopContainer,
      buttonStyleOutput,
      viewStyleError,
      textStyleError,
    } = styles;
    return (
      <View style={viewStyleTopContainer}>
        {sendState === 'success' ? (
          <View style={viewStyleError}>
            <Text style={textStyleError}>Send successful!</Text>
          </View>
        ) : null}
        {sendState === 'confirm' ? (
          <View style={viewStyleError}>
            <Text style={textStyleError}>Please confirm details</Text>
          </View>
        ) : null}
        {sendState === 'note' ||
        sendState === 'recipient' ||
        sendState === 'memo' ||
        sendState === 'confirm' ||
        sendState === 'success' ? (
          <TouchableHighlight
            onPress={() => setSendState('amount')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output
              label="Amount"
              value={
                currency.symbol +
                ' ' +
                parseFloat(sendAmount).toFixed(currency.divisibility)
              }
            />
          </TouchableHighlight>
        ) : null}
        {sendState === 'note' ||
        sendState === 'memo' ||
        sendState === 'confirm' ||
        sendState === 'success' ? (
          <TouchableHighlight
            onPress={() => setSendState('recipient')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output label="Recipient" value={sendRecipient} />
          </TouchableHighlight>
        ) : null}
        {(sendState === 'note' ||
          sendState === 'confirm' ||
          sendState === 'success') &&
        sendMemo ? (
          <TouchableHighlight
            onPress={() => setSendState('memo')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output label="Memo" value={sendMemo} />
          </TouchableHighlight>
        ) : null}
        {(sendState === 'confirm' || sendState === 'success') && sendNote ? (
          <TouchableHighlight
            onPress={() => setSendState('note')}
            underlayColor="lightgrey"
            style={buttonStyleOutput}>
            <Output label="Note" value={sendNote} />
          </TouchableHighlight>
        ) : null}
        {sendState === 'fail' ? (
          <View style={viewStyleError}>
            <Text style={textStyleError}>Send failed</Text>
            <Text style={textStyleError}>{sendError}</Text>
          </View>
        ) : null}
      </View>
    );
  }

  renderBottom() {
    const {
      sendState,
      sendAmount,
      sendWallet,
      sendRecipient,
      updateAccountField,
      sendNote,
      sendMemo,
      validateSendAmount,
      validateSendRecipient,
      validateSendMemo,
      validateSendNote,
      sendError,
      company_config,
      contacts,
      contactsError,
      contactsLoading,
      contactsType,
      contactsSearch,
      updateContactField,
      setContactType,
      sendType,
    } = this.props;
    const { colors } = company_config;
    switch (sendState) {
      case 'amount':
        return (
          <Input
            key="amount"
            placeholder="e.g. 10"
            label={'Amount [' + sendWallet.currency.currency.symbol + ']'}
            prefix={sendWallet.currency.currency.symbol}
            inputError={sendError}
            reference={input => {
              this.input = input;
            }}
            keyboardType={Platform.OS === 'ios' ? 'decimal-pad' : 'phone-pad'}
            value={sendAmount}
            onChangeText={value =>
              updateAccountField({ prop: 'sendAmount', value })
            }
            returnKeyType="next"
            autoFocus
            onSubmitEditing={() => validateSendAmount(sendWallet, sendAmount)}
            colors={colors}
          />
        );
      case 'recipient':
        let label = 'Please enter ';
        let placeholder = '';
        switch (contactsType) {
          case 'mobile':
            label = label + 'recipient name or mobile number';
            placeholder = 'e.g +27821234567';
            break;
          case 'email':
            label = label + 'recipient name or email';
            placeholder = 'e.g. user@rehive.com';
            break;
          case 'crypto':
            label = label + sendType + ' address';
            placeholder = 'GAQGVZYIZ2DX56EB6TZYGBD...';
            break;
        }
        return (
          <View>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'center',
              }}>
              <View style={{ flex: 1 }}>
                <Button
                  backgroundColor={
                    contactsType === 'email'
                      ? colors.focusContrast
                      : colors.secondary
                  }
                  textColor={
                    contactsType === 'email'
                      ? colors.focus
                      : colors.secondaryContrast
                  }
                  onPress={() => setContactType('email')}
                  label="EMAIL"
                  size="small"
                  round
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  backgroundColor={
                    contactsType === 'mobile'
                      ? colors.focusContrast
                      : colors.secondary
                  }
                  textColor={
                    contactsType === 'mobile'
                      ? colors.focus
                      : colors.secondaryContrast
                  }
                  onPress={() => setContactType('mobile')}
                  label="MOBILE"
                  size="small"
                  round
                  containerStyle={{ marginBottom: 0 }}
                />
              </View>
              {sendType === ('stellar' || 'ethereum' || 'bitcoin') ? (
                <View style={{ flex: 1 }}>
                  <Button
                    backgroundColor={
                      contactsType === 'crypto'
                        ? colors.focusContrast
                        : colors.secondary
                    }
                    textColor={
                      contactsType === 'crypto'
                        ? colors.focus
                        : colors.secondaryContrast
                    }
                    onPress={() => setContactType('crypto')}
                    label="CRYPTO"
                    size="small"
                    round
                    containerStyle={{ marginBottom: 0 }}
                  />
                </View>
              ) : null}
            </View>
            {/* <TimerCountdown
              initialSecondsRemaining={1000 * 60}
              onTick={secondsRemaining => console.log('tick', secondsRemaining)}
              onTimeElapsed={() => console.log('complete')}
              allowFontScaling={true}
              style={{ fontSize: 20 }}
            /> */}

            <Input
              key="contactsSearch"
              placeholder={placeholder}
              label={label}
              value={contactsSearch}
              onChangeText={value =>
                updateContactField({ prop: 'contactsSearch', value })
              }
              inputError={sendError}
              reference={input => {
                this.input = input;
              }}
              returnKeyType="next"
              autoFocus
              onSubmitEditing={() => {
                updateAccountField({
                  prop: 'sendRecipient',
                  value: contactsSearch,
                });
                validateSendRecipient(sendType, contactsType, contactsSearch);
              }}
              colors={colors}
              popUp
              multiline={contactsType === 'crypto' ? true : false}
              data={contacts}
              loadingData={contactsLoading}
              title="name"
              subtitle="contact"
              onPressListItem={item => {
                updateAccountField({
                  prop: 'sendRecipient',
                  value: item.contact,
                });
                validateSendRecipient(sendType, contactsType, item.contact);
              }}
            />
          </View>
        );
      case 'memo':
        return (
          <Input
            key="memo"
            placeholder=""
            label="Memo"
            value={sendMemo}
            onChangeText={value =>
              updateAccountField({ prop: 'sendMemo', value })
            }
            inputError={sendError}
            reference={input => {
              this.input = input;
            }}
            multiline
            returnKeyType="next"
            autoFocus
            onSubmitEditing={() => validateSendMemo(sendMemo)}
            colors={colors}
          />
        );
      case 'note':
        return (
          <Input
            key="note"
            placeholder="e.g. Rent"
            label="Note"
            value={sendNote}
            onChangeText={value =>
              updateAccountField({ prop: 'sendNote', value })
            }
            inputError={sendError}
            reference={input => {
              this.input = input;
            }}
            multiline
            returnKeyType="next"
            autoFocus
            onSubmitEditing={() => validateSendNote(sendNote)}
            colors={colors}
          />
        );
      default:
        return <View />;
    }
  }

  render() {
    const { pin, fingerprint, company_config } = this.props;
    // console.log(pin, fingerprint);
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          colors={company_config.colors}
          title="Send"
          back
          right
        />
        <KeyboardAvoidingView
          keyboardShouldPersistTaps={'always'}
          style={[
            styles.viewStyleContainer,
            { backgroundColor: company_config.colors.focus },
          ]}
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
          {/* <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={Keyboard.dismiss}
            accessible={false}> */}
          {this.renderMainContainer()}
          {/* </TouchableWithoutFeedback> */}
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  viewStyleTopContainer: {
    // justifyContent: 'center',
    paddingTop: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    // backgroundColor: 'orange',
    // flex: 2,
    paddingBottom: 0,
  },
  buttonStyleOutput: { width: '100%', borderRadius: 3, marginHorizontal: 8 },
  viewStyleBottomContainer: {
    // justifyContent: 'center',
    // alignSelf: 'flex-end',
    flex: 1,
    // minHeight: 100,
    borderRadius: 2,
    // position: 'absolute',
    // bottom: 0,
  },
  // contact: {
  //   height: 40,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
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

const mapStateToProps = ({ accounts, auth, contacts }) => {
  const { pin, fingerprint, company_config } = auth;
  const {
    contactsError,
    contactsLoading,
    contactsType,
    contactsSearch,
  } = contacts;
  const {
    wallets,
    sendAmount,
    sendWallet,
    sendRecipient,
    sendNote,
    sendReference,
    sendState,
    tempCurrency,
    sendError,
    sendMemo,
    sending,
    sendType,
  } = accounts;
  return {
    wallets,
    tempCurrency,
    sendAmount,
    sendWallet,
    sendRecipient,
    sendNote,
    sendReference,
    sendState,
    sendError,
    sendMemo,
    sending,
    pin,
    fingerprint,
    company_config,
    contactsError,
    contactsLoading,
    contactsType,
    contactsSearch,
    sendType,
    contacts: getContacts(contacts),
  };
};

export default connect(mapStateToProps, {
  updateAccountField,
  setSendWallet,
  validateSendAmount,
  validateSendRecipient,
  validateSendMemo,
  validateSendNote,
  setSendState,
  send,
  setContactType,
  updateContactField,
})(SendScreen);
