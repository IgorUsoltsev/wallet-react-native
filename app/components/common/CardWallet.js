import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

import { Spinner } from './Spinner';
import { HeaderButton } from './HeaderButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Swipeable from 'react-native-swipeable';
import Colors from './../../config/colors';

const CardWallet = props => {
  const {
    viewStyleCardContainer,
    viewStyleTitleContainer,
    viewStyleTitle,
    textStyleTitle,
    textStyleSubtitle,
    viewStyleActionContainer,
    buttonStyleAction,
    textStyleAction,
    textStyleError,
    iconStyleTitleLeft,
    iconStyleTitleRight,
    viewStyleFooter,
    viewStyleContent,
    iconStyleFooter,
  } = styles;

  const {
    renderHeader,
    title,
    subtitle,
    colorTitleBackground,
    colorTitleText,
    iconTitleLeft,
    onPressTitle,
    itemCode,
    itemActive,
    textTitleLeft,
    onPressTitleLeft,
    iconTitleRight,
    onPressTitleRight,
    backgroundColor,
    onPressContent,
    colorIcon,
    errorText,
    iconFooter,
    onPressFooter,
    textActionOne,
    onPressActionOne,
    disableActionOne,
    textActionTwo,
    onPressActionTwo,
    disableActionTwo,
    loading,
    swipeableContent,
    colors,
  } = props;

  return (
    <View style={[viewStyleCardContainer, {backgroundColor: Colors.secondary}]}>
      {/* <Swipeable rightContent={swipeableContent}> */}
      {renderHeader ? <View>{renderHeader}</View> : null}
      {title || subtitle || iconTitleLeft || iconTitleRight ? (
        <View
          resizeMode="cover"
          style={[viewStyleTitleContainer]}>
          {textTitleLeft ? (
              <TouchableHighlight
                  onPress={onPressTitleLeft}
              >
                <Text style={{fontSize: 16, color: colorTitleText}}>{textTitleLeft}</Text>
              </TouchableHighlight>
          ) : null}
          {iconTitleLeft ? (
            <HeaderButton
              name={iconTitleLeft}
              onPress={onPressTitleLeft}
              color={colorTitle ? colorTitle : colors.primary}
            />
          ) : null}
          <TouchableWithoutFeedback onPress={onPressTitle}>
            <View style={viewStyleTitle}>
              <Text
                style={[
                  textStyleTitle,
                  {
                    fontSize: 16,
                    color: colorTitleText,
                  },
                ]}>
                {title}
                {subtitle ? (
                    <Text style={[textStyleSubtitle, { color: colorTitleText }]}>
                      ({subtitle})
                    </Text>
                ) : null}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {iconTitleRight ? (
            <View style={iconStyleTitleRight}>
              <HeaderButton
                icon={iconTitleRight}
                onPress={onPressTitleRight}
                color={colorTitle ? colorTitle : colors.primaryContrast}
              />
            </View>
          ) : null}
        </View>
      ) : null}
      <TouchableWithoutFeedback onPress={onPressContent}>
        <View style={[viewStyleContent, { backgroundColor }]}>
          {props.children}
          {errorText ? <Text style={textStyleError}>{errorText}</Text> : null}
        </View>
      </TouchableWithoutFeedback>
      {textActionOne || textActionTwo || iconFooter ? (
        <View style={[viewStyleFooter, { backgroundColor }]}>
          {loading ? (
            <Spinner size="small" />
          ) : (
            <View style={viewStyleActionContainer}>
              {iconFooter ? (
                <Icon
                  style={iconStyleFooter}
                  name={iconFooter}
                  size={22}
                  onPress={onPressFooter}
                  color={colorIcon ? colorIcon : colorTitleText}
                />
              ) : null}
              {textActionTwo ? (
                <TouchableHighlight
                  disabled={disableActionTwo}
                  underlayColor="lightgrey"
                  style={buttonStyleAction}
                  onPress={onPressActionTwo}>
                  <Text style={[textStyleAction,{color:colorTitleText}]}>{textActionTwo}</Text>
                </TouchableHighlight>
              ) : null}
              {textActionOne ? (
                <TouchableHighlight
                  disabled={disableActionOne}
                  underlayColor="lightgrey"
                  style={buttonStyleAction}
                  onPress={onPressActionOne}>
                  <Text style={textStyleAction,{color:colorTitleText}}>{textActionOne}</Text>
                </TouchableHighlight>
              ) : null}
            </View>
          )}
        </View>
      ) : null}
      {/* </Swipeable> */}
    </View>
  );
  {
    /* <View style={styles.containerStyle}>{props.children}</View>; */
  }
};

CardWallet.defaultProps = {
  title: '',
  subtitle: '',
  renderHeader: null,
  animation: 'fadeInDownBig',
  disabled: false,
  onPress: () => {},
  icon: '',
  size: '',
  type: 'contained',
  colorTitleBackground: Colors.secondary,
  colorTitleText: Colors.primary,
  backgroundColor: Colors.secondary,
};

CardWallet.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  renderHeader: PropTypes.object,
  animation: PropTypes.string,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  icon: PropTypes.string,
  size: PropTypes.string,
  type: PropTypes.string,
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
};

const styles = {
  viewStyleCardContainer: {
    borderRadius: 4,
    overflow: "hidden",
    margin: 16,
    marginBottom: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  viewStyleTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    // height: 72,
    alignItems: 'center',
  },
  viewStyleTitle: {
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
    paddingHorizontal: 5,
    width: 0,
  },
  textStyleTitle: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  textStyleSubtitle: {
    opacity: 0.7,
  },
  viewStyleContent: {
    // paddingTop: 8,
    // paddingHorizontal: 8,
  },
  iconStyleTitleLeft: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  iconStyleTitleRight: {
    right: 0,
    height: 64,
    width: 64,
    position: 'absolute',
  },
  iconStyleFooter: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    padding: 8,
  },
  textStyleError: {
    paddingTop: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.error,
  },
  viewStyleFooter: {
    flexDirection: 'row',
    height: 52,
    width: '100%',
    alignItems: 'center',
  },
  viewStyleActionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 8,
  },
  textStyleAction: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonStyleAction: {
    padding: 8,
    marginLeft: 8,
    // marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
};

// const mapStateToProps = ({ user }) => {
//   const { company_config } = user;
//   return { company_config };
// };

// connect(mapStateToProps, {})(props => Card(props));

export { CardWallet };
