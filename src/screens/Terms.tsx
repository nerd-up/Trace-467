import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../theme/ScholarColors';
import { Fonts } from '../theme/Fonts';
import { useNavigation } from '@react-navigation/native';

const Terms = () => {
    const navigation:any=useNavigation();
  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
        <Text style={{ fontFamily: Fonts.bold, fontSize: 30, color: 'black', marginBottom: 20 }}>Terms & Conditions</Text>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.body}>
          By creating an account on Trace 467, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, you may not use our services.
        </Text>

        <Text style={styles.heading}>2. Purpose of Trace 467</Text>
        <Text style={styles.body}>
          Trace 467 is a social media platform intended for bringing the outdoor community together. Hate speech, harassment, or any form of harmful behavior is strictly prohibited.
        </Text>

        <Text style={styles.heading}>3. User Responsibilities</Text>
        <Text style={styles.body}>
          - You are responsible for maintaining the confidentiality of your account credentials.
          {'\n'}- You agree not to use Trace 467 for illegal activities or activities that go against the values of peace and harmony.
          {'\n'}- Any content shared must be your own, and you must have the rights to distribute it. Content that incites violence, hatred, or discrimination is not allowed and will result in immediate account suspension.
        </Text>

        <Text style={styles.heading}>4. Privacy</Text>
        <Text style={styles.body}>
          Trace 467 respects your privacy. Personal information you provide during signup and usage will be handled in accordance with our Privacy Policy. We do not sell your data to third parties.
        </Text>

        <Text style={styles.heading}>5. Content Ownership</Text>
        <Text style={styles.body}>
          You retain ownership of the content you post on Trace 467. By posting, you grant us a non-exclusive, worldwide license to use, modify, display, and distribute your content for the purpose of operating the platform.
        </Text>

        <Text style={styles.heading}>6. Prohibited Content</Text>
        <Text style={styles.body}>
          The following content is strictly prohibited:
          {'\n'}- Hate speech, violent or threatening behavior
          {'\n'}- Pornography or sexually explicit content
          {'\n'}- Discriminatory or defamatory statements
          {'\n'}- Misleading information or harmful political content
        </Text>

        <Text style={styles.heading}>7. Account Termination</Text>
        <Text style={styles.body}>
          Trace 467 reserves the right to terminate accounts that violate these terms without notice. Users who promote violence, hatred, or misinformation will be permanently banned.
        </Text>

        <Text style={styles.heading}>8. Dispute Resolution</Text>
        <Text style={styles.body}>
          Any disputes arising from the use of Trace 467 will be resolved amicably through mediation. If mediation fails, disputes will be handled under the jurisdiction of the courts in your country of residence.
        </Text>

        <Text style={styles.heading}>9. Modifications to Terms</Text>
        <Text style={styles.body}>
          Trace 467 reserves the right to update or modify these Terms and Conditions at any time. Users will be notified of significant changes, and continued use of the platform after such changes will constitute acceptance of the new terms.
        </Text>

        <Text style={styles.heading}>10. Contact Us</Text>
        <Text style={styles.body}>
          If you have any questions about these Terms and Conditions, please contact us at david@trace467.com
        </Text>
        <View>
            <TouchableOpacity onPress={()=>navigation.goBack()}  style={{alignContent:'center',padding:10,backgroundColor:Colors.primary,width:'100%',alignItems:'center',borderRadius:20,marginBottom:20}}>
                <Text style={{fontSize:20,color:'white'}}>Back</Text>
            </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  heading: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  body: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
  },
};

export default Terms;