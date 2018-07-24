import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from './../../config/colors';
import { Spinner } from './Spinner';
import { HeaderButton } from './HeaderButton';

const FullScreenForm = props => {
  const {
    viewStyleContainer,
    viewStyleHeader,
    viewStyleContent,
    viewStyleFooter,
    iconStyleHeaderLeft,
    buttonStyleActionRight,
    textStyleAction,
  } = styles;

  const {
    iconHeaderLeft,
    onPressHeaderLeft,
    textHeaderRight,
    onPressHeaderRight,
    textFooterLeft,
    onPressFooterLeft,
    textFooterRight,
    onPressFooterRight,
    loading,
    color,
    colors,
  } = props;

  return (
    <View style={[viewStyleContainer, { backgroundColor: colors[color] }]}>
      {iconHeaderLeft || textHeaderRight ? (
        <View style={viewStyleHeader}>
          {iconHeaderLeft ? (
            <HeaderButton
              icon={iconHeaderLeft}
              onPress={onPressHeaderLeft}
              color={colors[color + 'Contrast']}
            />
          ) : (
            <View />
          )}
          {textHeaderRight ? (
            <TouchableOpacity onPress={onPressHeaderRight}>
              <Text
                style={[
                  textStyleAction,
                  { color: colors[color + 'Contrast'] },
                ]}>
                {textHeaderRight}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      ) : null}
      <View style={viewStyleContent}>
        {loading ? <Spinner size="small" /> : props.children}
      </View>
      {textFooterRight || textFooterLeft ? (
        <View style={viewStyleFooter}>
          {textFooterLeft ? (
            <TouchableOpacity onPress={onPressFooterLeft}>
              <Text
                style={[
                  textStyleAction,
                  { color: colors[color + 'Contrast'] },
                ]}>
                {textFooterLeft}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {textFooterRight ? (
            <TouchableOpacity onPress={onPressFooterRight}>
              <Text
                style={[
                  textStyleAction,
                  { color: colors[color + 'Contrast'] },
                ]}>
                {textFooterRight}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      ) : null}
    </View>
  );
};

const styles = {
  viewStyleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  viewStyleHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 64,
    // paddingTop: 32,
    // padding: 12,
    zIndex: 0,
  },
  viewStyleContent: {
    flex: 1,
    // paddingHorizontal: 16,
    // paddingBottom: 12,
    // backgroundColor: Colors.onPrimary,
    flexDirection: 'column',
    zIndex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  viewStyleFooter: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 64,
    padding: 8,
    zIndex: 0,
  },
  iconStyleHeaderLeft: {
    margin: 16,
    // opacity: 0.87,
  },
  textStyleAction: {
    fontSize: 18,
    padding: 16,
    // alignSelf: 'flex-end',
  },
};

export { FullScreenForm };
