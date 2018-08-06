import React, { Component } from 'react';
import { View, FlatList, Dimensions, Animated, Text } from 'react-native';
import { connect } from 'react-redux';
import {
  setActiveWalletIndex,
  setSendWallet,
  resetSend,
  setWithdrawWallet,
  resetWithdraw,
  viewWallet,
  hideWallet,
} from './../redux/actions';

import WalletAction from './WalletAction';
import HeaderCurrency from './HeaderCurrency';
import { EmptyListMessage } from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;

class HeaderWallet extends Component {
  scrollX = new Animated.Value(0);

  componentDidMount() {
    if (this.props.wallets.length > 1) {
      this.flatListRef.scrollToIndex({
        animated: false,
        index: this.props.activeWalletIndex || 0,
      });
    }
  }

  getItemLayout = (data, index) => ({
    length: SCREEN_WIDTH,
    offset: SCREEN_WIDTH * index,
    index,
  });

  renderWallets() {
    const { wallets, showClose, hideWallet, colors } = this.props;
    if (wallets.length === 1) {
      return (
        <HeaderCurrency
          detail
          wallet={wallets[0]}
          showClose={showClose}
          closeWallet={hideWallet}
          colors={colors}
        />
      );
    } else {
      return (
        <FlatList
          onViewableItemsChanged={this.handleViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={this.props.wallets}
          horizontal
          pagingEnabled
          getItemLayout={this.getItemLayout}
          renderItem={({ item }) => (
            <HeaderCurrency wallet={item} colors={colors} />
          )}
          keyExtractor={item => item.account_name + item.currency.currency.code}
          showsHorizontalScrollIndicator={false}
        />
      );
    }
  }

  handleViewableItemsChanged = info => {
    if (info.viewableItems && info.viewableItems.length > 0) {
      this.props.setActiveWalletIndex(info.viewableItems[0].index);
    }
  };

  viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  renderButtons() {
    const { viewStyleButtons } = styles;
    return (
      <View>
        <FlatList
          contentContainerStyle={viewStyleButtons}
          data={this.props.buttons}
          horizontal
          scrollEnabled={false}
          renderItem={({ item }) => (
            <WalletAction
              type={item.type}
              onPress={() => this.onButtonPress(item.type)}
              color={this.props.colors.primaryContrast}
            />
          )}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  render() {
    const { colors, wallets } = this.props;
    const { viewStyleContainer, viewStyleBox, textStyle } = styles;
    return (
      <View style={[viewStyleContainer, { backgroundColor: colors.primary }]}>
        {wallets && wallets.length > 0 ? (
          <View>
            {this.renderWallets()}
          </View>
        ) : (
          <View style={viewStyleBox}>
            <Text style={[textStyle, { color: colors.primaryContrast }]}>
              No company currencies available
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    flexDirection: 'column',
  },
  viewStyleButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    padding: 8,
  },
  viewStyleBox: {
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 18,
    fontWeight: 'normal',
  },
};

const mapStateToProps = ({ accounts }) => {
  const { user, activeWalletIndex, tempWallet } = accounts;
  return {
    user,
    activeWalletIndex,
    tempWallet,
  };
};

export default connect(mapStateToProps, {
  setActiveWalletIndex,
  setSendWallet,
  resetSend,
  setWithdrawWallet,
  resetWithdraw,
  viewWallet,
  hideWallet,
})(HeaderWallet);
