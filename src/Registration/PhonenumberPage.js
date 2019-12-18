import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    ImageBackground,
    Image,
    Text,
    StyleSheet,
    View,
    Platform,
    DeviceEventEmitter,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import { Icon } from 'react-native-elements'
import ShadowedButton from 'react-native-shadowedbutton'
import Toast, {DURATION} from 'react-native-easy-toast'

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

// phone
import PhoneInput from 'react-native-phone-input'
import ModalPickerImage from '../ModalPickerImage'
import PhoneNumber from 'react-native-phone-input/lib/phoneNumber'
// import TextInputMask from 'react-native-text-input-mask';

import * as Storage from '../Helper/Storage'

// import { setKey, shorten, expand } from 'react-native-google-shortener'

export default class PhonenumberPage extends Component {
	constructor(props) {
        super(props);
        
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.doContinue = this.doContinue.bind(this)

        this.state = {
            pickerData: null,
            country: null,
            phoneNumber: ''
        }
    }

    clearPhonenumber = () => {
        this.refs.toast.show('version 2');
        this.setState({
            phoneNumber: ''
        })
    }

    doContinue() {
        var phoneNumber = this.state.phoneNumber

        // check phone number is inputed
        if (phoneNumber.length < 5) {
            this.refs.toast.show('Please enter a valid phone number');
            return;
        }

        this.props.navigator.push({
            screen: 'Registration.VerificationPage',
            passProps: {
				phoneNumber,
			}
        });
    }
    
    onPressFlag(){
        // this.refs.countryPicker.open()
    }
    
    selectCountry(country){
        // save the country code in order to reset the editor
        this.setState({
            country: country
        })

        this.refs.phone.selectCountry(country.iso2)
    }

	render() {
        let logoImage = require('../assets/images/BW_Logo2.png');
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, Styles.normalPadding, Styles.centerContainer] } >
                        <View>
                            <Image source={ logoImage } />
                        </View>

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.largePaddingTop, Styles.largeFont, Styles.darkGrayColor] } >Welcome to</Text>
                            <Text style={ [Styles.largeFont, Styles.darkGrayColor] } >Boulder World</Text>
                        </View>

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.normalPaddingTop, Styles.smallFont, Styles.lightGrayColor] } >Please login or sign up with your mobile number</Text>
                        </View>

                        {/* phone number */}
                        <View style={ Styles.centerInColumn } >
                            <View style={ [Styles.centerInRow, Styles.normalPaddingTop] } >
                                {/* <TextInputMask
                                    style={ [Styles.stretch, Styles.phoneNumber, Styles.middleFont] }
                                    refInput={ref => { 
                                        this.input = ref
                                    }}
                                    onChangeText={(formatted, extracted) => {
                                        console.log(formatted) // +1 (123) 456-78-90
                                        console.log(extracted) // 1234567890
                                        this.setState({
                                            phoneNumber: extracted
                                        })
                                    }}
                                    ref='phone'
                                    // value={this.state.phoneNumber}
                                    mask={"+65 [0000] [00] [0000]"}
                                    value={this.state.phoneNumber}
                                /> */}
                                <TextInput
                                    style={ [Styles.stretch, Styles.phoneNumber, Styles.middleFont] }
                                    value={this.state.phoneNumber}
                                    onChangeText={( text ) => {
                                        this.setState({
                                            phoneNumber: text
                                        })
                                    }}
                                    ref='phone'
                                    underlineColorAndroid='rgba(0,0,0,0)'
                                    keyboardType='phone-pad'
                                />

                                <Icon name="circle-with-cross"
                                    type="entypo"
                                    size={ moderateScale(30) }
                                    color="#d8d8d8"
                                    onPress={() => this.clearPhonenumber()}
                                />
                            </View>

                            <View style={ [Styles.centerInRow] } >
                                <View style={ [ Styles.stretch, Styles.underline, Styles.verySmallPaddingTop] }/>
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        {/* continue button */}
                        <View>
                            <ShadowedButton
                                style={[style.inactiveButton]}
                                fontStyle = { [Styles.smallFont, Styles.darkGrayColor] } 
                                color="#d8d8d8"
                                title="CONTINUE"
                                shadowHeight={2}
                                onPress={() => this.doContinue()}
                            />
                        </View>
                        

                        <View style={ Styles.centerInColumn } >
                            <Text style={ [Styles.largePaddingTop, Styles.smallFont, Styles.lightGrayColor, Styles.textAlignCenter] } >By continuing, you are indicating that you agree to the</Text>
                            <Text style={ [Styles.smallPaddingTop, Styles.smallFont, Styles.lightGreenColor] } >
                                Private policy
                                <Text style={ [Styles.smallFont, Styles.lightGrayColor] } > and </Text>
                                Terms
                            </Text>
                        </View>
                        
                        <Toast ref="toast"/>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    underline: {
        flex: 1
    },
    inactiveButton: {
        borderColor: '#d8d8d8',
        backgroundColor: '#d8d8d8',
        width: moderateScale(138),
        height: moderateScale(32),
        borderRadius: moderateScale(5),
    }
})

PhonenumberPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent',
    orientation: 'portrait'
};