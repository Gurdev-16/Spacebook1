import React, { Component } from 'react';
import { Button, ScrollView, TextInput } from 'react-native';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
      
        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Bad request';
            }else{
                throw 'an error has occured';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return (
            <ScrollView>
                <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your email address..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="cchoose a password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Create an account"
                    onPress={() => this.signup()}
                />
            </ScrollView>
        )
    }
}

export default SignupScreen;