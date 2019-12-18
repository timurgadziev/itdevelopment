import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Platform,
    ImageStore
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import SignatureCapture from 'react-native-signature-capture';
import { Navigation } from 'react-native-navigation';
import * as Storage from '../Helper/Storage'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar';
import * as Util from '../Helper/Util'
import Toast, {DURATION} from 'react-native-easy-toast'

import dateFormat from 'dateformat'

import * as CIMAService from '../Helper/CIMAService'
import * as Api from '../constants/api'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import RNFS from 'react-native-fs'

class WaiverPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec nunc ut arcu porta fringilla. Etiam tincidunt enim eu nibh facilisis, id eleifend metus porta. Nam ornare mattis quam id egestas. Sed malesuada, orci vitae sollicitudin bibendum, ipsum nisl faucibus eros, vitae eleifend tellus lectus vel eros. Vestibulum finibus ultrices tincidunt. Quisque vitae diam non eros vehicula imperdiet vel a turpis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce ultricies, metus et posuere tristique, velit lacus vehicula nulla, ut suscipit justo elit sit amet metus. Quisque imperdiet nibh lacus, sit amet dictum ex molestie eget. Phasellus pulvinar sit amet mi aliquet scelerisque. Maecenas semper nec justo a finibus. Suspendisse imperdiet venenatis metus. Sed consectetur nisi egestas velit semper elementum. Aenean vel urna a dolor tempor accumsan. Phasellus hendrerit, dolor id sodales pulvinar, arcu mi ornare nibh, id pharetra elit elit a sapien. In vitae imperdiet tortor. Quisque gravida metus ac tincidunt interdum. Nam vel magna mi. Vestibulum sodales mi orci, id semper tortor sagittis nec. Nulla facilisi. Aliquam tempus blandit velit non molestie. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent lacinia est in faucibus tincidunt. Maecenas neque nunc, posuere non urna eu, lobortis dapibus nisl. Nam cursus urna et augue euismod ornare. Duis tincidunt ultrices porta. Nullam tristique lorem vel neque mollis, rutrum tempus purus imperdiet. Suspendisse placerat sed mi dapibus luctus. Integer eu consequat turpis, vel posuere ex. Nullam pellentesque eget ex vitae gravida. Aliquam laoreet pulvinar consequat. Morbi non ullamcorper nulla. Duis vel tortor tristique, commodo augue id, fermentum dui. Cras vitae interdum nunc. Curabitur luctus odio quis sem convallis fermentum. Ut varius ante dolor, vitae mollis nisl hendrerit vitae. Duis ultricies a diam a imperdiet. Fusce vitae aliquet ligula. Pellentesque cursus cursus justo, at placerat nisi tempor vel. Phasellus vel nibh ullamcorper, lobortis orci tincidunt, malesuada libero. Duis laoreet diam ultricies sapien sodales consectetur. Praesent sem tortor, convallis et dolor vel, dictum egestas ex. Integer auctor vel sapien vitae auctor. Etiam vestibulum pellentesque nisi in pretium. Etiam eget consectetur velit. In ut arcu id metus consectetur sagittis. Morbi volutpat, mi blandit egestas luctus, sem nisi egestas arcu, eu posuere lorem risus at turpis. Sed ut nibh in nisi ullamcorper condimentum. Fusce semper eu lectus at vehicula. Vestibulum dictum accumsan varius. Curabitur sodales lorem quis nisi iaculis pharetra. In hac habitasse platea dictumst. Aliquam aliquam ante ut ante varius tristique. Integer commodo nunc neque, a dignissim dolor accumsan ac. Nulla purus tortor, euismod eu lectus vestibulum, mattis ultricies ante. Morbi neque leo, maximus a accumsan sit amet, scelerisque non augue. Fusce ac sollicitudin enim. Nullam tincidunt erat lectus. Nam consequat tellus auctor mauris finibus, nec vehicula nulla vehicula. Nullam eleifend auctor diam in laoreet. Proin condimentum sapien velit. Nam posuere neque et mauris egestas, nec porta nisl pellentesque.",
            signed: false,
            isProgressVisible: false,
        }

        this.clearSign = this.clearSign.bind(this)
        this.doAgree = this.doAgree.bind(this)
        this.onSaveEvent = this.onSaveEvent.bind(this)
        this.onDragEvent = this.onDragEvent.bind(this)
        this.saveSign = this.saveSign.bind(this)
        this.doSignup = this.doSignup.bind(this)
        this.signupSuccess = this.signupSuccess.bind(this)
        this.signupFailed = this.signupFailed.bind(this)
    }

    showProgress = () => this.setState({ isProgressVisible: true })
    
    hideProgress = () => this.setState({ isProgressVisible: false })

    async componentDidMount() {
        this.avatarUri = await Storage.getAvatarUri()

        this.props.actions.firstNameChanged( await Storage.getFirstName() )
        this.props.actions.lastNameChanged( await Storage.getLastName() )

        this.phoneNumber = await Storage.getPhonenumber()
        this.dob = await Storage.getDOB()
        this.nric = await Storage.getNRIC()
        this.emergencyGuardianPerson = await Storage.getEmergencyPerson()
        this.emergencyGuardianContact = await Storage.getEmergencyNumber()
        this.emergencyGuardianRelationship = await Storage.getEmergencyRelationship()
    }

    clearSign() {
        this.refs.esign.resetImage();

        this.setState({
            signed: false
        })
    }

    doAgree() {
        if(!this.state.signed) {
            return
        }

        // show progress dialog
        this.showProgress()

        this.saveSign()
    }

    saveSign() {
        this.refs.esign.saveImage();
    }

    async signupSuccess(res) {
        console.log('server --> client(signin success): ', res.data)

        // check if user is registered.
        if (res.data.result === Api.OK) {
            await Storage.setAvatarUri(Api.SERVER_URL + res.data.users.picture_avatar)
            await Storage.setUserID(res.data.users.user_id)
            await Storage.setToken(res.data.users.user_token)
            await Storage.setPDFUrl(Api.SERVER_URL + res.data.users.pdf_url)
            await Storage.setSignupDate(new Date().getTime().toString())

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
        } else {
            this.hideProgress()
            this.refs.toast.show('Error occured in service')
        }
    }

    signupFailed(err) {
        console.log('server --> client(signup failed): ', err)
        
        // hide modal
        this.hideProgress()

        this.refs.toast.show('Network error');
    }

    doSignup() {
        var param = {
            user_phoneNumber: this.props.phoneNumber,
            firstName: this.props.firstName,
            familyName: this.props.lastName,
            birthDate: this.dob,
            nric_passNumber: this.nric,
            picture_avatar: this.avatarBase64,
            picture_sign: this.signBase64,
            signup_date: dateFormat(new Date(), "dd mmm yyyy"),
            activity_message: this.state.message,
            promo: false,
            timestamp: new Date().getTime()
        }
        
        if ( Util.isLessThan18( this.dob ) ) {
            param = {
                ...param,
                guardian_name: this.emergencyGuardianPerson,
                guardian_phoneNumber: this.emergencyGuardianContact,
                guardian_relationship: this.emergencyGuardianRelationship,
            }
        } else {
            param = {
                ...param,
                emergency_name: this.emergencyGuardianPerson,
                emergency_phoneNumber: this.emergencyGuardianContact,
                emergency_relationship: this.emergencyGuardianRelationship,
            }
        }

        console.log('client --> server(signup): ', param)

        CIMAService.sendPostRequestAsync(Api.SIGNUP, param, this.signupSuccess, this.signupFailed)
    }

    onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name

        // base64 for signature image
        this.signBase64 = result.encoded

        // base 64 for avatar image
        if (Platform.OS === "ios" ) { // ios
            RNFS.readFile( this.avatarUri, 'base64' )
            .then( base64 => {
                this.avatarBase64 = base64

                this.doSignup()
            })
            .catch( error => {
                console.log(error)

                // hide modal
                this.hideProgress()

                this.setState({
                    signed: false
                })

                this.refs.toast.show('Fetching avatar failed');
            })
        } else { // android
            ImageStore.getBase64ForTag(
                this.avatarUri,
                (base64) => {
                    this.avatarBase64 = base64

                    this.doSignup()
                },
                (error) => {
                    console.log(error)

                    // hide modal
                    this.hideProgress()

                    this.setState({
                        signed: false
                    })

                    this.refs.toast.show('Fetching avatar failed');
                }
            )
        } // if android
    }

    onDragEvent() {
        this.setState({
            signed: true
        })
    }

	render() {
        const { 
            firstName,
            lastName
        } = this.props;

		return (
			<View style={ [Styles.normalMargin, style.container, Styles.hideLogoByBackground] } >
                <View style={ [style.container,] }>
                    {/* Scroll View */}
                    <Text style={ [Styles.lightGreenColor, Styles.largeFont, Styles.textAlignCenter, Styles.smallPaddingTop]}>ACTIVITY WAIVER</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    <ScrollView style={ [Styles.smallPadding] } >
                        {/* Terms & Conditions */}
                        <View>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] } >
                                {this.state.message}
                            </Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />

                        {/* E-Signature */}
                        <View style={ [style.esignContainer,] }>
                            <SignatureCapture
                                style={ [style.esignPad]}
                                ref='esign'
                                showBorder={false}
                                onSaveEvent={this.onSaveEvent}
                                onDragEvent={this.onDragEvent}
                                saveImageFileInExtStorage={false}
                                showNativeButtons={false}
                                showTitleLabel={false}
                            />
                        </View>

                        {/* resign button */}
                        <View style={ [style.resignContainer, Styles.smallPaddingTop]}>
                            <Button
                                textStyle={ [Styles.smallFont, Styles.darkGrayColor] }                    
                                style={[style.resignButton]}
                                activeOpacity={0.5}
                                onPress={() => this.clearSign()}>
                                RE-SIGN
                            </Button>
                        </View>

                        {/* Name, Date */}
                        <View style={ [Styles.centerInColumn, Styles.smallPaddingTop] } >
                            <View style={ [Styles.centerInRow] } >
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch2X] }>NAME:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{firstName} {lastName}</Text>
                            </View>

                            <View style={ [Styles.centerInRow, Styles.smallPaddingTop] } >
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch2X] }>DATE:</Text>
                                <Text style={ [Styles.lightGrayColor, Styles.middleFont, Styles.stretch3X] }>{ dateFormat(new Date(), "dd mmm yyyy") }</Text>
                            </View>
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalSpace] } />
                        
                    </ScrollView>
                    
                </View>

                {/* Confirm button */}
                <Button
                    textStyle={ [Styles.middleFont, Styles.whiteColor] }                    
                    style={ this.state.signed? Styles.activeButton: Styles.inactiveButton}
                    activeOpacity={this.state.signed? 0.5:1}
                    onPress={() => this.doAgree()} >
                    I AGREE
                </Button>

                <Toast ref="toast"/>

                {/* progress dialog */}
                <Modal isVisible={this.state.isProgressVisible}>
                    <View style={ [Styles.centerInColumn, ] }>
                        <ProgressBar />
                    </View>
                </Modal>

            </View>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
    },
    esignContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch', 
        padding: moderateScale(1),
        backgroundColor: '#d8d8d8'
    },
    resignContainer: {
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    esignPad: {
        flex: moderateScale(1),
        height: moderateScale(200),
    },
    resignButton: {
        borderColor: '#d8d8d8',
        backgroundColor: '#d8d8d8',
        width: moderateScale(100),
        height: moderateScale(32),
        borderRadius: moderateScale(5),
    },
})

WaiverPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

WaiverPage.propTypes = {
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        firstName: state.cima.firstName,
        lastName: state.cima.lastName
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(WaiverPage);