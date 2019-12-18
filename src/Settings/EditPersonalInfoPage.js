import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    Image,
    ImageBackground,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import { Dropdown } from 'react-native-material-dropdown'
import * as Util from '../Helper/Util'
import Toast, {DURATION} from 'react-native-easy-toast'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

class EditPersonalInfoPage extends Component {
	constructor(props) {
        super(props);

        this.confirmValue = this.confirmValue.bind(this)
        this.valueChanged = this.valueChanged.bind(this)
        this.valueSelected = this.valueSelected.bind(this)

        this.state = {
            value: this.props.initialValue
        }
    }

    valueSelected( value ) {
        this.setState({
            value
        })
    }

    confirmValue() {
        switch (this.props.type) {
            case types.GENDER_CHANGED:
                this.props.actions.genderChanged( this.state.value )
                break
            case types.EMAIL_CHANGED:
                if (this.state.value != '' && !Util.validateEmail( this.state.value )) {
                    this.refs.toast.show( 'You should input a right E-mail' );
                    return
                }
                this.props.actions.emailChanged( this.state.value )
                break
            case types.ADDRESS_CHANGED:
                this.props.actions.addressChanged( this.state.value )
                break
    
            // guardian/emergency
            case types.GUARDIANEMERGENCYPERSON_CHANGED:
                this.props.actions.guardianEmergencyPersonChanged( this.state.value )
                break
            case types.GUARDIANEMERGENCYNUMBER_CHANGED:
                this.props.actions.guardianEmergencyNumberChanged( this.state.value )
                break
            case types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED:
                this.props.actions.guardianEmergencyRelationshipChanged( this.state.value )
                break
        }

        this.props.navigator.pop({
        });
    }

    valueChanged(e) {
        this.setState( {
            value: e.nativeEvent.text,
        } )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

        const { 
            gender,
            email,
            address,

            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship,
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                        <View >
                            <Text style={ [Styles.lightGrayColor, Styles.largeFont, Styles.textAlignCenter] }>{this.props.title}</Text>
                        </View>

                        {/* space */}
                        <View style={ [Styles.superLargeSpace] } />

                        {/* Value */}
                        <View style={style.valueContainer}>
                            <TextInput 
                                style={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED || this.props.type == types.GENDER_CHANGED? Styles.hidden : Styles.visible, style.valueInput, Styles.grayBorder, Styles.lightGrayColor, Styles.middleFont, Styles.smallPadding] } 
                                underlineColorAndroid='rgba(0,0,0,0)'
                                onChange={this.valueChanged}
                                value={this.state.value}
                                keyboardType={this.props.inputeType}
                                autoCapitalize = "none"
                            />

                            <Dropdown
                                containerStyle={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED || this.props.type == types.GENDER_CHANGED? Styles.visible : Styles.hidden, style.dropDown] }
                                textColor = '#696969'
                                baseColor = '#696969'
                                onChangeText={this.valueSelected}
                                data={ this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? relationshipData : genderData }
                                label={ this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? 'Select relationship':'Select gender' }
                                value={this.state.value}
                                fontSize={ moderateScale(16) }
                                labelFontSize={ moderateScale(12) }
                            />
                        </View>

                        {/* space */}
                        <View style={ [Styles.normalPadding] } />

                        {/* Send button */}
                        <Button
                            textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                            style={[Styles.activeButton,]}
                            activeOpacity={0.5}
                            onPress={() => this.confirmValue()} >
                            CONFIRM
                        </Button>

                        <Toast ref="toast"/>
                    </View>
                </TouchableWithoutFeedback>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center'
    },
    valueContainer: {
        alignSelf: 'stretch',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1
    },
    valueInput: {
        height: moderateScale(40),
        alignSelf: 'stretch'
    },
    dropDown: {
        alignSelf: 'stretch'
    }
})

const relationshipData = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

const genderData = [
    { value: 'Male' },
    { value: 'Female' }
];

EditPersonalInfoPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EditPersonalInfoPage.propTypes = {
    gender: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,

    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string,
    guardianEmergencyNumber: PropTypes.string,
    guardianEmergencyRelationship: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
        gender: state.cima.gender,
        email: state.cima.email,
        address: state.cima.address,
    
        // guardian/emergency info
        guardianEmergencyPerson: state.cima.guardianEmergencyPerson,
        guardianEmergencyNumber: state.cima.guardianEmergencyNumber,
        guardianEmergencyRelationship: state.cima.guardianEmergencyRelationship,
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EditPersonalInfoPage);