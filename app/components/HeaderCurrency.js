import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import Colors from './../config/colors';
import { HeaderButton } from './common';
import { performDivisibility } from './../util/general';

const SCREEN_WIDTH = Dimensions.get('window').width;

class HeaderCurrency extends Component {
  getAmountTextStyle(currency) {
    const { colors } = this.props;
    const diff = Math.abs(
      currency.currency.divisibility -
        currency.available_balance.toString().length,
    );
    const length = Math.min(
      currency.currency.divisibility +
        (diff > 0 ? diff : 0) +
        currency.currency.code.length,
      20,
    );
    // console.log('diff', diff);
    // console.log('length', length);
    // console.log('divisibility', currency.currency.divisibility);
    let fontSize = Math.min(Math.floor(SCREEN_WIDTH / (0.8 * length)), 42);
    return [styles.textStyleAmount, { fontSize, color: colors.focus }];
  }

  render() {
    const {
      detail,
      showAccountLabel,
      showClose,
      closeWallet,
      colors,
    } = this.props;
    const { currency, account_name } = this.props.wallet;
    const {
      viewStyleContainer,
      viewStyleCurrency,
      textStyleCode,
      textStyleAccount,
      iconStyleTitleRight,
    } = styles;
    console.log();
    return (
      <View
        style={[
          viewStyleContainer,
          detail
            ? {
                paddingTop: 12,
                width: SCREEN_WIDTH - 16,
              }
            : { width: SCREEN_WIDTH },
          { backgroundColor: colors.primary },
        ]}>
        {showClose ? (
          <View style={iconStyleTitleRight}>
            <HeaderButton
              icon="close"
              onPress={closeWallet}
              color="lightgrey"
            />
          </View>
        ) : null}
        <Text style={[textStyleCode, { color: colors.primaryContrast }]}>
          {currency.currency.code}
        </Text>
        {showAccountLabel ? (
          <Text style={[textStyleAccount, { color: colors.primaryContrast }]}>
            {account_name}
          </Text>
        ) : null}
        {/* {showClose ? (
          <HeaderButton
            icon='close'
            onPress={onPressTitleRight}
            color={
              titleStyle
                ? Colors[titleStyle + 'Contrast']
                : Colors.primaryContrast
            }
          />
        ) : null} */}
        <View
          style={[viewStyleCurrency, detail ? null : { paddingBottom: 16 }]}>
          <Text style={this.getAmountTextStyle(currency)}>
            {currency.currency.symbol}
          </Text>
          <Text style={this.getAmountTextStyle(currency)}>
            {' '}
            {performDivisibility(
              currency.available_balance,
              currency.currency.divisibility,
            ).toFixed(currency.currency.divisibility)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    // flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewStyleCurrency: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyleCode: {
    color: Colors.primaryContrast,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 0,
  },
  textStyleAccount: {
    color: Colors.primaryContrast,
    fontSize: 16,
    // fontWeight: 'bold',
    paddingBottom: 8,
  },
  textStyleAmount: {
    fontSize: 42,
    // paddingHorizontal: 2,
    // flexWrap: 'no-wrap',
    fontWeight: 'bold',
  },
  iconStyleTitleRight: {
    right: 0,
    top: -8,
    margin: 0,
    position: 'absolute',
  },
};

const mapStateToProps = ({ accounts }) => {
  const { showAccountLabel } = accounts;
  return { showAccountLabel };
};

export default connect(mapStateToProps, {})(HeaderCurrency);
