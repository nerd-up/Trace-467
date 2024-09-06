import React, { useState, useCallback, useEffect } from 'react';
import { Bubble, GiftedChat, QuickReplies, User } from 'react-native-gifted-chat';
import { SafeAreaView, StyleSheet, Platform, KeyboardAvoidingView, Image, Text, TouchableOpacity, View } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
// import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../theme/ScholarColors';
import auth from '@react-native-firebase/auth';
import { useNavigation, useRoute } from '@react-navigation/native';
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
const ChatRoom = () => {
  const router: any = useRoute();
  const navigation: any = useNavigation();
  const [messages, setMessages]: any = useState([])
  const userProfile: any = router.params?.friend;
  console.log("first:", userProfile);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('ChatRooms')
      .doc(userProfile.chatRoomId) // replace with your chat room ID
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const messagesFirestore: any = querySnapshot.docs.map(doc => {
          const firebaseData = doc.data();
          const data: any = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          data.createdAt = eval(data.createdAt).toDate();
          return data;
        });
        console.log("messagesFirestore", messagesFirestore);
        setMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, []);
  const onSend = useCallback((messages: IMessage[] = []) => {
    const newMessages = messages.map(msg => ({
      ...msg,
      _id: msg._id || uuidv4(),  // Generate a unique ID if not provided
    }));
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, newMessages),
    );
    const { _id, createdAt, text, user } = messages[0];
    firestore()
      .collection('ChatRooms')
      .doc(userProfile.chatRoomId) 
      .collection('messages')
      .add({
        _id,
        createdAt,
        text,
        user,
      });
  }, []);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ flexDirection: 'row',alignItems:'center' }}>
          <TouchableOpacity onPressIn={()=>navigation.goBack()} style={{marginRight:10}}
            onPress={() => navigation.goBack()}>
            <Image source={require('../assets/icons/back.png')} style={{
              height: 20, width
                : 20,
              tintColor: 'black',

            }} />
          </TouchableOpacity>
          <Image source={{ uri: userProfile.profilePic }} style={style.avatar} />
        </View>
      ),
      headerTitle: () => <Text style={style.username}>{userProfile.usrName}</Text>,
      headerRight: () => (
        <TouchableOpacity >
          <Image source={require('../assets/icons/dots.png')} style={{height:30,width:30}} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userProfile,messages]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: auth().currentUser?.uid,
          }}
          renderAvatarOnTop={true}
          scrollToBottom={true}
          renderBubble={renderBubble}
          renderAvatar={() => <Image source={{ uri: userProfile.profilePic }} style={style.chatAvatar} />
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const renderBubble = (props: any) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: Colors.lightBackground, // Customize received message color
        },
        right: {
          backgroundColor: Colors.primary, // Customize sent message color
        },
      }}
      textStyle={{
        left: {
          color: '#000000', // Customize text color for received messages
        },
        right: {
          color: '#ffffff', // Customize text color for sent messages
        },
      }}
    />
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
const style = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatAvatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChatRoom;
