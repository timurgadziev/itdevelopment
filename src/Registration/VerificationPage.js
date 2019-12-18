// import React, { Component } from 'react';
// import PropTypes from 'prop-types'
// import {
//     StyleSheet,
//     Text,
//     View,
//     TouchableOpacity,
//     TextInput,
//     Platform,
//     Keyboard,
//     TouchableWithoutFeedback
// } from 'react-native';

// import Styles from '../assets/styles/styles'
// import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

// import { Icon } from 'react-native-elements'
// import Button from 'apsl-react-native-button'
// import * as Storage from '../Helper/Storage'
// import { Navigation } from 'react-native-navigation'

// import dateFormat from 'dateformat'

// import * as CIMAService from '../Helper/CIMAService'
// import * as Api from '../constants/api'
// import Modal from 'react-native-modal'
// import ProgressBar from '../Widgets/ProgressBar'
// import * as Util from '../Helper/Util'

// import Toast, {DURATION} from 'react-native-easy-toast'

// export default class VerificationPage extends Component {
// 	constructor(props) {
//         super(props);

//         this.state = {
//             isProgressVisible: false,
//             enableNextButton: false
// 		};

//         this.resendPin = this.resendPin.bind(this)
        
//         this.code1Changed = this.code1Changed.bind(this);
//         this.code2Changed = this.code2Changed.bind(this);
//         this.code3Changed = this.code3Changed.bind(this);
//         this.code4Changed = this.code4Changed.bind(this);
//         this.code5Changed = this.code5Changed.bind(this);
//         this.code6Changed = this.code6Changed.bind(this);

//         this.code1Inputed = false
//         this.code2Inputed = false
//         this.code3Inputed = false
//         this.code4Inputed = false
//         this.code5Inputed = false
//         this.code6Inputed = false

//         this.signinSuccess = this.signinSuccess.bind(this)
//         this.signinFailed = this.signinFailed.bind(this)
//     }

//     showProgress = () => this.setState({ isProgressVisible: true })
    
//     hideProgress = () => this.setState({ isProgressVisible: false })

//     resendPin() {

//     }

//     async componentDidMount() {
//         this.userId = await Storage.getUserID()
//         this.lastPhoneNumber = await Storage.getPhonenumber()
//     }

//     // call back for code changed
//     code1Changed(e) {
//         this.code1Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code2TextInput.focus()
//         }

//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     code2Changed(e) {
//         this.code2Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code3TextInput.focus()
//         }
        
//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     code3Changed(e) {
//         this.code3Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code4TextInput.focus()
//         }
        
//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     code4Changed(e) {
//         this.code4Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code5TextInput.focus()
//         }
        
//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     code5Changed(e) {
//         this.code5Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code6TextInput.focus()
//         }
        
//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     code6Changed(e) {
//         this.code6Inputed = e.nativeEvent.text.length > 0? true : false

//         if (e.nativeEvent.text.length > 0) {
//             this.refs.code6TextInput.blur()
//         }
        
//         // check the possibility of next move.
//         this.setState( {
//             enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
//         } )
//     }
    
//     async signinSuccess(res) {
//         console.log('server --> client(signin success): ', res.data)
        
//         // check if user is registered.
//         if (res.data.result !== Api.OK) {
//             this.hideProgress()

//             if ( this.lastPhoneNumber != this.props.phoneNumber ) {
//                 Util.resetStorage()
//                 await Storage.setPhonenumber(this.props.phoneNumber)
//             } else {
//                 Util.resetAFewStorage()
//             }

//             this.props.navigator.push({
//                 screen: 'Registration.NamePage',
//             });
//         } else {
//             await Storage.setUserID(res.data.users.user_id)
//             await Storage.setSignupDate(res.data.users.signup_stamp.toString())
//             await Storage.setAvatarUri(Api.SERVER_URL + res.data.users.picture_avatar)
//             await Storage.setPhonenumber(this.props.phoneNumber)
//             await Storage.setEmail(res.data.users.user_email == undefined? '':res.data.users.user_email)
//             await Storage.setToken(res.data.users.user_token)
//             await Storage.setAddress(res.data.users.user_address == undefined? '':res.data.users.user_address)
//             await Storage.setFirstName(res.data.users.firstName)
//             await Storage.setLastName(res.data.users.familyName)
//             await Storage.setDOB(res.data.users.birthDate)
//             await Storage.setNRIC(res.data.users.nric_passNumber)
//             await Storage.setGender(res.data.users.gender == undefined? '':res.data.users.gender)
//             await Storage.setPDFUrl(Api.SERVER_URL + res.data.users.pdf_url)

