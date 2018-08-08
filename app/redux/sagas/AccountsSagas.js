import { all, call, put, takeEvery, select } from 'redux-saga/effects';
import {
  FETCH_ACCOUNTS_ASYNC,
  SET_ACTIVE_CURRENCY_ASYNC,
  SEND_ASYNC,
  HIDE_MODAL,
  LOGOUT_USER_ASYNC,
  SET_SEND_WALLET,
  SET_SEND_TYPE,
} from '../actions';
import { Toast } from 'native-base';
// import Big from 'big.js';
import * as Rehive from '../../util/rehive';
import { getCrypto } from './selectors';

function* fetchAccounts() {
  try {
    response = yield call(Rehive.getAccounts);
    const accounts = response.results;
    let wallets = [];
    let activeWalletIndex = 0;
    let currencies;
    let account;
    let showAccountLabel = false;
    // console.log(accounts);
    if (accounts.length > 0) {
      // var wallets = _.flatten(_.flatten(accounts, 'users'));

      // console.log('1', _.flatten(accounts.results));

      // let wallets = _.map(accounts.results, function(account) {
      //   return _.flatten(account.currencies);
      // });

      // wallets.log('1', _.flatten(accounts));

      // _.map(currencies, 'user');

      // console.log(accounts);

      let index = 0;
      for (var i = 0; i < accounts.length; i++) {
        account = accounts[i];
        currencies = account.currencies;
        for (var j = 0; j < currencies.length; j++) {
          wallets[index] = {
            index,
            account_reference: account.reference,
            account_name: account.name,
            currency: currencies[j],
          };
          if (currencies[j].active === true) {
            activeWalletIndex = index;
          }
          index++;
        }
      }
      if (accounts.length > 1) {
        showAccountLabel = true;
      }
      if (wallets.length > 0) {
        const activeItem = wallets[activeWalletIndex];
        wallets[activeWalletIndex] = wallets[0];
        wallets[0] = activeItem;
      }
    } else {
      wallets = [];
    }

    yield put({
      type: FETCH_ACCOUNTS_ASYNC.success,
      payload: { wallets, activeWalletIndex: 0, showAccountLabel },
    });
  } catch (error) {
    console.log('accountsFetch', error);
    if (error.status === 401) {
      yield put({
        type: LOGOUT_USER_ASYNC.success,
      });
    }
    yield put({ type: FETCH_ACCOUNTS_ASYNC.error, payload: error.message });
  }
}

function* setActiveCurrency(action) {
  try {
    // console.log(action);
    yield call(
      Rehive.setActiveCurrency,
      action.payload.account_reference,
      action.payload.currency.currency.code,
    );
    Toast.show({
      text: action.payload.currency.currency.code + ' set as active currency',
    });
    yield all([
      put({ type: SET_ACTIVE_CURRENCY_ASYNC.success }),
      put({ type: HIDE_MODAL }),
      put({ type: FETCH_ACCOUNTS_ASYNC.pending }),
    ]);
  } catch (error) {
    console.log(error);
    yield put({
      type: SET_ACTIVE_CURRENCY_ASYNC.error,
      payload: error.message,
    });
  }
}

function* checkSendServices(action) {
  try {
    let service = 'rehive';
    const services = yield select(getCrypto);
    console.log('services', services);
    if (services.stellar.includes(action.payload.currency.currency.code)) {
      service = 'stellar';
    } else if (
      services.bitcoin.includes(action.payload.currency.currency.code)
    ) {
      service = 'bitcoin';
    } else if (
      services.ethereum.includes(action.payload.currency.currency.code)
    ) {
      service = 'ethereum';
    }

    yield put({
      type: SET_SEND_TYPE,
      payload: service,
    });
  } catch (error) {
    console.log('checkSendServices', error);
    // yield put({ type: FETCH_ACCOUNTS_ASYNC.error, payload: error.message });
  }
}

export const accountsSagas = all([
  takeEvery(FETCH_ACCOUNTS_ASYNC.pending, fetchAccounts),
  takeEvery(SEND_ASYNC.success, fetchAccounts),
  takeEvery(SET_ACTIVE_CURRENCY_ASYNC.pending, setActiveCurrency),
  takeEvery(SET_SEND_WALLET, checkSendServices),
]);
