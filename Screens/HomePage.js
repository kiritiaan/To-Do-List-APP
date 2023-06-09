import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, Auth } from '../Firebase';
import Post from './Post';
import { globalStyle } from './styles/styles';
import LoadingScreen from './LoadingScreen';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { Alert } from 'react-native';

const Home = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  
  async function handlePost() {

    if(postText == ''){
      alert("Can't post empty string.");
      return;
    }

    try {
      setIsLoading(true);
      const now = new Date();
  
      const docRef = await addDoc(collection(db, 'Posts'), {
        content: postText,
        id: Auth.currentUser.uid,
        email: Auth.currentUser.email,
        likes: [],
        comments: [],
        createdAt: now
      });

    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding the document. Please ensure you have an active internet connection and try again.');
    } finally {
      setIsLoading(false);
    }

    setPostText('');
  };

  const getAllData = () => {
    const d = collection(db, "Posts");
    onSnapshot( d, (data) => {
      let value = [];
      data.docs.forEach(element => {
        value.push({uid: element.id , ...element.data()});
      });
      setData(value);
    })
  }

  useEffect( () => {
    getAllData();
  }, [])

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
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={[globalStyle.headerButton, globalStyle.selectedHeaderButton]}>
          <Icon name="home" size={20} color="#000" />
          <Text style={[globalStyle.headerButtonText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={globalStyle.headerButton}>
          <Icon name="comments" size={20} color="#000" />
          <Text style={globalStyle.headerButtonText}>Messages</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={globalStyle.feed} showsVerticalScrollIndicator={false}>
        <View style={globalStyle.postContainer}>
          <TextInput
            style={globalStyle.input}
            placeholder="What's on your mind?"
            value={postText}
            onChangeText={setPostText}
          />
          <TouchableOpacity style={globalStyle.postButton} onPress={handlePost} disabled={postText==''}>
            <Icon name="paper-plane" size={20} color="#fff" />
            <Text style={globalStyle.postButtonText} >Post</Text>
          </TouchableOpacity>
        </View>
        {data && data.length > 0 ? (
          data.map((post, index) => {
            return (
              <View key={index}>
                <Post post={post} />
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
    </View>
  );
};

export default Home;
