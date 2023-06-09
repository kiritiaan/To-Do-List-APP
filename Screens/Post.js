import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput,Alert, StyleSheet, TouchableWithoutFeedback, TouchableHighlightComponent, } from 'react-native';
import { globalStyle } from './styles/styles';
import { Auth, db } from '../Firebase';
import { updateDoc, doc, arrayUnion, arrayRemove , deleteDoc} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dialog from 'react-native-dialog';


const Post = (props) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false || props.post.comments?.length != 0);
  const [isLiked, setIsLiked] = useState(false || props.post.likes?.includes(Auth.currentUser.email));
  const content = props.post.content;
  const email = props.post.email;
  const [likesCount, setLikesCount] = useState(props.post.likes?.length || 0);
  const [isEditDialogVisible, setIsEditDialogVisible] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  const handleCommentChange = (text) => {
    setComment(text);
  };

  useEffect( () => {
    setComments(props.post.comments);
    setIsLiked(props.post.likes?.includes(Auth.currentUser.email))
    setLikesCount(props.post.likes?.length || 0)
  }, [props]);

  const handleLongPress = () => {
    if (props.post.email === Auth.currentUser.email) {
      Alert.alert(
        'Post Options',
        'Choose an option:',
        [
          { text: 'Edit', onPress: () => setIsEditDialogVisible(true) },
          { text: 'Delete Post', onPress: deletePost, style: 'destructive' },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert('Can\'t Delete Post', 'You can only delete your own post.');
    }
  };
  
  const deletePost = async () => {
    // Delete the post logic
    // ...
  
    // Example implementation:
    try {
      // Delete the post from the database using the post UID
      await deleteDoc(doc(db, "Posts", props.post.uid));
      alert('Post deleted successfully.');
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Error deleting post. Please try again later.');
    }
  };

  const handleEditPost = async () => {
    setIsEditDialogVisible(false);
  
    try {
      // Update the post content in the database using the post UID
      await updateDoc(doc(db, 'Posts', props.post.uid), {
        content: editedContent,
      });
      alert('Post edited successfully.');
    } catch (error) {
      console.error('Error updating document: ', error);
      alert('Error editing post. Please try again later.');
    }
  };
  

  const submitComment = async () => {

    try {
      await updateDoc(doc(db, "Posts", props.post.uid), {
        comments: arrayUnion({email: Auth.currentUser.email, comment: comment})
      });

    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error commenting. Please ensure you have an active internet connection and try again.');
    }


    setComment('');
    
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const toggleLike = async () => {

    await updateDoc(doc(db, "Posts", props.post.uid), {
      likes: isLiked? arrayRemove(Auth.currentUser.email) : arrayUnion(Auth.currentUser.email),
    });

  }


  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
    <View style={globalStyle.post} >
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
    <Text style={globalStyle.actionText}>{`${likesCount} ${likesCount <= 1 ? 'Like' : 'Likes'}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton} onPress={toggleComments}>
          <Icon name="comment" size={20} color="black" />
          <Text style={globalStyle.actionText}>Comment</Text>
        </TouchableOpacity>
      </View>
      {showComments && (
        <View style={styles.commentsContainer}>
          {comments?.map((comment, index) => (
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
          <TouchableOpacity style={[styles.commentButton,comment ==''? styles.disabled: styles.enabled]} disabled={comment === ''} onPress={submitComment}>
            <Text style={styles.commentButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}

      <Dialog.Container visible={isEditDialogVisible}>
        <Dialog.Title>Edit Post</Dialog.Title>
        <Dialog.Input
          placeholder="Enter new content"
          onChangeText={setEditedContent}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => setIsEditDialogVisible(false)}
        />
        <Dialog.Button
          label="Save"
          onPress={handleEditPost}
        />
      </Dialog.Container>
    </View></TouchableWithoutFeedback>
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
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  enabled: {
    backgroundColor: '#000',
  },
  commentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Post;
