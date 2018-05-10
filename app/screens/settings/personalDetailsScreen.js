import React, { Component } from 'react';
import { ImagePicker } from 'expo';
import {
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import Modal from 'react-native-modal';
import UserInfoService from './../../services/userInfoService';
import ResetNavigation from './../../util/resetNavigation';
import Colors from './../../config/colors';
import Header from './../../components/header';
import { Input, InputForm } from './../../components/common';

class PersonalDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Personal details',
  };

  constructor(props) {
    super(props);

    this.state = {
      routeName: this.props.navigation.state.params
        ? this.props.navigation.state.params.name
        : null,
      nationality: '',
      first_name: '',
      last_name: '',
      id_number: '',
      skype_name: '',
      mobile_number: '',
      modalVisible: false,
      languageModalVisible: false,
      first_name_color: false,
      last_name_color: false,
      id_no_color: false,
    };
  }

  async componentWillMount() {
    const value = await AsyncStorage.getItem('user');

    const user = JSON.parse(value);

    if (user.language === '' || !user.language) {
      user.language = 'en';
    }
    this.setState({
      first_name: user.first_name,
      last_name: user.last_name,
      id_number: user.id_number,
      nationality: user.nationality !== '' ? user.nationality : 'US',
      profile: user.profile,
    });
  }

  navigateToUploadImage = result => {
    this.props.navigation.navigate('UploadImage', { image: result });
  };

  openModal = async () => {
    this.setState({ modalVisible: true });
  };

  launchCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this.setState({ modalVisible: false });
    if (!result.cancelled) {
      this.navigateToUploadImage(result);
    }
  };

  launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    this.setState({ modalVisible: false });
    if (!result.cancelled) {
      this.navigateToUploadImage(result);
    }
  };

  languageSelected = lang => {
    this.setState({
      languageModalVisible: false,
      language: lang,
    });
  };

  save = async () => {
    let responseJson = await UserInfoService.updateUserDetails({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      id_number: this.state.id_number,
      nationality: this.state.nationality,
      language: this.state.language,
    });
    if (responseJson.status === 'success') {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.setItem('user', JSON.stringify(responseJson.data));
      ResetNavigation.dispatchToDrawerRoute(
        this.props.navigation,
        this.state.routeName ? 'GetVerified' : 'Settings',
      );
    } else {
      Alert.alert('Error', responseJson.message, [{ text: 'OK' }]);
    }
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          back
          title="Personal details"
          headerRightTitle="Save"
          headerRightOnPress={this.save}
        />
        <InputForm>
          <View style={styles.profile}>
            <TouchableHighlight
              style={{ width: 100 }}
              onPress={() => this.openModal()}>
              {this.state.profile ? (
                <Image
                  style={styles.photo}
                  source={{
                    uri: this.state.profile,
                    cache: 'only-if-cached',
                  }}
                  key={this.state.profile}
                />
              ) : (
                <Image
                  source={require('./../../../assets/icons/profile.png')}
                  style={styles.photo}
                />
              )}
            </TouchableHighlight>
          </View>

          <Input
            label="First name"
            placeholder=""
            autoCapitalize="none"
            value={this.state.first_name}
            onChangeText={text => this.setState({ first_name: text })}
          />

          <Input
            label="Last name"
            placeholder=""
            autoCapitalize="none"
            value={this.state.last_name}
            onChangeText={text => this.setState({ last_name: text })}
          />

          <Input
            label="ID No"
            placeholder=""
            autoCapitalize="none"
            value={this.state.id_number}
            onChangeText={text => this.setState({ id_number: text })}
          />
          <View style={[styles.pickerContainer, { paddingVertical: 20 }]}>
            <Text style={[styles.text, { flex: 4 }]}>Country</Text>
            <View style={{ flex: 5, alignItems: 'flex-end' }}>
              <CountryPicker
                onChange={value => {
                  this.setState({ nationality: value.cca2 });
                }}
                closeable
                filterable
                cca2={this.state.nationality}
                translation="eng"
                styles={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
        </InputForm>

        <Modal
          animationInTiming={500}
          animationOutTiming={500}
          backdropTransitionOutTiming={500}
          backdropTransitionInTiming={500}
          backdropColor="black"
          onBackdropPress={() => this.setState({ modalVisible: false })}
          isVisible={this.state.modalVisible}>
          <View style={styles.modal}>
            <View style={styles.bottomModal}>
              <View
                style={[
                  styles.button,
                  { borderBottomWidth: 1, borderBottomColor: Colors.black },
                ]}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                  Change Image
                </Text>
              </View>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.launchCamera()}>
                <Text style={styles.buttonText}>Use Camera</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.launchImageLibrary()}>
                <Text style={styles.buttonText}>Choose From Gallery</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={() => {
                  this.setState({ modalVisible: false });
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  input: {
    flex: 5,
    fontSize: 16,
    paddingLeft: 15,
  },
  text: {
    flex: 4,
    fontSize: 16,
    borderRightColor: Colors.lightgray,
    color: Colors.black,
  },
  submit: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.lightblue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
  },
  profile: {
    height: 140,
    flexDirection: 'column',
    backgroundColor: Colors.lightgray,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    width: '80%',
    height: 250,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageModal: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .10)',
  },
  button: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
});

export default PersonalDetailsScreen;