import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddPostScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            postListData: [],
            post_id: '',
            post_content: '',
        };
    }

    /*componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            //this.checkLoggedIn();
        });

        this.getData();
    }*/
    componentDidMount() {
        console.log("mounted");
        this.getData(); 
    }

    /*async getData() {
        console.log("getting content...");
        try {
            let response = await fetch("http://localhost:3333/api/1.0.0/user/post",
                {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify
                        (
                            {
                                post_id: this.state.post_id,
                                post_content: this.state.post_content,
                            }
                        )
                });
            // sign up method 
            let res = await response.text();
            if (response.status >= 200 && response.status < 300) { //if response correct then user is signed up
                alert('Post created successfully! ' + " " + res);
                //this.props.navigation.navigate('Login');

            } else {
                // error
                alert('SOMETHING WENT WRONG' + res);
                let error = res;
                throw error;
            }
        }
        catch (error) {
        }
 };*/



    /*deleteItem = (id) => {
        return fetch("http://localhost:3333/list/" + id, {
            method: 'delete'
        })
            .then((response) => {
                this.getData();
                Alert.alert("Post deleted");
            })
            .catch((error) => {
                console.log(error);
            })
    }
    */
    getData = async () => {
        const id = await AsyncStorage.getItem('@session_id');
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/post",  {
              'headers': {
                'X-Authorization':  value
            
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
                }else{
                  alert("Something went wrong");
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
              })
            })
            .then(async () => {
              await AsyncStorage.setItem('@session_token')
              await AsyncStorage.setItem('@session_id')
            
            })
            .catch((error) => {
                console.log(error);
            })
      }
    
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
      };


    addItem = () => {
        let to_send = {
            post_id: parseInt(this.state.post_id),
            post_content: this.state.post_content,
        };

        return fetch("http://localhost:3333/api/1.0.0/user/"+ id +"/post",{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
            .then((response) => {
                Alert.alert("Post added");
                this.getData();
            })
            .catch((error) => {
                console.log(error);
            })
    }

        render() {
            if (this.state.isLoading){
             return (
               <View
                 style={{
                   flex: 1,
                   flexDirection: 'column',
                   justifyContent: 'center',
                   alignItems: 'center',
                 }}>
                 <Text>Loading..</Text>
               </View>
               );
            }else{
            return (
                    <View>
                        <TextInput
                            placeholder="Create a post"
                            onChangeText={(post_content) => this.setState({ post_content })}
                            value={this.state.post_content}
                        />
                        <Button
                        title="Upload your post"
                        onPress={() => this.addItem()}
                    />
                        <View>
                            <FlatList
                            data={this.state.postListData}
                            renderItem={({ item }) => (
                                <View>
                                    <Text>{item.post_content}</Text>
                                </View>
                                )}
                            keyExtractor={(item, index) => item.post_id.toString()}
                            />

                        </View>

                    </View>
            );
        }
        }
    }


export default AddPostScreen;

