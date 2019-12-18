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
import { Icon } from 'react-native-elements';
import ShoeItem from '../Widgets/ShoeItem'
import Toast, {DURATION} from 'react-native-easy-toast'
import Modal from 'react-native-modal'
import ProgressBar from '../Widgets/ProgressBar'

import Styles from '../assets/styles/styles';

import * as cimaActions from '../actions/cima.action';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as types from '../constants/actionTypes';

import * as Storage from '../Helper/Storage'

import * as Configuration from '../constants/configuration';
import * as Util from '../Helper/Util'
import * as Api from '../constants/api'

import * as CIMAService from '../Helper/CIMAService'

class SockRentalPage extends Component {
	constructor(props) {
        super(props);
        
        this.state = {
            sockSize: '',
            isProgressVisible: false
        }

        this.basePrice = 0

        this.sockSizeSelected = this.sockSizeSelected.bind(this)
        this.goCartPage = this.goCartPage.bind(this)
        this.addToCart = this.addToCart.bind(this)
    }

    async componentDidMount() {
        this.userId = await Storage.getUserID()
        this.userToken = await Storage.getToken()

        var item = JSON.parse(await Storage.getSockCart())
        this.props.actions.sockCartChanged( item )

        this.basePrice = JSON.parse(await Storage.getSockPrice())
        this.basePrice = 50

        this.passCart = JSON.parse(await Storage.getPassCart())

        var param = {
            user_id: this.userId,
            user_token: this.userToken,
            type: Api.SOCK_TYPE
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

            var equipment = []
            res.data.detail.map((item, i) => {
                if ( item.quantity < 1 ) {
                    return
                }
                equipment = Util.appendItem( equipment, { value: item.size }, )
            })

            this.props.actions.equipmentChanged( equipment )
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
        if ( this.props.sockCart != null && this.props.sockCart.length > 0) {
            Storage.setSockCart( JSON.stringify(this.props.sockCart) )
        }

        this.setState({
            sockSize: ''
        })

        this.props.navigator.push({
            screen: 'Buy.CartPage'
        });
    }

    sockSizeSelected = ( size ) => {
        console.log(size)
        if (size == null || size == '') {
            return
        }

        lastIndex = Util.getIndex( this.state.sockSize, this.props.sockCart, 'infoValue' )

        if (this.state.sockSize == size && lastIndex > -1) {
            return
        }
        
        var updatedCart = [...this.props.sockCart]

        if ( lastIndex > -1 && this.props.sockCart[lastIndex].quantity < 2 ) {
            var action = {
                index: lastIndex
            }

            updatedCart = Util.removeItem(this.props.sockCart, action)
        } else if ( lastIndex > -1 && this.props.sockCart[lastIndex].quantity > 1 ) {
            var action = {
                index: lastIndex,                
                item: {
                    category: Configuration.CATEGORY_SOCKS,
                    type: Api.SOCK_TYPE,
                    productName: 'Sock Rental',
                    budget: this.props.sockCart[lastIndex].budget - this.basePrice,
                    billUnit: 'SGD',
                    infoKey: 'Size',
                    infoValue: this.state.sockSize,
                    quantity: this.props.sockCart[lastIndex].quantity - 1
                }
            }

            updatedCart = Util.updateObjectInArray(this.props.sockCart, action)
        }

        var newCart = []

        newIndex = Util.getIndex( size, updatedCart, 'infoValue' )
        console.log('updatedCart=', updatedCart)
        console.log('newIndex = ', newIndex)

        if ( newIndex > -1 ) { // there's same size in cart
            var action = {
                index: newIndex,                
                item: {
                    category: Configuration.CATEGORY_SOCKS,
                    type: Api.SOCK_TYPE,
                    productName: 'Sock Rental',
                    budget: updatedCart[newIndex].budget + this.basePrice,
                    billUnit: 'SGD',
                    infoKey: 'Size',
                    infoValue: size,
                    quantity: updatedCart[newIndex].quantity + 1
                }
            }

            newCart = Util.updateObjectInArray(updatedCart, action)
        } else { // there's no any same size in cart
            var item = {
                category: Configuration.CATEGORY_SOCKS,
                type: Api.SOCK_TYPE,
                productName: 'Sock Rental',
                budget: this.basePrice,
                billUnit: 'SGD',
                infoKey: 'Size',
                infoValue: size,
                quantity: 1
            }
            
            newCart = Util.appendItem( updatedCart, item )
        }

        this.setState({
            sockSize: size
        })

        this.props.actions.sockCartChanged( newCart )
    }

    addToCart() {
        if ( this.props.sockCart == null || this.props.sockCart.length < 1) {
            this.refs.toast.show('Please choose at lease one socks.')
            return    
        }

        if ( Util.getIndex( Api.SEASONPASS_TYPE, this.passCart, 'type' ) > -1 ) {
            this.refs.toast.show('It cannot be purchased together with season pass')
            return
        }

        Storage.setSockCart( JSON.stringify(this.props.sockCart) )

        this.setState({
            sockSize: ''
        })

        this.props.navigator.push({
            screen: 'Buy.CartPage'
        });
    }

    removeItem = (i) => {
        var action = {
            index: i
        }

        updatedCart = Util.removeItem(this.props.sockCart, action)
        this.props.actions.sockCartChanged( updatedCart )
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');
        let cartImage = require('../assets/images/cart.png');

        const { 
            sockCart,
            equipment
        } = this.props;

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.middlePadding] } >
                    {/* title */}
                    <View style={ [ style.titleContainer,] } >
                        <Text style={ [Styles.darkGreenColor, Styles.largeFont, Styles.stretch, Styles.textAlignCenter] }>SOCK RENTAL</Text>

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
                    <Text style={ [Styles.redColor, style.budgetText, Styles.middleFont, Styles.textAlignLeft] }>SGD 0.00</Text>

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
                            
