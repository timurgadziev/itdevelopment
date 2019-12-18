// import React, { Component, PropTypes } from 'react';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import { Dropdown } from 'react-native-material-dropdown'
import { Icon } from 'react-native-elements'
import Button from 'apsl-react-native-button'
import * as Storage from '../Helper/Storage'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class EmergencyContactPage extends Component {
	constructor(props) {
        super(props);

        this.state = {
            enableNextButton: false
        }

        this.contactPersonChanged = this.contactPersonChanged.bind(this)
        this.contactNumberChanged = this.contactNumberChanged.bind(this)
        this.contactRelationshipChanged = this.contactRelationshipChanged.bind(this)
    }

    async componentDidMount() {
        contactPerson = await Storage.getEmergencyPerson()
        this.props.actions.guardianEmergencyPersonChanged( contactPerson )

        contactNumber = await Storage.getEmergencyNumber()
        this.props.actions.guardianEmergencyNumberChanged( contactNumber )

        contactRelationship = await Storage.getEmergencyRelationship()
        this.props.actions.guardianEmergencyRelationshipChanged( contactRelationship )

        this.setState({
            enableNextButton: contactPerson.length > 0 && contactNumber.length > 0 && contactRelationship.length > 0
        })
    }

    contactPersonChanged(e) {
        contactPerson = e.nativeEvent.text
        this.props.actions.guardianEmergencyPersonChanged( contactPerson )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: contactPerson.length > 0 && this.props.contactNumber.length > 0 && this.props.contactRelationship.length > 0
        } )
    }

    contactNumberChanged(e) {
        contactNumber = e.nativeEvent.text
        this.props.actions.guardianEmergencyNumberChanged( contactNumber )

        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.props.contactPerson.length > 0 && contactNumber.length > 0 && this.props.contactRelationship.length > 0
        } )
    }

    contactRelationshipChanged( relationship ) {
        contactRelationship = relationship
        this.props.actions.guardianEmergencyRelationshipChanged( contactRelationship )
        
        // check the possibility of next move.
        this.setState( {
            enableNextButton: this.props.contactPerson.length > 0 && this.props.contactNumber.length > 0 && this.props.contactRelationship.length > 0
        } )
    }

    goNextPage() {
        if (!this.state.enableNextButton) {
            return;
        }

        Storage.setEmergencyPerson(this.props.contactPerson)
        Storage.setEmergencyNumber(this.props.contactNumber)
        Storage.setEmergencyRelationship(this.props.contactRelationship)

        this.props.navigator.push({
            screen: 'Registration.SelfiePage',
        });
    }

	render() {
        const { 
            contactPerson,
            contactNumber,
            contactRelationship
        } = this.props;

		return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={ [ Styles.centerContainer, Styles.normalMargin, Styles.hideLogoByBackground] } >
                    <View style={ [style.container] } >
                        {/* space */}
                        <View style={Styles.superLargeSpace} />

                        {/* Emergency Contact Person */}
                        <TextInput 
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder='Emergency Contact Person' 
                            onChange={this.contactPersonChanged}
                            value={ contactPerson }
                        />

                        {/* Emergency Contact Number */}
                        <View style={Styles.superLargeSpace} />
                        <TextInput 
                            style={ [style.codeInput, Styles.grayBorder, Styles.smallPadding, Styles.textAlignCenter, Styles.lightGrayColor, Styles.middleFont] } 
                            underlineColorAndroid='rgba(0,0,0,0)'
                            placeholder='Emergency Contact Number'
                            onChange={this.contactNumberChanged}
                            keyboardType='phone-pad'
                            value={ contactNumber }
                        />

                        {/* Relationship */}
                        <View style={Styles.superLargeSpace} />
                        <View style={ style.dropDownComponentContainer }>
                            <Dropdown
                                textColor = '#696969'
                                onChangeText={this.contactRelationshipChanged}
                                label='Select relationship'
                                data={relationship}
                                value={contactRelationship}
                                containerStyle={style.dropdownContainer}
                                fontSize={ moderateScale(16) }
                                labelFontSize={ moderateScale(12) }
                            />
                        </View>
                    </View>

                    {/* indicator */}
                    <View style={style.indicatorContainer}>
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
                            color='#5EC3AE'
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
                </View>
            </TouchableWithoutFeedback>
		);
	}
}

const relationship = [
    { value: 'Parent' },
    { value: 'Sibling' },
    { value: 'Partner' },
    { value: 'Friend' },
];

const style = StyleSheet.create({
    codeInput: {
        height: moderateScale(40),
        alignSelf: 'stretch'
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'stretch'
    },
    dropDownComponentContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    dropdownContainer: {
        height: moderateScale(50),
    }
})

EmergencyContactPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

EmergencyContactPage.propTypes = {
    // guardian/emergency info
    actions: PropTypes.object.isRequired,
    contactPerson: PropTypes.string,
    contactNumber: PropTypes.string,
    contactRelationship: PropTypes.string
};

function mapStateToProps(state, ownProps) {
    return {
        // guardian/emergency info
        contactPerson: state.cima.guardianEmergencyPerson,
        contactNumber: state.cima.guardianEmergencyNumber,
        contactRelationship: state.cima.guardianEmergencyRelationship
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(EmergencyContactPage);