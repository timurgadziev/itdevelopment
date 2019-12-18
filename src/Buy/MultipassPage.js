import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
    Platform
} from 'react-native';

import Button from 'apsl-react-native-button'
import ShoppingItem from '../Widgets/ShoppingItem'
import { Dropdown } from 'react-native-material-dropdown'
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import * as Storage from '../Helper/Storage'
import * as Configuration from '../constants/configuration'
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'
import * as CIMAService from '../Helper/CIMAService'

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import Styles from '../assets/styles/styles';
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import firebase from 'react-native-firebase';

class MultipassPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passNumber: '',
            price: 0
        }

        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
        this.passNumberSelected = this.passNumberSelected.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getPassCart())
        this.props.actions.passCartChanged( item )

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.MULTIPASS_TYPE
        }

        // show progress dialog
        this.showProgress()

        console.log('client --> server: ', param)

        CIMAService.sendPostRequestAsync(Api.GET_EQUIPMENT, param, this.equipmentSuccess, this.equipmentFailed )
    }

    showProgress = () => this.setState({ isProgressVisible: true })    
    hideProgress = () => this.setState({ isProgressVisible: false })

    equipmentSuccess = (res) => {
        console.log('server --> client(equipment success): ', res.data)

        if (res.data.result == Api.ERROR) {
            Storage.setToken( '' )

            if (Platform.OS === "android") {
                this.hideProgress()
            }

            firebase.auth().signOut();
            
            Navigation.startSingleScreenApp({
                screen: {
                    screen: 'Registration.PhonenumberPage',
                },
                appStyle: {
                    orientation: 'portrait',
                },
            });
        } else if (res.data.result == Api.OK) {
            this.hideProgress()

            this.setState({
                price: res.data.detail.price
            })
        } else {
            this.hideProgress()
            this.refs.toast.show('Service Error');
        }
    }

    equipmentFailed = (err) => {
        console.log('server --> client(equipment failed): ', err)
        this.refs.toast.show('Network Error');
    }

    goCartPage() {
        this.props.navigator.push({
            screen: 'Buy.CartPage'
        });
    }

    passNumberSelected( pass ) {
        this.setState({
            passNumber: pass
        })
    }

    addToCart() {
        if ( this.state.passNumber == '' ) {
            this.refs.toast.show('Please select a pass number.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.props.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('This pass cannot be purchased together with season pass')
            return
        }

        // check if season pass was bought
        index = Util.getIndex( this.state.passNumber == '5 Passes'? 5 : 10, this.props.passCart, 'count' )
        if ( index > -1 ) { // update
            var action = {
                index,
                item: {
                    category: Configuration.CATEGORY_PASS,
                    type: Api.MULTIPASS_TYPE,
                    count: this.state.passNumber == '5 Passes'? 5 : 10,
                    productName: this.state.passNumber,
                    budget: this.state.passNumber == '5 Passes'? this.state.price * 5 + this.props.passCart[index].budget : this.state.price * 10 + this.props.passCart[index].budget,
                    billUnit: 'SGD',
                    infoKey: '',
                    infoValue: '',
                    quantity: 1 + this.props.passCart[index].quantity,
                }
            }

            Storage.setPassCart( JSON.stringify(Util.updateObjectInArray(this.props.passCart, action)) )
        } else { // insert
            var item = {
                category: Configuration.CATEGORY_PASS,
                type: Api.MULTIPASS_TYPE,
                count: this.state.passNumber == '5 Passes'? 5 : 10,
                productName: this.state.passNumber,
                budget: this.state.passNumber == '5 Passes'? this.state.price * 5 : this.state.price * 10,
                billUnit: 'SGD',
                infoKey: '',
                infoValue: '',
                quantity: 1,
            }

            Storage.setPassCart( JSON.stringify(Util.appendItem( this.props.passCart, item )) )
        }

        this.props.navigator.push({
            screen: 'Buy.CartPage'
        });
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let cartImage = require('../assets/images/cart.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>MULTI PASS</Text>

                        <TouchableOpacity key={1} onPress={() => this.goCartPage() }>
                            <Image 
                                style={style.cartImage}
                                source={cartImage} 
                            />                       
                        </TouchableOpacity> 
                    </View>

                    {/* space */}
                    <View style={ [Styles.smallSpace] } />

                    {/* budget */}
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD {this.state.price}</Text>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* Cart Item */}
                    <ScrollView style={ [style.scrollView] } >
                        <View style={style.container}>
                            {/* pass image */}
                            <Image source={backgroundImage} style={style.passImage} />

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* message */}
                            <Text style={ [Styles.darkGreenColor, Styles.smallFont, Styles.stretch, Styles.textAlignLeft] }>Product details yada yada yada brown fox yellow dog…Product details yada yada yada brown fox yellow dog…Product details yada yada yada brown fox yellow dog…</Text>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />
                            
                            <View style={ style.dropDownComponentContainer }>
                                <Dropdown
                                    textColor = '#5EC3AE'
                                    baseColor = '#5EC3AE'
                                    onChangeText={this.passNumberSelected}
                                    label='Select number of passes'
                                    data={passesData}
                                    containerStyle={style.dropdownContainer}
                                    fontSize={ moderateScale(16) }
                                    labelFontSize={ moderateScale(12) }
                                />
                            </View>
                        </View>                        
                    </ScrollView>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    <Button
                        textStyle={ [Styles.largeFont, Styles.whiteColor] }                    
                        style={[Styles.activeButton,]}
                        activeOpacity={0.5}
                        onPress={() => this.addToCart()} >
                        ADD TO CART
                    </Button>

                    <Toast ref="toast"/>
                </View>
            </ImageBackground>
		);
	}
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        alignSelf: 'stretch',
    },
    productNameContainer: {
        height: moderateScale(50),
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
    budgetText: {
        alignSelf: 'stretch'
    },
    passImage: {
        flex: 1,
        height: moderateScale(150)
    },
    dropDownComponentContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    dropdownContainer: {
        height: moderateScale(50),
    },
    cartImage: {
        width: moderateScale(50),
        height: moderateScale(50)
    }
})

const passesData = [
    { value: '5 Passes' },
    { value: '10 Passes' },
];

MultipassPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

MultipassPage.propTypes = {
    actions: PropTypes.object.isRequired,
	passCart: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        passCart: state.cima.passCart
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MultipassPage);