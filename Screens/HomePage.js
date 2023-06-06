import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../assets/adaptive-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>Facebook</Text>
      </View>
      <View style={styles.feed}>
        <View style={styles.post}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.postText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tellus ac mi luctus feugiat.
          </Text>
        </View>
        <View style={styles.post}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.postText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tellus ac mi luctus feugiat.
          </Text>
        </View>
        <View style={styles.post}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.profileImage}
          />
          <Text style={styles.postText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed gravida tellus ac mi luctus feugiat.
          </Text>
        </View>
        {/* Add more posts */}
      </View>
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
    borderBottomColor: "black",
    borderBottomWidth: 3,
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
  feed: {
    flex: 1,
    margin: 10,
  },
  post: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postText: {
    fontSize: 16,
  },
});

export default Home;