import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import {
  logoutUser,
  setActiveWalletIndex,
  fetchAccounts,
} from './../../redux/actions';

import Swiper from 'react-native-swiper';

import Header from './../../components/header';
import HeaderWalletList from '../../components/headerWalletList';
import TransactionList from './../../components/TransactionList';
import HomeCards from './../../components/HomeCards';
import Colors from "../../config/colors";

const renderPagination = (index, total, context) => {
  return (
    <View style={styles.paginationStyle}>
      {/* <Text style={{ color: 'grey' }} /> */}
    </View>
  );
};

class HomeScreen extends Component {
  static navigationOptions = {
    label: 'Home',
  };

  componentDidMount() {
    // ContactService.getAllContacts();
  }

  showDialog = item => {
    this.setState({ dataToShow: item });
    this.popupDialog.show();
  };

  render() {
    const {
      wallets,
      activeWalletIndex,
      fetchAccounts,
      tempWallet,
      loadingAccounts,
      company_config,
    } = this.props;

    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          drawer
          colors={company_config.colors}
          right
          home
          inverted={true}
          noShadow
          // noAccounts={this.state.noAccounts}
        />
        <HeaderWalletList
          wallets={wallets}
          navigation={this.props.navigation}
          colors={company_config.colors}
          tempWallet={tempWallet}
          loadingAccounts={loadingAccounts}
          company_bank_account={this.props.company_bank_account}
        />
        {/* currency={item} accountLabel={account.name} /> */}
        {/* {this.renderAccounts()} */}
        <Swiper renderPagination={renderPagination} loop={false}>
          <View style={{ flex: 1 }}>
            <HomeCards navigation={this.props.navigation} />
            {/*<TransactionList*/}
              {/*// updateBalance={this.getBalanceInfo}*/}
              {/*// fetchAccounts={fetchAccounts}*/}
              {/*currencyCode={*/}
                {/*wallets && wallets.length*/}
                  {/*? wallets[activeWalletIndex].currency.currency.code*/}
                  {/*: ''*/}
              {/*}*/}
              {/*// showDialog={this.showDialog}*/}
              {/*// logout={this.logout}*/}
            {/*/>*/}
          </View>
        </Swiper>
        {/* <TransactionPopUp
          popupDialog={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          transactionDetails={this.state.dataToShow}
        /> */}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
};

const mapStateToProps = ({ auth, accounts, user }) => {
  const { token, company_config } = auth;
  const { company_bank_account } = user;
  const { wallets, activeWalletIndex, tempWallet, loadingAccounts } = accounts;
  return { token, company_config, wallets, activeWalletIndex, tempWallet, loadingAccounts, company_bank_account };
};

export default connect(mapStateToProps, { logoutUser, fetchAccounts })(
  HomeScreen,
);