//             // guardian/emergency info
//             await Storage.setEmergencyPerson( res.data.users.guardian_name === ''? res.data.users.emergency_name : res.data.users.guardian_name  )
//             await Storage.setEmergencyNumber( res.data.users.guardian_phoneNumber === ''? res.data.users.emergency_phoneNumber : res.data.users.guardian_phoneNumber  )
//             await Storage.setEmergencyRelationship( res.data.users.guardian_relationship === ''? res.data.users.emergency_relationship : res.data.users.guardian_relationship )
            
//             // qualification
//             await Storage.setQualification( JSON.stringify(res.data.users.qualification == undefined? '[]':res.data.users.qualification) )

//             // pass
//             await Storage.setPasses( JSON.stringify(res.data.pass) )

//             if (Platform.OS === "android") {
//                 this.hideProgress()
//             }

//             Navigation.startSingleScreenApp({
// 				screen: {
// 					screen: 'Main.HomePage',
//                 },
//                 appStyle: {
//                     orientation: 'portrait',
//                 },
//                 passProps: {
//                     skipUserInfoUpdate: true,
//                 }
// 			});
//         }
//     }

//     signinFailed(err) {
//         console.log('server --> client(signin failed): ', err)
        
//         // hide modal
//         this.hideProgress()

//         this.refs.toast.show('Network error');
//     }

//     async goNextPage() {
//         if (!this.state.enableNextButton) {
//             return;
//         }

//         Storage.setPhonenumber(this.props.phoneNumber)

//         var param = {
//             user_id: await Storage.getUserID(),
//             user_phoneNumber: this.props.phoneNumber,
//             timestamp: new Date().getTime()
//         }

//         // show progress dialog
//         this.showProgress()

//         console.log('client --> server(signin): ', param)

//         CIMAService.sendPostRequestAsync(Api.SIGNIN, param, this.signinSuccess, this.signinFailed )
//     }

// 	render() {
// 		return (
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//                 <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
//                     <View style={ [ style.container] } >
//                         {/* space */}
//                         <View style={Styles.superLargeSpace} />

//                         {/* pin code */}
//                         <View style={ [style.pinContainer] } >
//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code1Changed}
//                                 maxLength={1}
//                                 autoFocus={true}
//                                 selectTextOnFocus={true}
//                             />

//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code2Changed}
//                                 maxLength={1}
//                                 selectTextOnFocus={true}
//                                 ref="code2TextInput"
//                             />

//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code3Changed}
//                                 maxLength={1}
//                                 selectTextOnFocus={true}
//                                 ref="code3TextInput"
//                             />

//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code4Changed}
//                                 maxLength={1}
//                                 selectTextOnFocus={true}
//                                 ref="code4TextInput"
//                             />

//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code5Changed}
//                                 maxLength={1}
//                                 selectTextOnFocus={true}
//                                 ref="code5TextInput"
//                             />

//                             <TextInput 
//                                 style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
//                                 underlineColorAndroid='rgba(0,0,0,0)'
//                                 keyboardType='phone-pad'
//                                 onChange={this.code6Changed}
//                                 maxLength={1}
//                                 selectTextOnFocus={true}
//                                 ref="code6TextInput"
//                             />
//                         </View>

//                         {/* space */}
//                         <View style={Styles.normalSpace} />

//                         {/* Resend */}
//                         <View >
//                             <TouchableOpacity onPress={() => this.resendPin() }>
//                                 <Text style={ [Styles.lightGreenColor, Styles.middleFont] }>Resend PIN</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>

//                     {/* indicator */}
//                     <View style={style.indicatorContainer}>
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#5EC3AE'
//                         />
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#d8d8d8'
//                         />
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#d8d8d8'
//                         />
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#d8d8d8'
//                         />
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#d8d8d8'
//                         />
//                         <Icon name="dot-single"
//                             type="entypo"
//                             size={moderateScale(50)}
//                             color='#d8d8d8'
//                         />
//                     </View>

//                     {/* next button */}
//                     <Button
//                         textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
//                         style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
//                         activeOpacity={this.state.enableNextButton? 0.5:1}
//                         onPress={() => this.goNextPage()} >
//                         NEXT
//                     </Button>                

//                     <Toast ref="toast"/>

//                     {/* progress dialog */}
//                     <Modal isVisible={this.state.isProgressVisible}>
//                         <View style={ [Styles.centerInColumn, ] }>
//                             <ProgressBar />
//                         </View>
//                     </Modal>
                    
//                 </View>
//             </TouchableWithoutFeedback>
// 		);
// 	}
// }

// const style = StyleSheet.create({
//     codeInput: {
//         width: moderateScale(40),
//         height: moderateScale(40),
//     },
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'flex-start',
//         alignSelf: 'stretch',
//     },
//     indicatorContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     pinContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'red',
//         alignSelf: 'stretch',
//         height: moderateScale(35),
//     }
// })

