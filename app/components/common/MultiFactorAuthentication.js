/* PIN INPUT */
/*
Component that request the user to input a pin if pin has been set or 
to scan fingerprint if fingerprint has been set.
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Linking } from 'react-native';
import { maybeOpenURL } from 'react-native-app-link';

import { CodeInput } from './CodeInput';
import { Button } from './Button';
import { Screen, Paragraph, Typography } from './styles';

class MultiFactorAuthentication extends Component {
  state = { hasGAuth: false, hasAuthy: false };

  _onInputPinComplete(code) {
    const { pin, onSuccess } = this.props;
    let errorText = '';
    if (pin === code) {
      onSuccess();
    } else {
      this._pinInput.clear();
      errorText = 'Incorrect pin, please try again';
    }
    this.setState({ errorText });
  }

  async _openAuthenticator(type) {
    const { issuer, account, secret, authScreen } = this.props;

    let url =
      'totp/' + issuer + ':' + account + (secret ? '?secret=' + secret : '');
    let appName = '';
    let appStoreId = '';
    let playStoreId = '';
    // let check = Linking.canOpenURL(url);
    if (type === 'GAuth') {
      appStoreId = '388497605';
      playStoreId = 'com.google.android.apps.authenticator2';
      url = 'otpauth://' + (authScreen ? 'open/' : url);
      appName = 'Google Authenticator';
    } else if (type === 'Authy') {
      appStoreId = '494168017';
      playStoreId = 'com.authy.authy';
      url = 'authy://open/' + (authScreen ? '' : issuer);
      appName = 'Authy';
    }
    maybeOpenURL(url, { appName, appStoreId, playStoreId })
      .then(() => {
        console.log('g auth opened');
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const {
      colors,
      type,
      error,
      onSuccess,
      onDismiss,
      codeLength,
      verifyMFA,
      authScreen,
    } = this.props;
    const { viewStyleContainer, textStyle } = styles;
    return (
      <Screen>
        <Text
          style={[
            textStyle,
            authScreen ? { color: colors.primaryContrast } : {},
          ]}>
          Please enter{' '}
          {type === 'token'
            ? 'token provided by your MFA app'
            : 'the OTP sent to your mobile number'}
        </Text>
        <Text style={[textStyle, { color: colors.error }]}>{error}</Text>
        <CodeInput
          ref={component => (this._pinInput = component)}
          secureTextEntry={false}
          activeColor="gray"
          autoFocus
          inactiveColor="lightgray"
          className="border-b"
          codeLength={codeLength ? codeLength : 6}
          space={7}
          size={30}
          inputPosition="center"
          containerStyle={{ marginTop: 0, paddingBottom: 24 }}
          onFulfill={code => verifyMFA(code)}
        />
        {type === 'token' ? (
          <View
            style={{
              padding: 8,
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
            <View>
              <Button
                label="OPEN GOOGLE AUTHENTICATOR"
                textColor={colors.secondaryContrast}
                backgroundColor={colors.secondary}
                reference={input => {
                  this.login = input;
                }}
                onPress={() => this._openAuthenticator('GAuth')}
                // animation="fadeInUpBig"
              />
            </View>
            {/* <View>
              <Button
                label="OPEN AUTHY"
                textColor={colors.secondaryContrast}
                backgroundColor={colors.secondary}
                reference={input => {
                  this.login = input;
                }}
                onPress={() => this._openAuthenticator('Authy')}
                // animation="fadeInUpBig"
              />
            </View> */}
          </View>
        ) : (
          <View style={{ padding: 8 }}>
            <Button
              label="Resend SMS"
              textColor={colors.secondaryContrast}
              backgroundColor={colors.secondary}
              size="large"
              reference={input => {
                this.login = input;
              }}
              // onPress={() => resendSMS()}
              animation="fadeInUpBig"
            />
          </View>
        )}
      </Screen>
    );
  }
}

// MultiFactorAuthentication.propTypes = {
//   pin: PropTypes.string, // Required pin
//   fingerprint: PropTypes.bool, // Required fingerprint
//   modalVisible: PropTypes.bool, // Required fingerprint
//   onSuccess: PropTypes.func, // Function if pin/fingerprint success
//   onDismiss: PropTypes.func, // Function to execute on dismiss
// };

// MultiFactorAuthentication.defaultProps = {
//   pin: '',
//   fingerprint: false,
//   modalVisible: false,
//   onSuccess: () => {},
//   onDismiss: () => {},
// };

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 4,
    justifyContent: 'flex-start',
  },
  textStyle: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 16,
    paddingVertical: 24,
    fontSize: 18,
    color: 'black',
  },
};

export { MultiFactorAuthentication };
