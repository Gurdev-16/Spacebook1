import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import FriendScreen from './screens/friend';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';
import SearchScreen from './screens/search';
import ProfileScreen from './screens/Profile';
import UploadPhotoScreen from './screens/uploadPhoto';
import AddPostScreen from './screens/addPost';



const Stack = createNativeStackNavigator();
const Tab = createDrawerNavigator();

class App extends Component{
    render(){
        return (
            //options={{ headerShown: false }}means that the header will not been shown so only the  tab navigation will be shown not the outer stack navigator 
            <NavigationContainer>
                <Stack.Navigator >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Friend" component={FriendScreen} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="Profile" component={ProfileScreen} />
                    <Stack.Screen options={{ headerShown: false }}  name="Home" component={HomeScreen,Nav} /> 
                   {/*} <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} />*/}
                    <Stack.Screen name="Logout" component={LogoutScreen} />
                    <Stack.Screen name="AddPost" component={AddPostScreen} />
                </Stack.Navigator>
            </NavigationContainer>
         );
         
    function Nav(){
        return(
            <Tab.Navigator >
                <Tab.Screen name="Home Screen" component={HomeScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                <Tab.Screen name="Friends" component={FriendScreen} />
                <Tab.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="AddPost" component={AddPostScreen} />
                <Tab.Screen name="Logout" component={LogoutScreen} />
                {/*<Tab.Screen name="UploadPhoto" component={UploadPhotoScreen} />*/}
                
            </Tab.Navigator>
        )

    }
  }
}
export default App;