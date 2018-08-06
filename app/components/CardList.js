// import lib for making component
import React, { Component } from 'react';
import {
  FlatList,
  RefreshControl,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import {
  updateInputField,
  fetchData,
  newItem,
  editItem,
  primaryItem,
  updateItem,
  deleteItem,
  confirmDeleteItem,
  resendVerification,
  verifyItem,
  showModal,
  hideModal,
  fetchAccounts,
  setActiveCurrency,
} from './../redux/actions';
import { standardizeString } from './../util/general';

import { Card, CardWallet, PopUpGeneral, EmptyListMessage, CodeInput } from './common';

// make component
class CardList extends Component {
  componentDidMount() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    } else {
      this.props.fetchData(this.props.type);
    }
  }

  renderItem = (item, index) => {
    const {
      type,
      headerComponent,
      onPressHeader,
      textTitleLeft,
      iconTitleLeft,
      itemActive,
      onPressTitleLeft,
      title,
      subtitle,
      titleStyle,
      onPressTitle,
      identifier,
      onPressContent,
      textActionOne,
      onPressActionOne,
      textActionTwo,
      onPressActionTwo,
      renderContent,
      canEdit,
      canVerify,
      canPrimary,
      canDelete,
      loadingDetail,
      profile,
      onPressFooter,
      iconFooter,
      canActive,
      // redux actions
      editItem,
      deleteItem,
      primaryItem,
      activeItem,
      resendVerification,
      colors,
    } = this.props;
    if(type && type == 'wallet'){
      return (
          <CardWallet
              colors={colors}
              headerComponent={headerComponent}
              onPressHeader={onPressHeader}
              textTitleLeft={textTitleLeft ? textTitleLeft(item) : ''}
              iconTitleLeft={iconTitleLeft}
              itemActive={itemActive ? itemActive(item,index) : false}
              onPressTitleLeft={() =>
                  onPressTitleLeft
                      ? onPressTitleLeft(item,index)
                      : canActive ? activeItem(item) : null
              }
              title={title ? title(item) : ''}
              subtitle={subtitle ? subtitle(item) : ''}
              colorTitleBackground="#4FCBFF"
              onPressTitle={() =>
                  onPressTitle
                      ? onPressTitle(item,index)
                      : canEdit ? editItem(type, item) : null
              }
              onPressContent={() =>
                  onPressContent
                      ? onPressContent(item,index)
                      : canEdit ? editItem(type, item) : null
              }
              iconFooter={
                iconFooter
                    ? iconFooter
                    : canDelete ? (!item.primary ? 'delete' : '') : ''
              }
              onPressFooter={
                onPressFooter
                    ? onPressFooter
                    : canDelete
                    ? (itemActive ? !itemActive(item) : true)
                        ? () => deleteItem(type, item)
                        : null
                    : null
              }
              textActionTwo={
                textActionTwo
                    ? textActionTwo
                    : canVerify ? (!item.verified ? 'VERIFY' : 'Verified') : ''
              }
              disableActionTwo={canVerify ? (!item.verified ? false : true) : false}
              onPressActionTwo={() =>
                  onPressActionTwo
                      ? onPressActionTwo(item)
                      : canVerify
                      ? resendVerification(type, item[identifier], profile.company)
                      : null
              }
              textActionOne={
                textActionOne
                    ? textActionOne
                    : canPrimary ? (item.primary ? 'Primary' : 'MAKE PRIMARY') : ''
              }
              disableActionOne={canPrimary ? (!item.primary ? false : true) : false}
              onPressActionOne={() =>
                  onPressActionOne
                      ? onPressActionOne(item)
                      : canPrimary ? primaryItem(type, item) : null
              }
              // backgroundColor={canPrimary ? (item.primary ? 'focus' : '') : ''}
              loading={loadingDetail}
              // swipeableContent={<Text>Pull to activate</Text>}
          >
            {renderContent ? renderContent(item) : null}
          </CardWallet>
      );
    }else{
      return (
          <Card
              colors={colors}
              headerComponent={headerComponent}
              onPressHeader={onPressHeader}
              textTitleLeft={textTitleLeft ? textTitleLeft(item) : ''}
              iconTitleLeft={iconTitleLeft}
              itemActive={itemActive ? itemActive(item) : false}
              onPressTitleLeft={() =>
                  onPressTitleLeft
                      ? onPressTitleLeft(item)
                      : canActive ? activeItem(item) : null
              }
              title={title ? title(item) : ''}
              subtitle={subtitle ? subtitle(item) : ''}
              colorTitleBackground="white"
              onPressTitle={() =>
                  onPressTitle
                      ? onPressTitle(item)
                      : canEdit ? editItem(type, item) : null
              }
              onPressContent={() =>
                  onPressContent
                      ? onPressContent(item)
                      : canEdit ? editItem(type, item) : null
              }
              iconFooter={
                iconFooter
                    ? iconFooter
                    : canDelete ? (!item.primary ? 'delete' : '') : ''
              }
              onPressFooter={
                onPressFooter
                    ? onPressFooter
                    : canDelete
                    ? (itemActive ? !itemActive(item) : true)
                        ? () => deleteItem(type, item)
                        : null
                    : null
              }
              textActionTwo={
                textActionTwo
                    ? textActionTwo
                    : canVerify ? (!item.verified ? 'VERIFY' : 'Verified') : ''
              }
              disableActionTwo={canVerify ? (!item.verified ? false : true) : false}
              onPressActionTwo={() =>
                  onPressActionTwo
                      ? onPressActionTwo(item)
                      : canVerify
                      ? resendVerification(type, item[identifier], profile.company)
                      : null
              }
              textActionOne={
                textActionOne
                    ? textActionOne
                    : canPrimary ? (item.primary ? 'Primary' : 'MAKE PRIMARY') : ''
              }
              disableActionOne={canPrimary ? (!item.primary ? false : true) : false}
              onPressActionOne={() =>
                  onPressActionOne
                      ? onPressActionOne(item)
                      : canPrimary ? primaryItem(type, item) : null
              }
              // backgroundColor={canPrimary ? (item.primary ? 'focus' : '') : ''}
              loading={loadingDetail}
              // swipeableContent={<Text>Pull to activate</Text>}
          >
            {renderContent ? renderContent(item) : null}
          </Card>
      );
    }
  };

  renderEmptyList() {
    const { refreshing, emptyListMessage } = this.props;
    if (!refreshing) {
      return <EmptyListMessage text={emptyListMessage} />;
    }
    return;
  }

  renderModal() {
    const {
      modalVisible,
      modalType,
      hideModal,
      loading,
      type,
      tempItem,
      identifier,
      updateError,
      temp_otp,
      otp,
      // redux actions
      setActiveCurrency,
      updateInputField,
      updateItem,
      confirmDeleteItem,
      verifyItem,
    } = this.props;

    let contentText = '';
    let textActionOne = '';
    let onPressActionOne = null;
    let textActionTwo = 'CANCEL';
    let onPressActionTwo = hideModal;
    let content = null;
    if (identifier && tempItem) {
      switch (modalType) {
        case 'delete':
          contentText = 'Delete ' + tempItem[identifier] + '?';
          textActionOne = 'DELETE';
          onPressActionOne = () => confirmDeleteItem(type, tempItem);
          break;
        case 'primary':
          contentText = 'Make ' + tempItem[identifier] + ' primary?';
          textActionOne = 'MAKE PRIMARY';
          onPressActionOne = () => updateItem(type, tempItem);
          break;
        case 'active':
          contentText =
            'Make ' + tempItem.currency.currency.code + ' active wallet?';
          textActionOne = 'MAKE ACTIVE';
          onPressActionOne = () => setActiveCurrency(tempItem);
          break;
        case 'verify':
          textActionTwo = 'CLOSE';
          if (type === 'email') {
            contentText = 'Verification email has been sent to ' + tempItem;
          } else if (type === 'mobile') {
            // textActionOne = 'VERIFY';
            contentText = 'Verification sms has been sent to ' + tempItem;
            content = (
              <CodeInput
                ref={component => (this._pinInput = component)}
                secureTextEntry={false}
                activeColor="gray"
                autoFocus
                inactiveColor="lightgray"
                className="border-b"
                codeLength={5}
                space={7}
                size={30}
                inputPosition="center"
                containerStyle={{ marginTop: 0, paddingBottom: 24 }}
                onFulfill={code => verifyItem('mobile', code)}
              />
            );
          }

          break;
      }
    }

    return (
      <PopUpGeneral
        visible={modalVisible}
        contentText={standardizeString(contentText)}
        textActionOne={textActionOne}
        onPressActionOne={onPressActionOne}
        onDismiss={hideModal}
        textActionTwo={textActionTwo}
        onPressActionTwo={onPressActionTwo}
        loading={loading}
        errorText={updateError}>
        {content}
      </PopUpGeneral>
    );
  }

  render() {
    const {
      loading,
      loadingData,
      title,
      subtitle,
      type,
      data,
      keyExtractor,
      renderDetail,
      navigation,
      tempItem,
      showDetail,
      wallet,
      showReward,
      textActionOne,
      onPressActionOne,
      loadingDetail,
      onPressActionTwo,
      onRefresh,
      renderHeader,
      // redux actions
      updateItem,
      fetchData,
      fetchAccounts,
      colors,
    } = this.props;
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}
        behavior={'padding'}
        enabled>
        {showDetail || showReward ? (
          <ScrollView
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps="always">
            <Card
              colors={colors}
              key={type}
              type={type}
              renderHeader={renderHeader}
              title={wallet ? '' : title ? title(tempItem) : ''}
              colorTitleBackground="white"
              subtitle={wallet ? '' : subtitle ? subtitle(tempItem) : ''}
              textActionOne={wallet ? '' : showReward ? textActionOne : 'SAVE'}
              onPressActionOne={() =>
                showReward
                  ? onPressActionOne(tempItem)
                  : updateItem(type, tempItem)
              }
              textActionTwo={wallet ? '' : 'CANCEL'}
              onPressActionTwo={() =>
                showReward ? onPressActionTwo() : fetchData(type)
              }
              loading={loadingDetail}>
              {renderDetail
                ? renderDetail(
                    tempItem ? tempItem : null,
                    navigation ? navigation : null,
                  )
                : null}
            </Card>
          </ScrollView>
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => (onRefresh ? onRefresh() : fetchData(type))}
              />
            }
            data={data}
            renderItem={({ item, index }) => this.renderItem(item, index)}
            keyExtractor={
              keyExtractor
                ? keyExtractor
                : item => (item.id ? item.id.toString() : null)
            }
            ListEmptyComponent={this.renderEmptyList()}
          />
        )}
        {this.renderModal()}
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = ({ user, auth }) => {
  const {
    profile,
    showDetail,
    updateError,
    modalVisible,
    loading,
    editing,
    wallet,
    modalType,
  } = user;
  const { otp } = auth;
  return {
    profile,
    showDetail,
    updateError,
    modalVisible,
    modalType,
    loading,
    editing,
    wallet,
    otp,
  };
};

export default connect(mapStateToProps, {
  updateInputField,
  fetchData,
  newItem,
  editItem,
  primaryItem,
  updateItem,
  deleteItem,
  confirmDeleteItem,
  resendVerification,
  verifyItem,
  showModal,
  hideModal,
  setActiveCurrency,
  fetchAccounts,
})(CardList);
