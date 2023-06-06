import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { globalStyle } from './styles/styles';
import { Auth } from '../Firebase';

const Post = (props) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const handleCommentChange = (text) => {
    setComment(text);
  };

  const submitComment = () => {
    
    console.log(Auth.currentUser.email)
    console.log(Auth.currentUser.uid)
    if (comment.trim() !== '') {
      const newComment = {
        id: comments.length + 1,
        email: 'example@example.com',
        comment: comment.trim(),
      };

      setComments([...comments, newComment]);
      setComment('');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <View style={globalStyle.post}>
      <View style={globalStyle.postHeader}>
        <Image
          source={require('../assets/icon.png')}
          style={globalStyle.profileImage}
        />
        <Text style={globalStyle.email}></Text>
      </View>
      <Text style={globalStyle.postText}>Test Text</Text>
      <View style={globalStyle.actions}>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Text style={globalStyle.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton} onPress={toggleComments}>
          <Text style={globalStyle.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Text style={globalStyle.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      {showComments && (
        <View style={styles.commentsContainer}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentContainer}>
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
