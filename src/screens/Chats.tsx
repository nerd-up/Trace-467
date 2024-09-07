import React, { useEffect, useState } from 'react'
import { View, TextInput, ScrollView, StyleSheet, Text, TouchableOpacity, Image } from 'react-native'
// import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../theme/ScholarColors'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { QuickReplies, User } from 'react-native-gifted-chat';
interface IMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}
const Chats = () => {
  const navigation: any = useNavigation();
  const [search, setSearch] = useState('');
  const [friends, setFriends]: any = useState([]);

  const [popUpVisibility, setPopUpVisibility] = useState(false);
  const fetchAllFriends = async () => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
   
      return;
    }
    try {
      const friendSnapshot = await firestore()
        .collection("Users")
        .doc(userId)
        .collection("Friends")
        .get();
    
      const frnds = friendSnapshot.docs.map(doc =>
       
        doc.data()
      );
     
      if (frnds.length > 0) {
        const friendRequestsPromises = frnds.map(async (frnd: any) => {
          const senderDoc = await firestore().collection("Users").doc(frnd.friend).get();
          return {...senderDoc.data(),chatRoomId:frnd.chatRoomId};
        });
        const requests = await Promise.all(friendRequestsPromises);
        
        setFriends(requests);
      }
    } catch (error) {
    //   console.log("An error occurred", error);
    }
  }
  const moveNext = (friend: any) => {
    navigation.navigate('ChatRoom', { friend: friend });
  }
  useEffect(() => {
    fetchAllFriends();
  }, [])
  return (
    <View style={{flex:1,backgroundColor:Colors.background}}>
      <View style={stylings.searchBar}>
        <TextInput style={stylings.searchBarInput} value={search} onChangeText={(text) => setSearch(text)} placeholder='Search for Friends'>
        </TextInput>
      </View>
      <ScrollView>
        <View style={stylings.classmatesList}>
          {
            friends.map((friend: any, index: any) => {
              return (
                friend.usrName.toLowerCase().includes(search.toLowerCase()) ?
                  <View style={stylings.classmate} key={index}>
                    <TouchableOpacity onPress={() => moveNext(friend)}>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={stylings.classmateIcon}>
                          {
                            friend.profilePic !== "" ?
                              <Image source={{ uri: friend.profilePic }} style={{ height: 50, width: 50, borderRadius: 50 }}></Image>
                              :
                              <Image source={require('../assets/icons/user.png')} style={{ height: 50, width: 50, borderRadius: 50 }}></Image>
                          }
                        </View>
                        <View style={stylings.classmateTexts}>
                          <Text style={stylings.classmateName}>
                            {friend.usrName}
                          </Text>
                          <Text style={stylings.classmateSchool}>
                            {friend.bio}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity>
                        {/* <Icon name='ellipsis-vertical-outline' size={25} /> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                  :
                  null
              );
            })
          }
        </View>
      </ScrollView>
    </View>
  );

}
export default Chats;
const stylings = StyleSheet.create({
  searchBar: {
    margin: 5,
    padding: 5,
    justifyContent: 'center',
  },
  searchBarInput: {
    marginLeft: 8,
    marginRight: 8,
    padding: 5,
    backgroundColor: Colors.lightBackground,
    fontSize: 15,
    borderRadius: 10,
  }
  ,
  classmatesList: {
    margin: 5,
    padding: 5,
  },
  classmate: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    margin: 4,
    backgroundColor: Colors.lightBackground,
    borderRadius: 5
  },
  classmateName: {
    color: Colors.primary,
    fontWeight: 'bold'
  },
  classmateIcon: {
    borderRadius: 50,
  },
  classmateSchool: {
    color: Colors.text,

  },
  classmateTexts: {
    marginLeft: 9,
    padding: 2,
    justifyContent:'center'
  },
  
})
