import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, Auth } from '../Firebase';
import Post from './Post';
import { globalStyle } from './styles/styles';
import LoadingScreen from './LoadingScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = ({ navigation }) => {
  const [postText, setPostText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  
  async function handlePost() {

    try {
      setIsLoading(true);
      const now = new Date();
  
      // Add data to Firestore with createdAt field
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

    // Reset the input field
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


  return (
    <View style={globalStyle.container}>
      <View style={globalStyle.header}>
        <Image source={require('../assets/favicon.png')} style={globalStyle.logo} />
        <Text style={globalStyle.title}>Faceless Notebook</Text>
      </View>
      <ScrollView style={globalStyle.feed} showsVerticalScrollIndicator={false}>
        <View style={globalStyle.postContainer}>
          <TextInput
            style={globalStyle.input}
            placeholder="What's on your mind?"
            value={postText}
            onChangeText={setPostText}
          />
          <TouchableOpacity style={globalStyle.postButton} onPress={handlePost}>
            <Icon name="paper-plane" size={20} color="#fff" />
            <Text style={globalStyle.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {data && data.length > 0 ? (
          data.map((post, index) => {
            console.log(post)
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
