import React, { Component } from 'react';
import { View, FlatList, Text, RefreshControl } from 'react-native';
import { WebBrowser } from 'expo';

import * as Rehive from './../util/rehive';

import TransactionListItem from './TransactionListItem';
import {
  ListSeparator,
  EmptyListMessage,
  PopUpGeneral,
  Output,
} from './common';
import Colors from './../config/colors';
import { performDivisibility } from './../util/general';

import moment from 'moment';
class TransactionList extends Component {
  state = {
    previousCurrencyCode: null,
    transactions: [],
    loading: false,
    showDetail: false,
    transaction: null,
  };

  async componentDidMount() {
    await this.getTransactions(this.props.currencyCode);
  }

  async UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.previousCurrencyCode !== nextProps.currencyCode) {
      await this.getTransactions(nextProps.currencyCode);
    }
  }

  async getTransactions(currencyCode) {
    if (this.state.previousCurrencyCode !== currencyCode) {
      this.setState({ transactions: [] });
    }
    // this.setState({ loading: true });
    // if (this.props.fetchAccounts) {
    //   this.props.fetchAccounts();
    // }
    let response = await Rehive.getTransactions(currencyCode);
    this.setState({
      previousCurrencyCode: currencyCode,
      transactions: response.results,
      loading: false,
    });
  }

  renderTransactions() {
    const { transactions, loading } = this.state;
    return (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => this.getTransactions(this.props.currencyCode)}
          />
        }
        data={transactions}
        renderItem={({ item }) => this.renderItem(item)}
        keyExtractor={item => item.id}
        ListEmptyComponent={this.renderEmptyList()}
        ItemSeparatorComponent={ListSeparator}
      />
    );
  }

  renderEmptyList() {
    const { loading } = this.state;
    if (!loading) {
      return <EmptyListMessage text="No transactions" />;
    }
    return;
  }

  showModal = item => {
    this.setState({ showDetail: true, transaction: item });
  };

  hideModal = () => {
    this.setState({ showDetail: false, transaction: null });
  };

  renderItem = item => {
    return (
      <TransactionListItem item={item} onPress={item => this.showModal(item)} />
    );
  };

  async openBrowser(transaction) {
    const metadata = transaction.metadata;
    if (metadata && metadata.type === 'stellar') {
      this.hideModal();
      await WebBrowser.openBrowserAsync(
        'http://stellarchain.io/tx/' + metadata.hash,
      );
      this.showModal(transaction);
    }
  }

  renderDetail() {
    const {
      textStyleLeft,
      textStyleRight,
      viewStyleFooter,
      textStyleHeader,
    } = styles;
    const { showDetail, transaction } = this.state;
    let iconName = '';
    let headerText = '';
    let color = '';
    let user = '';
    let userLabel = '';

    if (transaction) {
      const { amount, label, currency, fee, balance, metadata } = transaction;
      switch (transaction.tx_type) {
        case 'debit':
          // console.log('Debit');
          iconName = 'call-made';
          headerText = 'Sent ' + transaction.currency.code;
          if (transaction.destination_transaction) {
            user = transaction.destination_transaction.user.email;
            userLabel = 'Recipient';
            // headerText =
            //   headerText +
            //   ' to ' +
            //   transaction.destination_transaction.user.email;
          }
          color = Colors.positive;
          break;
        case 'credit':
          // console.log('Credit');
          iconName = 'call-received';
          headerText = 'Received ' + transaction.currency.code;
          if (transaction.source_transaction) {
            user = transaction.source_transaction.user.email;
            userLabel = 'Sender';
            // headerText =
            //   headerText + ' from ' + transaction.source_transaction.user.email;
          }
          color = Colors.negative;
          break;
        default:
          iconName = 'question';
          headerText = 'Unknown transaction type';
          color = Colors.warning;
      }
      return (
        <PopUpGeneral
          visible={showDetail}
          // iconTitleLeft={iconTitleLeft}
          title={headerText}
          // subtitle={'Subtitle?'}
          // titleStyle={titleStyle}
          iconTitleRight={'close'}
          onPressTitleRight={() => this.hideModal()}
          onDismiss={() => this.hideModal()}>
          {/* <Text style={textStyleHeader}>{headerText}</Text> */}
          {user ? <Output label={userLabel} value={user} /> : null}
          <Output label="Transaction type" value={label} />
          {/* <Output label="Total amount" value={transaction.label} /> */}
          <Output
            label="Amount"
            value={
              currency.symbol +
              ' ' +
              performDivisibility(amount, currency.divisibility).toFixed(
                currency.divisibility,
              )
            }
          />
          <Output
            label="Fees"
            value={
              currency.symbol +
              ' ' +
              performDivisibility(fee, currency.divisibility).toFixed(
                currency.divisibility,
              )
            }
          />
          <Output
            label="Balance"
            value={
              currency.symbol +
              ' ' +
              performDivisibility(balance, currency.divisibility).toFixed(
                currency.divisibility,
              )
            }
          />
          {metadata && metadata.type === 'stellar' ? (
            <Output
              label="Stellar chain hash"
              value={metadata.hash}
              onPress={() => this.openBrowser(transaction)}
            />
          ) : null}

          <View style={viewStyleFooter}>
            <View>
              <Text style={textStyleLeft}>
                {moment(transaction.created).format('lll')}
              </Text>
            </View>
            <View>
              <Text style={textStyleRight}>{transaction.status}</Text>
            </View>
          </View>
        </PopUpGeneral>
      );
    }
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderTransactions()}
        {this.renderDetail()}
      </View>
    );
  }
}

const styles = {
  containerStyle: {
    flex: 1,
    zIndex: 2,
    alignSelf: 'stretch'
  },
  textStyleHeader: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: 'bold',
    // alignSelf: 'flex-start',
    color: Colors.black,
  },
  textStyleFooter: {
    fontSize: 14,
    // alignSelf: 'flex-end',
    color: Colors.black,
  },
  viewStyleFooter: {
    // flex: 2,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
};

export default TransactionList;
