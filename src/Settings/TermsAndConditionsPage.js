import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Image,
    ImageBackground,
    ScrollView,
    Platform
} from 'react-native';

import Styles from '../assets/styles/styles'
import { scale, moderateScale, verticalScale} from '../Helper/Scaling'

import Button from 'apsl-react-native-button'
import { Navigation } from 'react-native-navigation'

export default class TermsAndConditionsPage extends Component {
	constructor(props) {
        super(props);
    }

	render() {
        let backgroundImage = require('../assets/images/background.png');

		return (
            <ImageBackground source={backgroundImage} style={Styles.backgroundImage}>
                <View style={ [Styles.innerContainer, style.container, Styles.smallPadding] } >
                    <View >
                        <Text style={ [Styles.lightGrayColor, Styles.normalPaddingTop, Styles.largeFont, Styles.textAlignCenter, Styles.middleFont] }>TERMS & CONDITIONS</Text>
                    </View>

                    {/* space */}
                    <View style={ [Styles.normalSpace] } />

                    {/* PDF view */}
                    <View style={style.contentContainer}>
                        <ScrollView style={{alignSelf: 'stretch'}}>
                            <Text style={ [Styles.lightGrayColor, Styles.smallFont,] }>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam et nunc ante. Phasellus a libero et sapien ullamcorper aliquet. Duis sit amet felis faucibus, elementum quam ut, ullamcorper velit. Integer augue nulla, molestie a elit nec, blandit consectetur nibh. Praesent nec imperdiet ex. Vivamus mollis mi nec pharetra vulputate. Donec sit amet justo vulputate tellus iaculis feugiat at in felis. Aenean vitae odio ac leo ornare mattis. Cras nibh leo, consectetur ut facilisis et, bibendum quis lorem.

Nam rhoncus viverra tortor, vel dignissim nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed faucibus libero urna, in sagittis lacus iaculis eget. Morbi accumsan ultrices nunc, quis tincidunt urna viverra nec. Donec eu pulvinar felis. Suspendisse potenti. Aliquam tempor ultrices lobortis. Pellentesque pharetra, ante ut semper lacinia, dolor quam commodo nulla, ut iaculis augue enim vitae ex. Duis malesuada consectetur odio vel interdum. Nulla eu iaculis urna.

Proin lacinia, urna vitae porttitor posuere, risus enim pharetra urna, at porttitor nunc neque vitae enim. Suspendisse sed faucibus mauris. Vestibulum id pretium dui. Phasellus fringilla urna at urna feugiat varius. Sed lobortis malesuada nisi, eget pulvinar tortor efficitur non. Pellentesque aliquet dictum augue, sit amet lacinia sem egestas sit amet. Proin quis laoreet libero. Quisque suscipit ligula pretium ex venenatis, a pellentesque velit sollicitudin. Morbi lacus lorem, vestibulum non dictum non, ultrices ac risus. Donec lacus dui, pellentesque ut commodo in, fermentum eu quam. Nunc suscipit lobortis velit in fringilla.

Aliquam maximus tortor neque, sit amet aliquet leo ultricies vel. Nulla enim purus, bibendum id maximus id, facilisis sed nulla. Cras ornare nulla ac quam laoreet, at congue dui egestas. Etiam sed diam a dolor mollis molestie. Quisque sit amet diam at libero porta rutrum in eu tortor. Donec et nibh quis nisl sodales dapibus. Nullam et consectetur lacus, eget tincidunt purus.

Phasellus posuere finibus lorem ac feugiat. Phasellus eu quam ut odio placerat gravida non sed nunc. Duis faucibus semper nisi, bibendum pulvinar ipsum dapibus at. Praesent massa erat, tempor in dignissim vitae, dictum nec purus. Phasellus nec finibus justo. Phasellus maximus lectus in justo convallis ullamcorper. Etiam rhoncus eros nec nisl finibus, in rutrum eros cursus. Etiam finibus, justo quis fringilla tempor, massa dolor lacinia leo, et viverra ante metus non mauris. Mauris vitae mauris non enim tincidunt tincidunt. Phasellus vel magna neque. Praesent magna purus, malesuada vitae justo ac, sagittis sagittis nisi. Fusce tempor augue at diam dignissim pharetra. Vestibulum eros magna, rutrum eget finibus in, pulvinar nec erat. Fusce efficitur dolor risus. Aliquam porta rutrum nunc a sagittis.
                            </Text>
                        </ScrollView>
                    </View>
                </View>
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
    contentContainer: {
        alignSelf: 'stretch', 
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'       
    }
})

TermsAndConditionsPage.navigatorStyle = {
    navBarHidden: true,
    navBarTransparent: true,
    navBarTranslucent: true,
    drawUnderNavBar: true,
    navBarButtonColor: 'transparent'
};