import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import {
  fetchRewards,
  claimReward,
  viewReward,
  hideReward,
} from './../../redux/actions';
// import { Container, Content, Tab, Tabs } from 'native-base';
import { getRewards } from './../../redux/reducers/RewardsReducer';

import Header from './../../components/header';
// import Wallet from './../../components/wallet';
import { Output, PopUpGeneral } from '../../components/common';
import CardList from './../../components/CardList';

class RewardsScreen extends Component {
  static navigationOptions = {
    title: 'Rewards',
  };

  state = {
    showModal: false,
    wallet: null,
  };

  componentDidMount() {
    this.props.fetchRewards();
    // console.log(this.props.rewards.data);
  }

  renderContent(item) {
    return (
      <View style={styles.viewStyleContainer}>
        <Output label="" value={item.description} />
        <Output
          label=""
          value={
            item.currency +
            ' ' +
            item.reward_total * (item.reward_percentage / 100)
          }
        />
      </View>
    );
  }

  renderDetail(item) {
    return (
      <View style={styles.viewStyleContainer}>
        <Output label="" value={item.description} />
        <Output
          label=""
          value={
            item.currency +
            ' ' +
            item.reward_total * (item.reward_percentage / 100)
          }
        />
        <Output label="Start Date" value={item.start_date} />
        <Output label="End Date" value={item.end_date} />
      </View>
    );
  }

  render() {
    const {
      rewards,
      company_config,
      fetchRewards,
      viewReward,
      hideReward,
      claimReward,
    } = this.props;
    console.log(rewards);
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          colors={company_config.colors}
          drawer
          title="Rewards"
        />
        {/* <Container>
          <Tabs
            tabBarUnderlineStyle={{
              backgroundColor: company_config.colors.focus,
            }}>
            <Tab
              heading="Rewards"
              activeTextStyle={{ color: company_config.colors.focus }}> */}
        <CardList
          colors={company_config.colors}
          type="rewards"
          navigation={this.props.navigation}
          data={rewards.data}
          tempItem={rewards.tempItem}
          loadingData={rewards.loading}
          identifier="identifier"
          onRefresh={fetchRewards}
          renderContent={this.renderContent}
          showReward={rewards.detail}
          renderDetail={this.renderDetail}
          title={item => (item ? item.name : '')}
          // subtitle={item =>
          //   item ? standardizeString(item.account_name) : ''
          // }
          onPressTitle={item => viewReward(item)}
          onPressContent={item => viewReward(item)}
          emptyListMessage="No rewards available"
          titleStyle="secondary"
          keyExtractor={item => item.identifier}
          textActionOne="CLAIM"
          onPressActionOne={item => claimReward(item)}
          onPressActionTwo={() => hideReward()}
          loadingDetail={rewards.loadingDetail}
        />
        {/* </Tab>
            <Tab
              heading="Perks"
              activeTextStyle={{ color: company_config.colors.focus }}>
              <Output label="Perks" />
            </Tab>
          </Tabs>
        </Container> */}
      </View>
    );
  }
}

const styles = {
  viewStyleContainer: {
    paddingLeft: 8,
  },
  viewStyleDetailCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    // borderRadius: 2,
    // borderColor: '#ffffff',
    // borderWidth: 1,
    // shadowColor: 'rgba(0, 0, 0, 0.6)',
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    // elevation: 2,
    // shadowOffset: {
    //   height: 1,
    //   width: 2,
    // },
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
};

const mapStateToProps = store => {
  const { company_config } = store.auth;
  return {
    company_config,
    rewards: getRewards(store),
  };
};

export default connect(mapStateToProps, {
  fetchRewards,
  claimReward,
  viewReward,
  hideReward,
})(RewardsScreen);
