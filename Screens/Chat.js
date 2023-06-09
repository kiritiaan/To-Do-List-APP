import { useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';
import { Auth } from '../Firebase';

const ChatBubble = ({ message, isMine }) => {
  const bubbleStyle = isMine ? styles.myBubble : styles.otherBubble;
  const textStyle = isMine ? styles.myText : styles.otherText;

  return (
    <View style={[styles.bubbleContainer, bubbleStyle]}>
      <Text style={textStyle}>{message.content}</Text>
    </View>
  );
};

const ConversationPage = () => {
  const route = useRoute();
  const [inputText, setInputText] = useState('');
  const [conversationData, setConversationData] = useState([]);
  const { params } = route; 
  const { docId } = params || {}; 
  
  const flatListRef = useRef();

  const handleSend = async () => {
    if (inputText.trim() === '') {
      return;
    }
    setInputText('');

    const newMessage = {
      content: inputText,
      sender: Auth.currentUser.email.toLowerCase()
    };

    try {
      const docRef = doc(db, 'Conversations', docId);
      await updateDoc(docRef, {
        message: [...conversationData, newMessage]
      });
    } catch (error) {
      console.log('Error sending message:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'Conversations', docId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const messages = data.message || [];
        setConversationData(messages);
      }
    });

    return () => unsubscribe();
  }, [docId]);

  useEffect(() => {
    if (conversationData.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [conversationData]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <FlatList
        ref={flatListRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
        data={conversationData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ChatBubble message={item} isMine={item.sender === Auth.currentUser.email} />
        )}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={<View style={{ height: 100 }} />} 
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  bubbleContainer: {
    borderRadius: 8,
    padding: 8,
    maxWidth: '70%',
    marginVertical: 4,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  myText: {
    color: '#FFF',
  },
  otherText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ConversationPage;
