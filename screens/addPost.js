import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AddPostScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            postListData: [],
            post_id: 0,
            post_content: '',
            text_:[]
            
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


        addItem = async () => {

        let value = await AsyncStorage.getItem('@session_token'); /* sets token in val*/
        let id = await AsyncStorage.getItem('@session_id') /*sets sessionID in id*/

        // need to pass id in url
        return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Authorization': value
            },
            body: JSON.stringify({// this is the content
                text: this.state.text
            })
        })
            .then((response) => {
                var ok = response.ok;
                if (ok) {
                    alert('Post created!');
                    return response.text();
                }
                else {
                    console.log('post not created');
                    alert(response.json());
                }
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
            console.log('add post ');


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
                            onChangeText={(val) => this.setState({ text: val })} />
                            <Button
                                title="Upload your post"
                                    onPress={() => this.addItem()} />

                      <Button
                           title="view your posts "
                           onPress={() => this.props.navigation.navigate("ViewPost")}
                    />
                        <View>
                            <FlatList
                             data={this.state.post_id}
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

