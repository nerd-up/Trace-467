import { Dimensions, StyleSheet } from "react-native";
import Colors from "../theme/ScholarColors";
import { Fonts } from "../theme/Fonts";

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    innerContainer: {
       
    },
    iconHeaderText: {
        fontFamily: Fonts.regular,
        textAlignVertical: "center",
        fontSize: 80,
        color: Colors.primary,
        paddingLeft: 20
    },
    underLine: {
        flexGrow: 1,
        height: .7,
        backgroundColor: '#7C6354',
    },

    profilePicBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    dividerContainer: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverPhoto:{
     width:400,
     height:200,
     resizeMode:'cover',
     borderWidth:0,
     borderBottomWidth:2,
     borderBottomColor:'black'
    },
    //  profile page style
    profileImage: {
        width: 120,
        height: 120,
        padding: 10,
        backgroundColor: '#7C6354',
        borderRadius: 50,
        margin: 10,
    },
    formField: {
        width: 300,
        borderWidth: .2,
        margin: 10,
        padding: 10,
        backgroundColor:'#C4A484',
        borderRadius: 22,
    },
    headingStyle: {
        fontFamily: Fonts.regular,
        fontSize: 20,
        color:'#7C6354',
        maxWidth:160,
        fontWeight: 'bold'
    },
    linkStle: {
        fontFamily: Fonts.bold,
        fontSize: 20,
        color: '#7C6354',
        fontWeight: 'bold',
        textDecorationLine:'underline'
    },
    contentStyle: {
        fontFamily: Fonts.regular,
        fontSize: 15,
        color: 'gray'
    },
    btnText: {
        color: '#ffffff',
        fontSize: 18
    },

    friendBoxStyle: {
        flex:1,
        padding: 8,
        backgroundColor: Colors.lightBackground,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 20,
        width:150,
        margin: 2,
        overflow:'hidden',
    },

    friendBoxTextStyle: {
        color: Colors.text,
        fontSize: 16,
        fontFamily:Fonts.regular,
    },

    friendBoxContainer: {
        margin: 5,
        padding: 3,
    },
    friendBoxes: {
        flexDirection: 'row',
    }
    ,
    friendBoxButton: {
        padding: 5,
        backgroundColor: '#7C6354',//save this: #C4A484
        margin: 5,
        borderRadius: 10,
        height: 30,
        width: 100,
    },

    heading: {
        margin: 10,
        justifyContent: 'center',
        padding: 5,
    },

    friendTextStyle: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: Fonts.regular,
    },
    userNameStyle: {
        fontFamily: Fonts.regular,
        fontSize: 22,
        
    },
    // For Tab Navigator
    tabIcon: {
        width: 30,
        height: 30,
        padding: 5,
    },



    /**
     * For The Home Screen 
     */

    headBox: {
        margin: 2,
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center'
    }
    ,
    logoContainer: {
        padding: 5,
    },
    titleContainer: {
        margin: 1,
        padding: 5,
    }
    ,

    post: {
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: Colors.background,
        padding: 6,
        marginTop: 6,

    },

    postHolder: {
        backgroundColor: 'gray',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: 250,
        width: '100%',
        resizeMode: 'cover',

    },

    postAdmin: {
        padding: 1,
        marginLeft: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarSection: {
        display:'flex',
        alignItems:'center',
        justifyContent:'center'

    },
    profilePictur: {
        width: 150, height: 150, backgroundColor: 'transparent', borderRadius: 100,
        borderWidth:2,
        borderColor:Colors.lightBackground
    },
    adminSection: {
        marginLeft: 5,
        padding: 5,
    },
    postAdminName: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    postDescription: {
        padding: 2,
    },
    postDescText: {
        color: Colors.text,
        fontSize: 15,
        fontFamily: Fonts.regular,
    }
    ,
    postBottom: {
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 'auto',
        padding: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
    },

  actionBtn: {
    padding: 2,
  },
  //post page styling
  postHeaderProfile:{
    height:40,
    width:40,
    borderRadius:50
  },
  filledCircle:{
    width:15,height:15,borderColor:'black',borderWidth:1,borderRadius:50,backgroundColor:'black'
  },
  unFilledCircle:{
    width:15,height:15,borderColor:'black',borderWidth:1,borderRadius:50,
  },
  postInputStyle:{ 
    margin: 5,
    height: 200,
    textAlignVertical: 'top',
    borderWidth: 1 
  },
  imageIconContainer:{ 
    width: '10%',
    margin: 5
   },
   postButtonStyle:{ 
    backgroundColor: Colors.primary, 
    margin: 5,
    textAlign: 'center',
    padding: 5,
    borderRadius: 10 
  },
  postButtonContainer:{
    flexDirection: 'row', 
    alignContent: 'center', 
    margin: 10
  },
  selectedImageContainer:{
    margin: 10, 
    flex: 1 
  },
  selectedImageStyle:{ 
    flexWrap: 'nowrap', 
    borderRadius: 10, 
    width: Dimensions.get('screen').width - 30, 
    height: (Dimensions.get('screen').height) / 4 
  },
  cancelButtonStyle:{ position: 'absolute', zIndex: 99 }
});

export default styles;