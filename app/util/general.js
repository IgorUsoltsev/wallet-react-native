export const performDivisibility = (balance, divisibility) => {
  for (let i = 0; i < divisibility; i++) {
    balance = balance / 10;
  }
  return balance;
};

export const standardizeString = string => {
  if (string) {
    return (string.charAt(0).toUpperCase() + string.slice(1)).replace('_', ' ');
  }
  return '';
};

export const snakeString = string => {
  console.log(string);
  if (string) {
    return string.toLowerCase().replace(' ', '_');
  }
  return '';
};

export const decodeQR = string => {
  if (string) {
    let type,
      recipient,
      amount,
      account,
      currency,
      note = '';

    let temp = string.split(':');
    type = temp[0];

    temp = temp[1].split('?');
    recipient = temp[0];
    if (temp[1]) {
      temp = temp[1].split('&');
      console.log(temp);
      for (i = 0; i < temp.length; i++) {
        console.log('temp-i', temp[i]);
        let detail = temp[i].split('=');
        switch (detail[0]) {
          case 'amount':
            amount = detail[1];
            break;
          case 'note':
            note = detail[1];
            break;
          case 'memo':
            memo = detail[1];
            break;
          case 'account':
            account = detail[1];
            break;
          case 'currency':
            currency = detail[1];
            break;
        }
      }
    }
    return { type, recipient, amount, note, currency, account };
  }
  return '';
};
