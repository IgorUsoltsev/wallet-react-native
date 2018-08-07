import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
  Clipboard,
} from 'react-native';
import { connect } from 'react-redux';

import { Toast } from 'native-base';
import Header from './../../components/header';
import { Output, Button } from './../../components/common';

const SCREEN_WIDTH = Dimensions.get('window').width;

class ReceiveScreen extends Component {
  static navigationOptions = {
    title: 'Receive',
  };

  state = {
    imageURI:
      'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=undefined&choe=UTF-8',
    email: '',
    type: 'email',
  };

  componentDidMount() {
    const currencyCode = this.props.navigation.getParam(currencyCode, '');
    this.setState({ currencyCode });
    this.switchToEmail();
  }

  switchToEmail() {
    const user = this.props.profile;
    const currencyCode = this.state.currencyCode;
    const imageURI =
      'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=' +
      encodeURIComponent(
        'rehive:' +
          user.email +
          (currencyCode ? '?currency=' + currencyCode : ''),
      ) +
      '&choe=UTF-8';
    this.setState({ imageURI, email: user.email, type: 'email' });
  }

  switchToCrypto() {
    const user = this.props.profile;
    const currencyCode = this.state.currencyCode;
    const imageURI =
      'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=' +
      encodeURIComponent(
        'stellar:GANOZF7TIDYZ7MGRVVMAJHBQ7JCWRNRDHPY6N4W5OWU2JWNMQ2D67NVQ?' +
          (user.username ? 'memo=' + user.username + '&' : '') +
          (currencyCode ? 'currency=' + currencyCode : ''),
      ) +
      '&choe=UTF-8';
    this.setState({ imageURI, type: 'crypto' });
  }

  _copyQR() {
    const { type } = this.state;
    const user = this.props.profile;
    const value =
      type === 'email'
        ? user.email
        : 'GANOZF7TIDYZ7MGRVVMAJHBQ7JCWRNRDHPY6N4W5OWU2JWNMQ2D67NVQ';
    Clipboard.setString(value);
    Toast.show({
      text:
        value +
        ' copied.' +
        (type === 'email'
          ? ''
          : ' Please remember to include your memo when sending to this address.'),
      duration: 3000,
    });
  }

  render() {
    const { type } = this.state;
    const { colors } = this.props.company_config;
    const user = this.props.profile;
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          colors={this.props.company_config.colors}
          back
          title="Receive"
        />
        <View>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent: 'center',
            }}>
            <View style={{ width: SCREEN_WIDTH / 2 }}>
              <Button
                backgroundColor={
                  type === 'email' ? colors.focusContrast : colors.secondary
                }
                textColor={
                  type === 'email' ? colors.focus : colors.secondaryContrast
                }
                onPress={() => this.switchToEmail()}
                label="EMAIL"
                size="small"
                round
                containerStyle={{ margin: 16 }}
              />
            </View>
            <View style={{ width: SCREEN_WIDTH / 2 }}>
              <Button
                backgroundColor={
                  type === 'crypto' ? colors.focusContrast : colors.secondary
                }
                textColor={
                  type === 'crypto' ? colors.focus : colors.secondaryContrast
                }
                onPress={() => this.switchToCrypto()}
                label="CRYPTO"
                size="small"
                round
                containerStyle={{ margin: 16 }}
              />
            </View>
          </View>
          <Text style={styles.text}>
            {type === 'crypto'
              ? 'This QR code is your public address for accepting payments.'
              : 'This QR code is your PXPay account for use with another PXPay app'}
          </Text>

          <TouchableHighlight
            underlayColor={'white'}
            activeOpacity={0.2}
            onPress={() => this._copyQR()}>
            <Image
              style={{ width: 300, height: 250, alignSelf: 'center' }}
              source={{ uri: this.state.imageURI }}
            />
          </TouchableHighlight>
        </View>
        <View style={{ padding: 16, width: '100%' }}>
          <Output
            label={type === 'email' ? 'Email' : 'Memo'}
            value={type === 'email' ? this.state.email : user.username}
            copy
          />
        </View>
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    // alignItems: 'center',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    paddingHorizontal: 8,
  },
};

const mapStateToProps = ({ user, auth }) => {
  const { company_config } = auth;
  const { profile } = user;
  return { profile, company_config };
};

export default connect(mapStateToProps, {})(ReceiveScreen);