                            <View style={ style.dropDownContainer }>
                                <Dropdown
                                    textColor = '#5EC3AE'
                                    baseColor = '#5EC3AE'
                                    onChangeText={this.sockSizeSelected}
                                    label='Select sock size'
                                    data={equipment}
                                    value={this.state.sockSize}
                                />
                            </View>

                            {/* space */}
                            <View style={ [Styles.smallSpace] } />

                            {/* Quantity table */}
                            <View style={[style.container, sockCart.length > 0? Styles.visible : Styles.hidden]}>
                                {/* header */}
                                <View style={Styles.centerInRow}>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch3X, Styles.textAlignLeft] }>Chosen</Text>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch2X, Styles.textAlignCenter] }>Qty</Text>
                                    <Text style={ [Styles.lightGrayColor, Styles.smallFont, Styles.stretch, ] }></Text>
                                </View>

                                {sockCart.map((item, i) => 
                                    <ShoeItem 
                                        key={i}
                                        index={i}
                                        size={item.infoValue}
                                        quantity={item.quantity}
                                        removeItem ={ this.removeItem }
                                    />
                                )}

                                {/* space */}
                                <View style={ [Styles.smallSpace] } />
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

                    {/* progress dialog */}
                    <Modal isVisible={this.state.isProgressVisible}>
                        <View style={ [Styles.centerInColumn, ] }>
                            <ProgressBar />
                        </View>
                    </Modal>

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
        height: 50,
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
        height: 150
    },
    dropDownContainer: {
        flex: 1,
        alignSelf: 'stretch'
    }
})

const sockData = [
    { value: 'US 6.0' },
    { value: 'US 7.0' },
    { value: 'US 8.0' },
    { value: 'US 9.0' },
];

SockRentalPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};

SockRentalPage.propTypes = {
    actions: PropTypes.object.isRequired,
    sockCart: PropTypes.array,
    equipment: PropTypes.array
};

function mapStateToProps(state, ownProps) {
    return {
        sockCart: state.cima.sockCart,
        equipment: state.cima.equipment
    };
}
  
function mapDispatchToProps(dispatch) {
    return {
		actions: bindActionCreators(cimaActions, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(SockRentalPage);