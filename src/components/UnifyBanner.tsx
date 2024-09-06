import { Text, View, StyleSheet, Image, Platform } from 'react-native';


import styles from '../styles/Styles';
import Colors from '../theme/ScholarColors';
import { Fonts } from "../theme/Fonts";
type ScholarBannerProps = {

    text: string,
}

export default function ScholarBanner(props: ScholarBannerProps) {
    return (
        <View style={{ alignItems: 'center',height:350 }}>
            <Image source={require('../assets/icons/smaller.png')}/>
        </View>
    );
}
export  function ScholarMiniBanner(props: any) {
    const iconColor = Colors.primary
    return (
        <View style={bannerStyles.miniBanner}>
            <Image source={require('../assets/icons/magic.png')} style={{height:50,width:50}}  />
            <Text style={bannerStyles.miniHeaderText}>{props.text} </Text>
            <Image source={require('../assets/icons/bass.png')} style={{height:50,width:50}}  />
        </View>
    );
}
const bannerStyles= StyleSheet.create({
    miniBanner:{
        flexDirection:'row',
        margin:2,
        marginTop:Platform.OS==='ios'?'10%':2,
        alignItems:'center',
        justifyContent:'center'
    },
    miniHeaderText:{
        fontFamily: "JustAnotherHand-Regular",
        textAlignVertical: "center",
        fontSize: 49,
        color: Colors.primary,
       marginLeft:10,
    }
})