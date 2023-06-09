import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, TransitionPresets } from '@react-navigation/native-stack';
import Login from './Screens/LoginPage';
import Register from './Screens/RegisterPage';
import Home from './Screens/HomePage';
import MessagesPage from './Screens/Messages';
import ConversationPage from './Screens/Chat';


const Stack = createNativeStackNavigator();

export default function App() {



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={Register} options={{headerShown:false}}/>
        <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
        <Stack.Screen name="Messages" component={MessagesPage} options={{headerShown:false}}/>
        <Stack.Screen name="ConversationPage" component={ConversationPage} options={{headerShown:true}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});