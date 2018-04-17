import React, {Component} from 'react'
import {View, KeyboardAvoidingView, StyleSheet, AsyncStorage, TouchableHighlight, Text, Alert, TextInput} from 'react-native'
import SettingsService from './../../services/settingsService'
import Auth from './../../util/auth'
import AuthService from './../../services/authService'
import Colors from './../../config/colors'
import Header from './../../components/header'
import colors from './../../config/colors';

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Verify mobile number',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            otp_msg: "Enter OTP",
            isEdit: false,
            otp: '',
            i1: '',
            i2: '',
            i3: '',
            i4: '',
            i5: '',
            loginInfo: params.loginInfo,
            signupInfo: params.signupInfo,
            resend: false,
        }
    }
    componentDidMount() {
        //Keyboard.dismiss()
        setTimeout(()=>{
            this.setState({
                resend:true
            })
        },30000)
        
        this.refs.i1.focus()
    }

    reload = () => {
        Auth.login(this.props.navigation, this.state.loginInfo)
    }
    resend = async () => {
        if(!this.state.resend) {
            return;
        }
        //console.log(this.state.signupInfo.mobile_number)
        setTimeout(()=>{
            this.setState({
                resend:true
            })
        },30000)
        let responseJson = await SettingsService.resendMobileVerification({
            mobile: this.state.signupInfo.mobile_number,
            company: this.state.signupInfo.company
        })

        this.setState({
            resend: false,
            i1: '',
            i2: '',
            i3: '',
            i4: '',
            i5: '',
        })
        this.refs.i1.focus()

        if (responseJson.status === "success") {
            Alert.alert(
                "SMS Resend",
                "A verification SMS has been resent, please check your mobile.",
                [{text: 'OK', onPress: () => this.setState({loading: false})}],
            )
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }

    }
    verify = async () => {
        await AsyncStorage.setItem("token", this.state.loginInfo.token)
        var data = {
            otp: this.state.i1+this.state.i2+this.state.i3+this.state.i4+this.state.i5
        }
        let responseJson = await SettingsService.verifyMobile(data)

        if (responseJson.status === "success") {
            this.reload()
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    /*editMobile = () => {
     this.setState({})
     return (
     <TextInput
     title="Change mobile no"
     value={this.state.mobile_number}
     autoCapitalize="none"
     keyboardType="numeric"
     underlineColorAndroid="white"
     onChangeText={(mobile) => this.setState({mobile_number: mobile})}
     />
     )
     }*/

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    title="Verify mobile number"
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <View style={{flex: 2, paddingHorizontal:40}}>
                        <View style={{flex:2, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={{fontSize:18, textAlign:'center', color: Colors.black}}>
                                Enter 5 digit pin sent to your mobile number {this.state.signupInfo.mobile_number}
                                {/* Enter 5 digit pin sent to your mobile number */}
                            </Text>
                        </View>
                        <View style={{flex:1, flexDirection: 'row'}}>
                            <View style={{flex:1, borderBottomColor:'black', paddingHorizontal:10}}>
                                <TextInput style={styles.input}
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                    value={this.state.i1}
                                    onFocus={this.setState({
                                        i1:''
                                    })}
                                    onChangeText={(input) => {
                                        this.setState({i1: input.substr(input.length - 1)})
                                        this.refs.i2.focus()
                                    }}
                                    returnKeyType="next"
                                    ref='i1'
                                />
                            </View>
                            <View style={{flex:1, borderBottomColor:'black', paddingHorizontal:10}}>
                                <TextInput style={styles.input}
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                    value={this.state.i2}
                                    onFocus={this.setState({
                                        i2:''
                                    })}
                                    onChangeText={(input) => {
                                        this.setState({i2: input.substr(input.length - 1)})
                                        this.refs.i3.focus()
                                    }}
                                    returnKeyType="next"
                                    ref='i2'
                                />
                            </View>
                            <View style={{flex:1, borderBottomColor:'black', paddingHorizontal:10}}>
                                <TextInput style={styles.input}
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                    value={this.state.i3}
                                    onFocus={this.setState({
                                        i3:''
                                    })}
                                    onChangeText={(input) => {
                                        this.setState({i3: input.substr(input.length - 1)})
                                        this.refs.i4.focus()
                                    }}
                                    returnKeyType="next"
                                    ref='i3'
                                />
                            </View>
                            <View style={{flex:1, borderBottomColor:'black', paddingHorizontal:10}}>
                                <TextInput style={styles.input}
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                    value={this.state.i4}
                                    onFocus={this.setState({
                                        i4:''
                                    })}
                                    onChangeText={(input) => {
                                        this.setState({i4: input.substr(input.length - 1)})
                                        this.refs.i5.focus()
                                    }}
                                    returnKeyType="next"
                                    ref='i4'
                                />
                            </View>
                            <View style={{flex:1, borderBottomColor:'black', paddingHorizontal:10}}>
                                <TextInput style={styles.input}
                                    underlineColorAndroid="white"
                                    keyboardType='numeric'
                                    value={this.state.i5}
                                    onFocus={this.setState({
                                        i5:''
                                    })}
                                    onChangeText={(input) => {
                                        this.setState({i5: input.substr(input.length - 1)})
                                        this.verify()
                                    }}
                                    returnKeyType="next"
                                    ref='i5'
                                />
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                    </View>
                    <View style={{flex: 2, paddingHorizontal:50}}>
                        <View style={{flex:2, alignItems: 'center', justifyContent: 'center',}}>
                            <Text style={{fontSize:15, textAlign:'center', color: 'gray'}}>
                                Did not receive any SMS? Make sure your number is correct or request a resend in 30 seconds.
                            </Text>
                        </View>
                        <View style={{flex:1, flexDirection:'row', alignItems: 'center', justifyContent: 'center',}}>
                            <TouchableHighlight
                                style={[styles.submit]}
                                onPress={() => this.reload()}>
                                <Text style={{color: 'gray', fontSize: 15}}>
                                    Skip
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={[styles.submit, {borderColor: this.state.resend? 'gray': Colors.lightgray}]}
                                onPress={() => this.resend()}>
                                <Text style={{color: this.state.resend? 'gray': Colors.lightgray, fontSize: 15}}>
                                    Resend
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={{flex: 1}}>
                    </View>
                </KeyboardAvoidingView>
                {/* <TouchableHighlight
                    style={[styles.resend]}
                    onPress={this.verify}>
                    <Text style={{color: 'white', fontSize: 20}}>
                        Verify
                    </Text>
                </TouchableHighlight> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingVertical: 20,
    },
    submit: {
        flex: 1,
        marginHorizontal:10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 15,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    resend: {
        marginHorizontal: 25,
        marginBottom: 10,
        backgroundColor: Colors.lightblue,
        borderRadius: 25,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons: {
        height: 65,
        flexDirection: 'row',
        alignSelf: 'stretch',
        paddingHorizontal: 25,
    },
    input: {
        height:30,
        borderColor: 'white',
        borderBottomColor:'black',
        borderWidth: 1,
        textAlign:'center'
    }
})
