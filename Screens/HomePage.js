import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { addDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';

const Home = ({navigation}) => {
  const [postText, setPostText] = useState('');

  const post = () => {
    return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.email}>example@example.com</Text>
      </View>
      <Text style={styles.postText}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tellus ac mi luctus feugiat.
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  }

  async function handlePost() {

  
    try {
      // Get the current date and time
      const now = new Date();
  
      // Add data to Firestore with createdAt field
      const docRef = await addDoc(collection(db, 'Posts'), {
        content: postText,
        sharedPost: false,
        createdAt: now
      });

      alert("Post Successful!");

    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding the document. Please ensure you have an active internet connection and try again.');
    } finally {

    }

    // Reset the input field
    setPostText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/favicon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Facebook</Text>
      </View>
      <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
      <View style={styles.postContainer}>
        <TextInput
          style={styles.input}
          placeholder="What's on your mind?"
          value={postText}
          onChangeText={setPostText}
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
        
        {/* Add more posts here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  postContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: '#4267B2',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feed: {
    flex: 1,
  },
  post: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  email: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postText: {
    fontSize: 16,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionText: {
    fontSize: 16,
  },
});

export default Home;
