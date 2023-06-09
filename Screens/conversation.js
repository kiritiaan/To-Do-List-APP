import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Auth } from '../Firebase';

const Conversation = ({ dataList }) => {



  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.name}>{dataList?.People[0].toLowerCase() == Auth.currentUser.email? dataList?.People[1].toLowerCase(): dataList?.People[0].toLowerCase()}</Text>
        <Text style={styles.latestChat}>{}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  latestChat: {
    fontSize: 14,
    color: '#808080',
  },
});

export default Conversation;
