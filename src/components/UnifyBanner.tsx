import { Text, View, StyleSheet, Image, Platform } from 'react-native';


import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { Fonts } from "../theme/Fonts";
import { screenHeight, screenWidth } from '../utils/utitlity';
type ScholarBannerProps = {

    text: string,
}

export default function ScholarBanner(props: ScholarBannerProps) {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image style={bannerStyles.image} source={require('../assets/logoo.png')}/>
        </View>
    );
}
export  function ScholarMiniBanner(props: any) {
    const iconColor = Colors.primary
    return (
        <View style={bannerStyles.miniBanner}>
            <Image source={require('../assets/logoo.png')} style={{height:50,width:50}}  />
            <Text style={bannerStyles.miniHeaderText}>{props.text} </Text>
            <Image source={require('../assets/logoo.png')} style={{height:50,width:50}}  />
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
   width:screenWidth/2,
   height:screenHeight/3,
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