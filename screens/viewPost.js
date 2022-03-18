import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class ViewPostScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            getPostList: [], 
            post_id: '',
            text: '',
            User: []

        };
    }

    async componentDidMount() {

        const value = await AsyncStorage.getItem('@session_token');
        const id = await AsyncStorage.getItem('@session_id')

        return fetch('http://localhost:3333/api/1.0.0/user/' + id + '/post', {
            method: 'GET',
            headers: {
                'X-Authorization': value
            },
        })


            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                this.setState({
                    isloading: false,
                    getPostList: responseJson,
                
                })
            })

            .catch((error) => {
                alert(error);

            });
    }

    render() {
        if (this.state.isLoading) {
            return (
               
                <View>    

                    <View>
                        <FlatList
                        data={this.state.getPostList}
                        keyExtractor={(item, index) => item.post_id.toString()}
                            renderItem={({ item }) => (
                                <View>
                                    <Text>{item.text}</Text>
                                </View>
                            )}                          
                        />
                    </View>

                </View>
            );
        } else {
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
        }
    }


}

export default ViewPostScreen;