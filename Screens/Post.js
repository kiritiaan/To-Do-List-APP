import { View, Text, TouchableOpacity, Image, globalStyleheet } from 'react-native'
import React, { useEffect } from 'react'
import { globalStyle } from './styles/styles'

const Post = (props) => {

    const id = props.postId;

    
  return (
    <View style={globalStyle.post}>
      <View style={globalStyle.postHeader}>
        <Image
          source={require('../assets/icon.png')}
          style={globalStyle.profileImage}
        />
        <Text style={globalStyle.email}></Text>
      </View>
      <Text style={globalStyle.postText}>
        
      </Text>
      <View style={globalStyle.actions}>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Text style={globalStyle.actionText}>Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Text style={globalStyle.actionText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={globalStyle.actionButton}>
          <Text style={globalStyle.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Post