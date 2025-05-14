import { Text, View, StyleSheet, Image, Platform, ImageStyle } from 'react-native';


import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { Fonts } from "../theme/Fonts";
import { screenHeight, screenWidth } from '../utils/utitlity';
type ScholarBannerProps = {
    style?:ImageStyle;
    text: string,
}
import FastImage from "@d11/react-native-fast-image"

export default function ScholarBanner(props: ScholarBannerProps) {
    return (
        <View style={{ alignItems: 'center',width:'100%' }}>
            <FastImage style={[bannerStyles.image,props.style]} source={require('../assets/logoo.png')}/>
        </View>
    );
}
export  function ScholarMiniBanner(props: any) {
    const iconColor = Colors.primary
    return (
        <View style={bannerStyles.miniBanner}>
            <FastImage source={require('../assets/logoo.png')} style={{height:50,width:50}}  />
            <Text style={bannerStyles.miniHeaderText}>{props.text} </Text>
            <FastImage source={require('../assets/logoo.png')} style={{height:50,width:50}}  />
        </View>
    );
}
const bannerStyles= StyleSheet.create({
    miniBanner:{
        flexDirection:'row',
        margin:2,
        marginTop:Platform.OS==='ios'?'2%':2,
        alignItems:'center',
        justifyContent:'center'
    },
    image:{
        marginTop:'5%',
   width:screenWidth*0.6,
   height:screenHeight/3,
//   width:100,
//   height:100,
   resizeMode:'contain',

    },
    miniHeaderText:{
        fontFamily: "JustAnotherHand-Regular",
        textAlignVertical: "center",
        fontSize: 49,
        color: Colors.primary,
       marginLeft:10,
    }
})