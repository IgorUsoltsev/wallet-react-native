import Big from 'big.js';

import * as Rehive from '../../util/rehive';
import { createAsyncTypes } from '../store/Utilities';
import {
  validateEmail,
  validateMobile,
  validateCrypto,
} from '../../util/validation';

export const ACCOUNT_FIELD_CHANGED = 'account_field_changed';
export const ACCOUNT_FIELD_ERROR = 'account_field_error';
export const updateAccountField = ({ prop, value }) => {
  return {
    type: ACCOUNT_FIELD_CHANGED,
    payload: { prop, value },
  };
};

export const FETCH_ACCOUNTS_ASYNC = createAsyncTypes('fetch_accounts');
export const fetchAccounts = () => {
  return { type: FETCH_ACCOUNTS_ASYNC.pending };
};

// TODO: REPLACE
export const UPDATE_CURRENT_INDEX = 'update_current_index';
export const setActiveWalletIndex = index => {
  return {
    type: UPDATE_CURRENT_INDEX,
    payload: index,
  };
};

export const SET_SEND_TYPE = 'set_send_type';
export const SET_SEND_WALLET = 'set_send_wallet';
export const setSendWallet = wallet => {
  if (wallet) {
    return {
      type: SET_SEND_WALLET,
      payload: wallet,
    };
  } else {
    // Return fail?
  }
};

export const validateSendAmount = (wallet, amount) => {
  for (let i = 0; i < wallet.currency.currency.divisibility; i++) {
    amount = amount * 10;
  }
  if (amount <= wallet.currency.available_balance && amount) {
    return setSendState('recipient');
  } else {
    return {
      type: ACCOUNT_FIELD_ERROR,
      payload: 'Invalid send amount',
    };
  }
};

export const validateSendRecipient = (sendType, contactsType, recipient) => {
  let error = '';
  if (recipient) {
    if (contactsType == 'email') {
      error = validateEmail(recipient);
    } else if (contactsType == 'mobile') {
      error = validateMobile(recipient);
    } else if (contactsType == 'crypto') {
      error = validateCrypto(recipient, sendType);
    }
    if (!error) {
      if (
        sendType === 'stellar' &&
        contactsType === 'crypto' &&
        !recipient.includes('*')
      ) {
        return setSendState('memo');
      }
      return setSendState('note');
    }
  } else {
    error = 'Recipient cannot be blank';
  }
  return {
    type: ACCOUNT_FIELD_ERROR,
    payload: error,
  };
};

export const validateSendMemo = memo => {
  return setSendState('note');
};

export const validateSendNote = note => {
  return setSendState('confirm');
};

export const SET_SEND_STATE = 'set_send_state';
export const setSendState = state => {
  if (state) {
    return {
      type: SET_SEND_STATE,
      payload: state,
    };
  } else {
    // Return fail?
  }
};

export const RESET_SEND = 'reset_send';
export const resetSend = () => {
  return {
    type: RESET_SEND,
  };
};

export const SEND_ASYNC = createAsyncTypes('send');
export const send = sendData => async dispatch => {
  let amount = new Big(sendData.amount);
  for (let i = 0; i < sendData.currency.divisibility; i++) {
    amount = amount.times(10);
  }
  let data = {
    amount: parseInt(amount, 0),
    recipient: sendData.recipient,
    note: sendData.note,
    currency: sendData.currency.code,
    debit_account: sendData.reference,
  };
  dispatch({ type: SEND_ASYNC.pending });
  let response = '';
  try {
    switch (sendData.type) {
      case 'rehive':
        response = await Rehive.createTransfer(data);
        break;
      case 'stellar':
        data['to_reference'] = data.recipient;
        delete data.debit_account;
        delete data.recipient;
        console.log(data);
        response = await Rehive.createTransferStellar(data);
        break;
    }
    console.log('response', response);
    dispatch({
      type: SEND_ASYNC.success,
    });
  } catch (error) {
    dispatch({
      type: SEND_ASYNC.error,
      payload: error,
    });
  }
};

export const SET_WITHDRAW_WALLET = 'set_withdraw_wallet';
export const setWithdrawWallet = wallet => {
  return {
    type: SET_WITHDRAW_WALLET,
    payload: wallet,
  };
};

export const SET_WITHDRAW_BANK_ACCOUNT = 'set_withdraw_bank_account';
export const setWithdrawBankAccount = bankAccount => {
  return {
    type: SET_WITHDRAW_BANK_ACCOUNT,
    payload: bankAccount,
  };
};

export const validateWithdrawNote = note => {
  return setWithdrawState('confirm');
};

export const validateWithdrawAmount = (wallet, amount) => {
  // console.log(wallet, amount);
  // const currency = wallet.currency.currency;
  for (let i = 0; i < wallet.currency.currency.divisibility; i++) {
    amount = amount * 10;
  }
  if (amount <= wallet.currency.available_balance && amount) {
    return setWithdrawState('account');
  } else {
    return {
      type: ACCOUNT_FIELD_ERROR,
      payload: 'Invalid send amount',
    };
  }
};

export const SET_WITHDRAW_STATE = 'set_withdraw_state';
export const setWithdrawState = state => {
  if (state) {
    return {
      type: SET_WITHDRAW_STATE,
      payload: state,
    };
  } else {
    // Return fail?
  }
};

export const RESET_WITHDRAW = 'reset_withdraw';
export const resetWithdraw = () => {
  return {
    type: RESET_WITHDRAW,
  };
};

export const WITHDRAW_ASYNC = createAsyncTypes('withdraw');
export const withdraw = data => async dispatch => {
  let amount = new Big(data.amount);
  for (let i = 0; i < data.currency.divisibility; i++) {
    amount = amount.times(10);
  }
  dispatch({ type: WITHDRAW_ASYNC.pending });
  try {
    await Rehive.createDebit(
      amount,
      data.currency.code,
      data.reference,
      data.note,
      data.metadata,
    );
    dispatch({
      type: WITHDRAW_ASYNC.success,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: WITHDRAW_ASYNC.error,
      payload: error,
    });
  }
};

export const SET_ACTIVE_CURRENCY_ASYNC = createAsyncTypes(
  'set_active_currency',
);
export const setActiveCurrency = wallet => {
  return {
    type: SET_ACTIVE_CURRENCY_ASYNC.pending,
    payload: wallet,
  };
};

export const VIEW_WALLET = 'view_wallet';
export const viewWallet = wallet => {
  return {
    type: VIEW_WALLET,
    payload: wallet,
  };
};

export const HIDE_WALLET = 'hide_wallet';
export const hideWallet = () => {
  return {
    type: HIDE_WALLET,
  };
};
