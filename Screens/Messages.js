import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, Auth } from '../Firebase';
import { globalStyle } from './styles/styles';
import LoadingScreen from './LoadingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Conversation from './conversation';
import { useNavigation } from '@react-navigation/native';
import Dialog from 'react-native-dialog';

const MessagesPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState('');

  const handleAddConversation = async () => {
    setIsDialogVisible(false);
    if(email.toLowerCase() == Auth.currentUser.email.toLowerCase()){
        alert("Oh I'm so lonely, Oh I wish I find A lover that can hold me.")
        return;
    }
    try {
        setIsLoading(true);
        const now = new Date();
    
        const docRef = await addDoc(collection(db, 'Conversations'), {
          message: [],
          People: [email.toLowerCase(), Auth.currentUser.email.toLowerCase()],
        });
  
      } catch (error) {
        console.error('Error adding document: ', error);
        alert('Error adding the document. Please ensure you have an active internet connection and try again.');
      } finally {
        setIsLoading(false);
        navigation.navigate('ConversationPage', {email});
      }
  };

  const handleConversationPress = () => {
    setIsDialogVisible(true);
  };

  const GotoConversation = (docId) => {
    navigation.navigate('ConversationPage', { docId });
  };

  const getAllData = () => {
    const currentUserEmail = Auth.currentUser.email.toLowerCase();
    const d = collection(db, "Conversations");
    const que = query(d, where("People", "array-contains", currentUserEmail));
  
    onSnapshot(que, (snapshot) => {
      let value = [];
      snapshot.forEach((doc) => {
        value.push({ id: doc.id, ...doc.data() });
      });
      setData(value);
    });
  };
  
  useEffect(() => {
    getAllData();
  }, []);

const handleLogout = async () => {
  try {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await Auth.signOut();
            navigation.navigate('Login');
          },
        },
      ],
      { cancelable: false }
    );
  } catch (error) {
    console.error('Error logging out: ', error);
    alert('Error logging out. Please try again.');
  }
};

  
  
  return (
    <View style={globalStyle.container}>
      <View style={globalStyle.header}>
        <Image source={require('../assets/favicon.png')} style={globalStyle.logo} />
        <Text style={globalStyle.title}>Faceless Notebook</Text>
        <TouchableOpacity onPress={handleLogout} style={globalStyle.logoutButton}>
          <Icon name="sign-out" size={40} color="#000" />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyle.buttonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[globalStyle.headerButton]}>
          <Icon name="home" size={20} color="#000" />
          <Text style={[globalStyle.headerButtonText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Messages')}
          style={[globalStyle.headerButton, globalStyle.selectedHeaderButton]}
        >
          <Icon name="comments" size={20} color="#000" />
          <Text style={globalStyle.headerButtonText}>Messages</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={globalStyle.feed} showsVerticalScrollIndicator={false}>
        <View style={globalStyle.postContainer}>
          <TouchableOpacity
            style={globalStyle.postButton}
            onPress={handleConversationPress}
          >
            <Icon name="comments" size={24} color="white" />
            <Text style={globalStyle.postButtonText}>Start a Conversation</Text>
          </TouchableOpacity>
        </View>
        {data && data.length > 0 ? (
          data.map((post, index) => {
                return (
                <View key={index}>
                <TouchableOpacity onPress={() => GotoConversation(post.id)}>
                    <Conversation dataList={post} />
                </TouchableOpacity>
                </View>
            );
          })
        ) : (
          <View style={globalStyle.center}>
            <Icon name="exclamation-circle" size={24} color="#999" />
            <Text style={globalStyle.text}>No Posts Found</Text>
          </View>
        )}
      </ScrollView>
      {isLoading && <LoadingScreen />}

      <Dialog.Container visible={isDialogVisible}>
        <Dialog.Title>Start a Conversation</Dialog.Title>
        <Dialog.Input
          placeholder="Enter email address"
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Dialog.Button label="Cancel" onPress={() => setIsDialogVisible(false)} />
        <Dialog.Button label="Start" onPress={handleAddConversation} />
      </Dialog.Container>
    </View>
  );
};

export default MessagesPage;
