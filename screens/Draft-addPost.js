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
            text:""
        };
    }

    componentDidMount() {
        this.getData(); 
    }

    
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
                  //this.props.navigation.navigate("Login");
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


    addItem = async() => {
        let id = await AsyncStorage.getItem('@session_id');
        let value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user"+ id +"/post",{
            method: 'post',
            headers: {
                'X-Authorization':  value,
                 'Content-Type': 'application/json',
                 'Accept': 'application/json'
                
            },
            text: this.state.text
        })
            .then((response) => {
                Alert.alert("Post added");
                this.getData();
            })
            .catch((error) => {
                console.log(error);
            })
    }
    deletePost = async(post_id) => {
        let id = await AsyncStorage.getItem('@session_id');
        let value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/user/" + id +"/post/"+post_id, {
            method: 'delete',
            headers: {
                'X-Authorization':  value,
                 'Content-Type': 'application/json',
                 'Accept': 'application/json'
                
            },
            text: this.state.text
        })
            .then((response) => {
                this.getData();
                Alert.alert("Post deleted");
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
                            placeholder="Type your post"
                            onChangeText={(post_content) => this.setState({ post_content })}
                            value={this.state.post_content}
                        />
                        <Button
                            title="Upload your post"
                            onPress={() => this.addItem()}
                    />

                      <Button
                           title="get your post"
                           onPress={() => this.getData()}
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
                        <Button
                        title="Delete post"
                        onPress={() => this.deletePost()}
                    />
                    </View>
            );
        }
        }
    }


export default AddPostScreen;

