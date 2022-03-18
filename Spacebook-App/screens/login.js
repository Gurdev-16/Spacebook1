import React, { Component } from 'react';
import { Button } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "testtest@gmail.com",
            password: "testtest"
        }
    }

    login = async () => {
               
        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                alert("incorrect email or password"); //an alert will pop up on screen as well as showing it in the console
                throw 'Invalid email or password';
            }else{
                alert("Something went wrong");
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token)
                await AsyncStorage.setItem('@session_id', responseJson.id);
                this.props.navigation.navigate("Home");
        })

    
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:2, margin:5}}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={{padding:5, borderWidth:2, margin:5}}
                />
                <Button
                    title="Login"
                    color="blue"
                    onPress={() => this.login()}
                />
                <Button
                    title="Create an account "
                    color="blue"
                    onPress={() => this.props.navigation.navigate("Signup")}
                />
                
            </ScrollView>
            
        )
    }
}

export default LoginScreen;