// VerificationPage.navigatorStyle = {
//     navBarHidden: true,
//     navBarTransparent: true,
//     navBarTranslucent: true,
//     drawUnderNavBar: true,
//     navBarButtonColor: 'transparent'
// };










import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import * as Storage from '../Helper/Storage'
import { Navigation } from 'react-native-navigation'

import dateFormat from 'dateformat'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'
import * as Util from '../Helper/Util'

import Toast, {DURATION} from 'react-native-easy-toast'

import firebase from 'react-native-firebase'

export default class VerificationPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            isProgressVisible: false,
            enableNextButton: false,
            confirmResult: null,
		};

        this.resendPin = this.resendPin.bind(this)
        
        this.code1Changed = this.code1Changed.bind(this);
        this.code2Changed = this.code2Changed.bind(this);
        this.code3Changed = this.code3Changed.bind(this);
        this.code4Changed = this.code4Changed.bind(this);
        this.code5Changed = this.code5Changed.bind(this);
        this.code6Changed = this.code6Changed.bind(this);

        this.code1Inputed = false
        this.code2Inputed = false
        this.code3Inputed = false
        this.code4Inputed = false
        this.code5Inputed = false
        this.code6Inputed = false

        this.signinSuccess = this.signinSuccess.bind(this)
        this.signinFailed = this.signinFailed.bind(this)
    }

    showProgress = () => this.setState({ isProgressVisible: true })
    
    hideProgress = () => this.setState({ isProgressVisible: false })

    resendPin() {        
        this.firebaseSignIn()
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.lastPhoneNumber = await Storage.getPhonenumber()

        this.firebaseSignIn()
    }

    // call back for code changed
    code1Changed(e) {
        this.code1Inputed = e.nativeEvent.text.length > 0? true : false
        this.code1 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code2TextInput.focus()
        }

        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    code2Changed(e) {
        this.code2Inputed = e.nativeEvent.text.length > 0? true : false
        this.code2 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code3TextInput.focus()
        }
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    code3Changed(e) {
        this.code3Inputed = e.nativeEvent.text.length > 0? true : false
        this.code3 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code4TextInput.focus()
        }
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    code4Changed(e) {
        this.code4Inputed = e.nativeEvent.text.length > 0? true : false
        this.code4 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code5TextInput.focus()
        }
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    code5Changed(e) {
        this.code5Inputed = e.nativeEvent.text.length > 0? true : false
        this.code5 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code6TextInput.focus()
        }
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    code6Changed(e) {
        this.code6Inputed = e.nativeEvent.text.length > 0? true : false
        this.code6 = e.nativeEvent.text

        if (e.nativeEvent.text.length > 0) {
            this.refs.code6TextInput.blur()
        }
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.code1Inputed && this.code2Inputed && this.code3Inputed && this.code4Inputed && this.code5Inputed && this.code6Inputed
        } )
    }
    
    async signinSuccess(res) {
        console.log('server --> client(signin success): ', res.data)
        
        // check if user is registered.
        if (res.data.result !== Api.OK) {
            this.hideProgress()

            if ( this.lastPhoneNumber != this.props.phoneNumber ) {
                Util.resetStorage()
                await Storage.setPhonenumber(this.props.phoneNumber)
            } else {
                Util.resetAFewStorage()
            }

            this.props.navigator.push({
                screen: 'Registration.NamePage',
            });
        } else {
            await Storage.setUserID(res.data.users.user_id)
            await Storage.setSignupDate(res.data.users.signup_stamp.toString())
            await Storage.setAvatarUri(Api.SERVER_URL + res.data.users.picture_avatar)
            await Storage.setPhonenumber(this.props.phoneNumber)
            await Storage.setEmail(res.data.users.user_email == undefined? '':res.data.users.user_email)
            await Storage.setToken(res.data.users.user_token)
            await Storage.setAddress(res.data.users.user_address == undefined? '':res.data.users.user_address)
            await Storage.setFirstName(res.data.users.firstName)
            await Storage.setLastName(res.data.users.familyName)
            await Storage.setDOB(res.data.users.birthDate)
            await Storage.setNRIC(res.data.users.nric_passNumber)
            await Storage.setGender(res.data.users.gender == undefined? '':res.data.users.gender)
            await Storage.setPDFUrl(Api.SERVER_URL + res.data.users.pdf_url)

            // guardian/emergency info
            await Storage.setEmergencyPerson( res.data.users.guardian_name === ''? res.data.users.emergency_name : res.data.users.guardian_name  )
            await Storage.setEmergencyNumber( res.data.users.guardian_phoneNumber === ''? res.data.users.emergency_phoneNumber : res.data.users.guardian_phoneNumber  )
            await Storage.setEmergencyRelationship( res.data.users.guardian_relationship === ''? res.data.users.emergency_relationship : res.data.users.guardian_relationship )
            
            // qualification
            await Storage.setQualification( JSON.stringify(res.data.users.qualification == undefined? '':res.data.users.qualification) )

            // pass
            await Storage.setPasses( JSON.stringify(res.data.pass) )

            if (Platform.OS === "android") {
                this.hideProgress()
            }

            Navigation.startSingleScreenApp({
				screen: {
					screen: 'Main.HomePage',
                },
                appStyle: {
                    orientation: 'portrait',
                },
                passProps: {
                    skipUserInfoUpdate: true,
                }
			});
        }
    }

    signinFailed(err) {
        console.log('server --> client(signin failed): ', err)
        
        // hide modal
        this.hideProgress()

        this.refs.toast.show('Network error');
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        if ( !this.state.confirmResult ) {
            this.refs.toast.show('Please resend a verification code.')
            return
        }

        this.confirmCode()
    }

    firebaseSignIn = () => {
        this.showProgress()

        console.log( 'Sending code ...' );
    
        firebase.auth().signInWithPhoneNumber(this.props.phoneNumber)
        .then(confirmResult => {
            this.hideProgress()

            console.log('code sent', confirmResult)
            this.refs.toast.show('Code sent');

            this.setState({ confirmResult })
        })
        .catch(error => {
            this.hideProgress()

            console.log('Sign In With Phone Number Error', error)
            this.refs.toast.show('Verification Error. Try again by resending.');
        });
    };

    confirmCode = () => {
        const { confirmResult } = this.state;
        var codeInput = this.code1.toString() + this.code2.toString() + this.code3.toString() + this.code4.toString() + this.code5.toString() + this.code6.toString()
        
        if (confirmResult && codeInput.length) {
            this.showProgress()

            confirmResult.confirm(codeInput)
            .then((user) => {
                console.log('Code Confirmed!', user)
                this.refs.toast.show('Code confimed!');

                Storage.setPhonenumber(this.props.phoneNumber)

                var param = {
                    user_id: this.userId,
                    user_phoneNumber: this.props.phoneNumber,
                    timestamp: new Date().getTime()
                }

                console.log('client --> server(signin): ', param)

                CIMAService.sendPostRequestAsync(Api.SIGNIN, param, this.signinSuccess, this.signinFailed )
            })
            .catch(error => {
                this.hideProgress()

                this.refs.code1TextInput.clear()
                this.refs.code2TextInput.clear()
                this.refs.code3TextInput.clear()
                this.refs.code4TextInput.clear()
                this.refs.code5TextInput.clear()
                this.refs.code6TextInput.clear()
                this.refs.code1TextInput.focus()

                console.log('Code Confirm Error: ', error)
                this.refs.toast.show('Code Confirm Error');
            });
        }
    };

	render() {
		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                    <View style={ [ style.container] } >
                        {/* space */}
                        <View style={Styles.superLargeSpace} />

                        {/* pin code */}
                        <View style={ [style.pinContainer] } >
                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code1Changed}
                                maxLength={1}
                                autoFocus={true}
                                selectTextOnFocus={true}
                                ref="code1TextInput"
                            />

                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code2Changed}
                                maxLength={1}
                                selectTextOnFocus={true}
                                ref="code2TextInput"
                            />

                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code3Changed}
                                maxLength={1}
                                selectTextOnFocus={true}
                                ref="code3TextInput"
                            />

                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code4Changed}
                                maxLength={1}
                                selectTextOnFocus={true}
                                ref="code4TextInput"
                            />

                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code5Changed}
                                maxLength={1}
                                selectTextOnFocus={true}
                                ref="code5TextInput"
                            />

                            <TextInput 
                                style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                keyboardType='phone-pad'
                                onChange={this.code6Changed}
                                maxLength={1}
                                selectTextOnFocus={true}
                                ref="code6TextInput"
                            />
                        </View>

                        {/* space */}
                        <View style={Styles.normalSpace} />

                        {/* Resend */}
                        <View >
                            <TouchableOpacity onPress={() => this.resendPin() }>
                            <Text style={ [Styles.lightGreenColor, Styles.middleFont] }>Resend PIN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* indicator */}
                    <View style={style.indicatorContainer}>
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#5EC3AE'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                        <Icon name="dot-single"
                            type="entypo"
                            size={moderateScale(50)}
                            color='#d8d8d8'
                        />
                    </View>

                    {/* next button */}
                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
                        onPress={() => this.goNextPage()} >
                        NEXT
                    </Button>                

                    <Toast ref="toast"/>

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>
                    
                </View>
            </TouchableWithoutFeedback>
		);
	}
}

const style = StyleSheet.create({
    codeInput: {
        width: moderateScale(40),
        height: moderateScale(40),
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        alignSelf: 'stretch',
        height: moderateScale(35),
    }
})

VerificationPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};