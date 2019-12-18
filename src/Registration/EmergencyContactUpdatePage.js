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

class EmergencyContactUpdatePage extends Component {
	constructor(props) {
        super(props);

        this.confirmValue = this.confirmValue.bind(this)
        this.valueChanged = this.valueChanged.bind(this)
        this.valueSelected = this.valueSelected.bind(this)

        this.state = {
            value: this.props.initialValue,
            enableNextButton: this.props.initialValue.length > 0
        }
    }

    valueSelected( value ) {
        this.setState({
            value,
            enableNextButton: value.length > 0
        })
    }

    confirmValue() {
        if (!this.state.enableNextButton) {
            return;
        }

        switch (this.props.type) {    
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
            enableNextButton: e.nativeEvent.text.length > 0
        } )
    }

	render() {
        const { 
            // guardia/emergency
            guardianEmergencyPerson,
            guardianEmergencyNumber,
            guardianEmergencyRelationship,
        } = this.props;

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    {/* space */}
                    <View style={ [Styles.superLargeSpace] } />

                    {/* Value */}
                    <View style={style.valueContainer}>
                        <TextInput 
                            style={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? Styles.hidden : Styles.visible, style.valueInput, Styles.grayBorder, Styles.lightGrayColor, Styles.middleFont, Styles.smallPadding] } 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            onChange={this.valueChanged}
                            value={this.state.value}
                            keyboardType={this.props.inputeType}
                            autoCapitalize = "none"
                        />

                        <Dropdown
                            containerStyle={ [this.props.type == types.GUARDIANEMERGENCYRELATIONSHIP_CHANGED? Styles.visible : Styles.hidden, style.dropdownContainer] }
                            textColor = '#696969'
                            baseColor = '#696969'
                            onChangeText={this.valueSelected}
                            data={ relationshipData }
                            label={ 'Select relationship' }
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
                        style={ this.state.enableNextButton? Styles.activeButton: Styles.inactiveButton}
                        activeOpacity={this.state.enableNextButton? 0.5:1}
                        activeOpacity={0.5}
                        onPress={() => this.confirmValue()} >
                        CONFIRM
                    </Button>

                    <Toast ref="toast"/>
                </View>
            </TouchableWithoutFeedback>
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
    dropdownContainer: {
        height: moderateScale(50),
        alignSelf: 'stretch'
    }
})

const relationshipData = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

EmergencyContactUpdatePage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EmergencyContactUpdatePage.propTypes = {
    // guardian/emergency info
    guardianEmergencyPerson: PropTypes.string,
    guardianEmergencyNumber: PropTypes.string,
    guardianEmergencyRelationship: PropTypes.string,
};

function mapStateToProps(state, ownProps) {
    return {
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

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContactUpdatePage);