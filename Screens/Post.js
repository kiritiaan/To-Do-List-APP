import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { globalStyle } from './styles/styles';
import { Auth, db } from '../Firebase';
import { updateDoc, doc, arrayUnion } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Post = (props) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isLiked, setIsLiked] = useState(false || props.post.likes?.includes(Auth.currentUser.email));
  const [content, setContent] = useState(props.post.content);
  const [email, setEmail] = useState(props.post.email);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  useEffect( () => {
    setComments(props.post.comments);
    console.log(props.post.likes?.includes(Auth.currentUser.email))
  }, []);

  const submitComment = async () => {

    try {
      await updateDoc(doc(db, "Posts", props.post.uid), {
        comments: arrayUnion({email: Auth.currentUser.email, comment: comment})
      });

    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding the document. Please ensure you have an active internet connection and try again.');
    }


    setComment('');
    
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  }


  return (
    <View style={globalStyle.post}>
      <View style={globalStyle.postHeader}>
        <Image
          source={require('../assets/icon.png')}
          style={globalStyle.profileImage}
        />
        <Text style={globalStyle.email}>{email}</Text>
      </View>
      <Text style={globalStyle.postText}>{content}</Text>
      <View style={globalStyle.actions}>
        <TouchableOpacity style={globalStyle.actionButton} onPress={toggleLike}>
          <Icon name="heart" size={20} color={isLiked ? 'red' : 'black'} />
          <Text style={globalStyle.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton} onPress={toggleComments}>
          <Icon name="comment" size={20} color="black" />
          <Text style={globalStyle.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Icon name="share" size={20} color="black" />
          <Text style={globalStyle.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      {showComments && (
        <View style={styles.commentsContainer}>
          {comments.map((comment, index) => (
            <View key={index} style={styles.commentContainer}>
              <Text style={styles.commentEmail}>{comment.email}</Text>
              <Text style={styles.commentText}>{comment.comment}</Text>
            </View>
          ))}
        </View>
      )}
      {showComments && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            value={comment}
            onChangeText={handleCommentChange}
          />
          <TouchableOpacity style={styles.commentButton} onPress={submitComment}>
            <Text style={styles.commentButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  commentsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  commentEmail: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  commentText: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
  },
  commentButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  commentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Post;
