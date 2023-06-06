import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import Post from './Post';
import  {globalStyle}  from './styles/styles';
import LoadingScreen from './LoadingScreen';

const Home = ({navigation, route}) => {
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
        sharedPost: false,
        id: route.params.Id,
        email: route.params.Email,
        createdAt: now
      });

      alert("Post Successful!");

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
        value.push(element.id);
      });
      setData(value);
    })
  }

  useEffect( () => {
    getAllData();
    console.log(data);
  }, [])


  return (
    <View style={globalStyle.container}>
      <View style={globalStyle.header}>
        <Image
          source={require('../assets/favicon.png')}
          style={globalStyle.logo}
        />
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
          <Text style={globalStyle.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      {data?.map((post, index) => {
        return (<View key={index}><Post postId={post.id}/></View>)
      })}
        {/* Add more posts here */}
      </ScrollView>
      {isLoading && <LoadingScreen />}
    </View>
  );
};

export default Home;
