import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import FriendScreen from './screens/friend';
import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';
import SearchScreen from './screens/search';


const Stack = createNativeStackNavigator();
const Tab = createDrawerNavigator();

class App extends Component{
    render(){
        return (
            <NavigationContainer>
                <Stack.Navigator >
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Signup" component={SignupScreen} />
                    <Stack.Screen name="Friend" component={FriendScreen} />
                    <Stack.Screen options={{ headerShown: false }}  name="Home" component={HomeScreen, Nav} />
                    <Stack.Screen name="Search" component={SearchScreen} />
                    <Stack.Screen name="Logout" component={LogoutScreen} />
                </Stack.Navigator>
                
            </NavigationContainer>
        );
         
    function Nav(){
        return(
            <Tab.Navigator >
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Friend" component={FriendScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
                <Tab.Screen name="Logout" component={LogoutScreen} />
                
            </Tab.Navigator>
        )

    }
        
          }
}
export default App;