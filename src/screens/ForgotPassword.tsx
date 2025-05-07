import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import ScholarBanner from '../components/UnifyBanner'
import Colors from '../theme/ScholarColors'
import SButton from '../components/SButton'
import { showError, showSucess } from '../utils/utitlity'
import auth from '@react-native-firebase/auth';
import Loading from '../components/loadings/Loading'
import Loader from '../components/loadings/Loader'

const ForgotPassword = () => {
    const [email,setEmail]=useState('');
    const [isLoading,setIsLoading]=useState(false);
        const passwordReset=async()=>{
            if(email?.length<3){
                showError('Invalid','Please enter a valid email.');
            return;
        }
        setIsLoading(true);
            auth().sendPasswordResetEmail(email)
            .then((res:any)=>{ 
                showSucess('Success','Password reset email sent.')
})
.catch(err=>{
    showError('Failed','Failed to send password reset email,try again!\n'+err?.code);
})
.finally(()=>{
    setIsLoading(false);
})
        }
  return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            <Loader loading={isLoading} />
                   <ScholarBanner text="Forgot Password" />
                  <Text style={styles.txt}>Reset Your Password</Text>
                  <Text style={styles.txt}>Enter your Email</Text>
                  <TextInput style={styles.formField} placeholder='Enter Email...' onChangeText={text => setEmail(text)}></TextInput>
                  <SButton text='Submit' action={passwordReset} ></SButton>
                  </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPassword

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor: Colors.background,

},
content:{
   justifyContent:'center',
   alignItems:'center',
   gap:10,
},
txt:{
    fontSize:18,
    fontWeight:'600',
    color:'darkgreen',
},
formField: {
    width: '90%',
    borderWidth: .2,
    margin: 10,
    padding: 10,
    backgroundColor:'#C4A484',
    borderRadius: 22,
},
})