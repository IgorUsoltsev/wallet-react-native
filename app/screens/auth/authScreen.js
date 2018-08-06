import React, { Component } from 'react';
import { Fingerprint, Constants } from 'expo';
import {
  View,
  Image,
  KeyboardAvoidingView,
  UIManager,
  Platform,
  Text,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import {
  authFieldChange,
  nextAuthFormState,
  previousAuthFormState,
  resetPassword,
  resetAuth,
  hideModal,
  pinSuccess,
  pinFail,
  activateFingerprint,
  setPin,
  showModal,
  showFingerprintModal,
  verifyMFA,
  toggleTerms,
  logoutUser,
} from '../../redux/actions';

import Colors from './../../config/colors';
import {
  Button,
  FullScreenForm,
  Input,
  Spinner,
  PopUpGeneral,
  Slides,
  CodeInput,
  MultiFactorAuthentication,
  Checkbox,
} from './../../components/common';
import { standardizeString } from './../../util/general';
import client from './../../config/client';
import Icon from "react-native-vector-icons/MaterialIcons";

const SCREEN_WIDTH = Dimensions.get('window').width;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

class AuthScreen extends Component {
  renderMainContainer() {
    const {
      loading,
      mainState,
      detailState,
      nextAuthFormState,
      company,
      email,
      resetPassword,
      skip,
      company_config,
      terms,
    } = this.props;

    const colors = company_config ? company_config.colors : Colors;

    let iconHeaderLeft = 'arrow-back';
    let textHeaderLeft = '';
    let onPressHeaderLeft = () => {
      this.props.previousAuthFormState(this.props);
    };

    let textHeaderRight = '';
    let onPressHeaderRight = () => {};

    let textFooterRight = 'Next';
    let onPressFooterRight = () => {
      nextAuthFormState('');
    };

    // set text / icons
    switch (mainState) {
      case 'company':
        iconHeaderLeft = '';
        break;
      case 'landing':
        textFooterRight = '';
        if (client.company) {
          iconHeaderLeft = '';
        }
        break;
      case 'forgot':
        textFooterRight = 'Send';
        onPressFooterRight = () => resetPassword(company, email);
        break;
      case 'login':
        textHeaderRight = 'Forgot?';
        onPressHeaderRight = () => nextAuthFormState('forgot');
        if (detailState === 'password') {
          textFooterRight = 'Log in';
        }
        break;
      case 'register':
        if (
          (detailState === 'password' &&
            !company_config.auth.terms &&
            company_config.auth.terms.length === 0) ||
          (company_config.auth.terms &&
            terms &&
            terms.id &&
            company_config.auth.terms.length - 1 === terms.id)
        ) {
          textFooterRight = 'Register';
        }
        break;
      case 'pin':
        textFooterRight = '';
      case 'mfa':
      case 'verification':
        iconHeaderLeft = '';
        textHeaderLeft = 'Log out';
        onPressHeaderLeft = () => this.props.logoutUser();
      default:
    }
    if (skip) {
      textHeaderRight = 'Skip';
      onPressHeaderRight = () => nextAuthFormState('skip');
    }

    return (
      <FullScreenForm
        iconHeaderLeft={iconHeaderLeft}
        onPressHeaderLeft={onPressHeaderLeft}
        textHeaderLeft={textHeaderLeft}
        textHeaderRight={textHeaderRight}
        onPressHeaderRight={onPressHeaderRight}
        textFooterRight={textFooterRight}
        onPressFooterRight={onPressFooterRight}
        loading={loading}
        color={'primary'}
        colors={colors}>
        {this.renderContent()}
      </FullScreenForm>
    );
  }

  renderContent() {
    const {
      viewStyleInput,
      buttonsContainer,
      viewStyleLanding,
      imageContainer,
      image,
      textStyle,
      descriptionText,
      footerFixed,
      footerDarkText
    } = styles;
    const {
      mainState,
      detailState,
      nextAuthFormState,
      company_config,
      pinError,
      authError,
      email,
      user,
    } = this.props;

    const colors = company_config ? company_config.colors : Colors;

    const slides = company_config ? company_config.sliders.landing : null;

    const company = company_config ? company_config.company.id : null;

    const description = company_config ? company_config.company.description : null;

    switch (mainState) {
      case 'landing':
        return (
          <View style={viewStyleLanding}>
            <View style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
              <Animatable.View style={imageContainer} animation="zoomInRight">
                {slides && slides.length > 0 ? (
                    <Slides data={slides} height={200} width={SCREEN_WIDTH} />
                ) : (
                    <Image
                        source={
                          company == 'pxpay_demo'
                              ? require('./../../../assets/icons/pxpay_logo.png')
                              : require('./../../../assets/icons/icon.png')
                        }
                        resizeMode="contain"
                        style={image}
                    />
                )}
                {description && (
                    <Text style={[descriptionText]}>{description}</Text>
                )}
              </Animatable.View>
              <View style={buttonsContainer}>
                <Button
                    label="LOG IN"
                    textColor={colors.secondaryContrast}
                    backgroundColor={colors.secondary}
                    size="large"
                    reference={input => {
                      this.login = input;
                    }}
                    onPress={() => nextAuthFormState('login')}
                    animation="fadeInUpBig"
                />
              </View>
            </View>
            <View style={footerFixed}>
              <Text style={[footerDarkText]}>New to PXPay?</Text>
              <Button
                  label="Register"
                  textColor={colors.tertiaryContrast}
                  backgroundColor="transparent"
                  height="auto"
                  reference={input => {
                    this.login = input;
                  }}
                  textDecoration="underline"
                  onPress={() => nextAuthFormState('register')}
                  animation="fadeInUpBig"
              />
            </View>
          </View>
        );
      case 'forgot':
        return (
          <View style={viewStyleLanding}>
            <Text style={[textStyle, { color: colors.primaryContrast }]}>
              Instructions on how to reset your password will be sent to
            </Text>
            <View style={viewStyleInput}>{this.renderInput()}</View>
          </View>
        );
      case 'mfa':
        return (
          <View style={viewStyleLanding}>
            <MultiFactorAuthentication
              colors={colors}
              authScreen
              verifyMFA={this.props.verifyMFA}
              // issuer={user.company}
              // account={user.email}
              type={detailState}
            />
          </View>
        );
      case 'pin':
        switch (detailState) {
          case 'pin':
            return (
              <View style={viewStyleInput}>
                <Text style={[textStyle, { color: colors.primaryContrast }]}>
                  Please enter pin
                </Text>
                <Text style={[textStyle, { color: colors.error }]}>
                  {pinError}
                </Text>
                <CodeInput
                  ref={component => (this._pinInput = component)}
                  secureTextEntry
                  activeColor="gray"
                  autoFocus
                  inactiveColor="lightgray"
                  className="border-b"
                  codeLength={4}
                  space={7}
                  size={30}
                  inputPosition="center"
                  containerStyle={{ marginTop: 0, paddingBottom: 24 }}
                  onFulfill={code => this._onInputPinComplete(code)}
                />
              </View>
            );
          case 'fingerprint':
            // this._scanFingerprint();
            return (
              <View style={[viewStyleLanding,{alignItems: 'center'}]}>

                <Icon
                  name={'fingerprint'}
                  size={48}
                  color={colors.secondary}
                />
                <View style={buttonsContainer}>
                  <Button
                    label="USE FINGERPRINT"
                    textColor={colors.secondaryContrast}
                    backgroundColor={colors.secondary}
                    size="large"
                    reference={input => {
                      this.login = input;
                    }}
                    onPress={() => this._scanFingerprint()}
                    animation="slideInRight"
                  />
                </View>
              </View>
            );
          case 'set_pin':
          case 'confirm_pin':
            return (
              <View style={viewStyleLanding}>
                <Text style={[textStyle, { color: colors.primaryContrast }]}>
                  {detailState === 'set_pin'
                    ? 'Please enter pin'
                    : 'Please confirm pin'}
                </Text>
                <Text style={[textStyle, { color: colors.error }]}>
                  {authError}
                </Text>
                <CodeInput
                  ref={component => (this._pinInput = component)}
                  secureTextEntry
                  activeColor="gray"
                  autoFocus
                  inactiveColor="lightgray"
                  className="border-b"
                  codeLength={4}
                  space={7}
                  size={30}
                  inputPosition="center"
                  containerStyle={{ marginTop: 0, paddingBottom: 24 }}
                  onFulfill={code => this._onSetPinComplete(code)}
                />
              </View>
            );

          case 'set_fingerprint':
            return (
              <View style={viewStyleLanding}>
                <View style={buttonsContainer}>
                  <Button
                    label="USE FINGERPRINT"
                    textColor={colors.secondaryContrast}
                    backgroundColor={colors.secondary}
                    reference={input => {
                      this.login = input;
                    }}
                    size="large"
                    onPress={() => this._activateFingerprint()}
                    animation="slideInRight"
                  />
                  <Button
                    label="USE PIN"
                    textColor={colors.primaryContrast}
                    backgroundColor="transparent"
                    reference={input => {
                      this.login = input;
                    }}
                    textDecoration="underline"
                    onPress={() => nextAuthFormState('pin')}
                    animation="slideInRight"
                  />
                </View>
              </View>
            );
        }
      case 'verification':
        switch (detailState) {
          case 'email':
            return (
              <View style={viewStyleLanding}>
                <Text style={[textStyle, { color: colors.primaryContrast }]}>
                  Please verify your email by following the instructions sent to{' '}
                  {email}
                </Text>
                {/* <Button
                label="Open email app"
                textColor={company_config.colors.secondaryContrast}
                backgroundColor={company_config.colors.secondary}
                size="large"
                reference={input => { this.login = input; }}
                onPress={() => nextAuthFormState('login')}
                animation="fadeInUpBig"
              /> */}
                {/* <Button
                  label="Resend email"
                  textColor={company_config.colors.primaryContrast}
                  backgroundColor="transparent"
                  // size="large"
                  reference={input => { this.login = input; }}
                  onPress={() => nextAuthFormState('register')}
                  animation="fadeInUpBig"
                /> */}
              </View>
            );
        }
      default:
        return <View style={viewStyleInput}>{this.renderInput()}</View>;
    }
  }

  _onInputPinComplete(code) {
    const { pin } = this.props;
    if (pin === code) {
      this.props.pinSuccess();
    } else {
      this._pinInput.clear();
      this.props.pinFail('Pin incorrect, please try again');
    }
  }

  _onSetPinComplete(code) {
    if (!this.props.code) {
      this.props.authFieldChange({ prop: 'code', value: code });
      this._pinInput.clear();
    } else if (this.props.code === code) {
      this.props.setPin(code);
    } else {
      this._pinInput.clear();
      this.props.authFieldChange({ prop: 'code', value: '' });
    }
    this.props.nextAuthFormState();
  }

  _scanFingerprint = async () => {
    if (Platform.OS === 'android') {
      this.props.showFingerprintModal();
    }
    let result = await Expo.Fingerprint.authenticateAsync('Biometric scan');
    this.props.hideModal();

    if (result.success) {
      this.props.pinSuccess();
    } else {
      this.props.pinFail('Unable to authenticate with biometrics');
    }
  };

  _activateFingerprint = async () => {
    if (Platform.OS === 'android') {
      this.props.showFingerprintModal();
    }
    let result = await Expo.Fingerprint.authenticateAsync('Biometric scan');
    this.props.hideModal();

    if (result.success) {
      this.props.activateFingerprint();
    } else {
      this.props.pinFail('Unable to authenticate with biometrics');
    }
  };

  renderInput() {
    const {
      detailState,
      authError,
      company,
      tempCompany,
      email,
      mobile,
      password,
      first_name,
      last_name,
      country,
      company_config,
      username,
      terms,
      termsChecked,
    } = this.props;

    const colors = company_config ? company_config.colors : Colors;

    let key = detailState;
    let type = detailState;
    let placeholder = '';
    let label = standardizeString(detailState);
    let value = '';
    let onChangeText = value =>
      this.props.authFieldChange({ prop: detailState, value });
    let returnKeyType = 'done';
    let onSubmitEditing = () => this.props.nextAuthFormState('');
    let keyboardType = 'default';
    let autoCapitalize = 'none';

    switch (detailState) {
      case 'company':
        placeholder = 'e.g. Rehive';
        value = tempCompany;
        onChangeText = value =>
          this.props.authFieldChange({ prop: 'tempCompany', value });
        break;
      case 'email':
        value = email;
        placeholder = 'e.g. user@gmail.com';
        keyboardType = 'email-address';
        break;
      case 'mobile':
        value = mobile;
        placeholder = 'e.g. +12345678';
        keyboardType = 'numeric';
        break;
      case 'password':
        value = password;
        placeholder = 'e.g. Password';
        break;
      case 'first_name':
        autoCapitalize = 'words';
        value = first_name;
        placeholder = 'e.g. John';
        break;
      case 'last_name':
        autoCapitalize = 'words';
        value = last_name;
        placeholder = 'e.g. Snow';
        break;
      case 'username':
        value = username;
        placeholder = 'e.g. jon_snow';
        break;
      case 'country':
        value = country;
        placeholder = 'Password';
        break;
      case 'terms':
        return (
          <Checkbox
            colors={colors}
            link={terms.link}
            description={terms.description}
            title={terms.title}
            toggleCheck={() => this.props.toggleTerms()}
            value={termsChecked}
            error={authError}
          />
        );
    }
    return (
      <Input
        key={key}
        type={type}
        placeholder={placeholder}
        label={label}
        value={value}
        inputError={authError}
        // autoFocus
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        colors={colors}
      />
    );
  }

  renderModal() {
    const {
      modalVisible,
      modalType,
      hideModal,
      resetAuth,
      loading,
      email,
      authError,
    } = this.props;
    // console.log(this.props);

    let contentText = '';
    let textActionOne = 'OK';
    let onPressActionOne = hideModal;
    let content = null;
    switch (modalType) {
      case 'loginError':
        contentText = 'Unable to log in with provided credentials';
        break;
      case 'forgot':
        contentText =
          'Instructions on how to reset your password have been sent to ' +
          email;
        onPressActionOne = resetAuth;
        break;
      case 'fingerprint':
        contentText = 'Please scan your fingerprint';
        textActionOne = 'CANCEL';
        onPressActionOne = () => {
          if (Platform.os !== 'ios') {
            Fingerprint.cancelAuthenticate();
          }
          hideModal();
        };
        break;
    }

    return (
      <PopUpGeneral
        visible={modalVisible}
        contentText={contentText}
        textActionOne={textActionOne}
        onPressActionOne={onPressActionOne}
        onDismiss={onPressActionOne}
        // loading={loading}
        // errorText={updateError}
      />
    );
  }

  render() {
    const { loading, appLoading, postLoading, company_config } = this.props;
    const { viewStyleContainer } = styles;

    const colors = company_config ? company_config.colors : Colors;

    return (
      <KeyboardAvoidingView
        keyboardShouldPersistTaps={'never'}
        style={[viewStyleContainer, { backgroundColor: colors.primary }]}
        behavior={'padding'}
        // keyboardVerticalOffset={10}
      >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        {loading || postLoading || appLoading ? (
          <Spinner size="large" type="rehive" />
        ) : (
          this.renderMainContainer()
        )}
        {/* </TouchableWithoutFeedback> */}
        {this.renderModal()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    justifyContent: 'center',
  },
  buttonsContainer: {
    width: '100%',
    paddingTop: 25,
    paddingHorizontal: 40
  },
  viewStyleLanding: {
    justifyContent: 'center',
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
  },
  viewStylePin: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
  },
  viewStyleInput: {
    width: '100%',
    justifyContent: 'center',
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    maxWidth: 150,
    height: 40,
    marginBottom: 15
  },
  imageSmall: {
    maxWidth: 250,
    height: 50,
  },
  textStyle: {
    width: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 16,
    fontSize: 18,
  },
  textContainerTerms: {
    paddingHorizontal: 25,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTerms: {
    fontSize: 12,
    color: Colors.primary,
  },
  descriptionText: {
    maxWidth: 200,
    fontSize: 24,
    textAlign: 'center',
    color: Colors.primaryContrast,
  },
  footerFixed: {
    paddingTop: 15,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tertiary,
  },
  footerDarkText: {
    fontSize: 12,
    color: Colors.primaryContrast,
  }
};

const mapStateToProps = ({ auth }) => {
  const {
    detailState,
    countryCode,
    mainState,
    tempCompany,
    company,
    authError,
    email,
    emailError,
    mobile,
    mobileError,
    password,
    passwordError,
    loading,
    token,
    appLoading,
    modalVisible,
    modalType,
    pin,
    fingerprint,
    pinError,
    skip,
    company_config,
    postLoading,
    code,
    user,
    terms,
    termsChecked,
  } = auth;
  return {
    detailState,
    countryCode,
    mainState,
    tempCompany,
    company,
    authError,
    email,
    emailError,
    mobile,
    mobileError,
    password,
    passwordError,
    loading,
    token,
    appLoading,
    modalVisible,
    modalType,
    company_config,
    pin,
    fingerprint,
    pinError,
    skip,
    postLoading,
    code,
    user,
    terms,
    termsChecked,
  };
};

export default connect(mapStateToProps, {
  authFieldChange,
  nextAuthFormState,
  previousAuthFormState,
  resetPassword,
  resetAuth,
  showModal,
  hideModal,
  pinSuccess,
  pinFail,
  activateFingerprint,
  showFingerprintModal,
  setPin,
  verifyMFA,
  toggleTerms,
  logoutUser,
})(AuthScreen);
