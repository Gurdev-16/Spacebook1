import React, { Component } from 'react';
import { View, Text, ActivityIndicator, FlatList, Button, Alert, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendReqScreen extends Component
{
    constructor(props) {
        super(props);
        this.state = {
            SuggestedFriends: [],
            Friendrequests: [],
            FriendsList: []
        }
    }

    componentDidMount() {

        this.getFriendReq();
    } 

    getFriendReq = async () => {
        let value = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')

        return fetch("http://localhost:3333/api/1.0.0/friendrequests",
            {
                method: 'GET',
                headers: {
                    'X-Authorization': value,
                }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    return response.json();
                }
                else if (response.status === 400) {
                    alert('Bad request');
                }
                else {
                    alert('something went wrong');
                }
            })
            .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    Friendrequests: responseJson
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }
     
    AcceptReq = async (id) => {

        let value = await AsyncStorage.getItem('@session_token');
        
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id,
            {
                method: 'POST',
                headers: {
                    'X-Authorization': value,
                }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    this.getFriendReq();
                    return response.json();
                }
                else if (response.status === 400) {
                    alert('Bad request');
                }
                else {
                    alert('something went wrong');
                }
            })
            .catch((error) => {
                console.log(error)
            })


    }

    
    DecReq = async (id) => {
        let value = await AsyncStorage.getItem('@session_token');
        
       
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + id,
            {
                method: 'DELETE',
                headers: {
                    'X-Authorization': value,
                }
            })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    this.getFriendReq();
                    return response.json();
                }
                else if (response.status === 400) {
                    alert('Bad request');
                }
                else {
                    alert('something went wrong');
                }
            })
            .catch((error) => {
                console.log(error)
            })
        }
            render() {
                return (
                    <View style={FriendStyl.FriendSec}>
                    <Text style={FriendStyl.FriendTitle}> Friend Requests </Text>
                    <FlatList
                        data={this.state.Friendrequests}
                        renderItem={({ item }) =>
                        (
                            <View>
                                <Text>{item.first_name} {item.last_name}</Text>
                                <Text>{item.email}</Text>
                                <Button
                                    title="Accept Friend Request"
                                    onPress={() => this.AccountReq(item.user_id)}
                                />
                                <Button
                                    title="Decline friend Request"
                                    onPress={() => this.DecReq(item.user_id)}
                                />
                            </View>
                        )}

                        keyExtractor={(item, index) => item.user_id}
                    />
                </View>
        
                    );
                }
            }
export default FriendReqScreen;

const FriendStyl = StyleSheet.create(
    {
        container: {
            flex: 1,
        },

        FriendSec:
        {
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },

        FriendTitle:
        {
            fontSize: 25,
            fontWeight: 'bold',
            alignItems: 'center',
            justifyContent: 'center',
        },

    }
)
