import React, { Component } from 'react';
import { Text, Image, View, Button, StyleSheet, ActivityIndicator, Pressable, TextInput, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Caption, Divider, Title } from 'react-native-paper';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userid: '',
            firstname: '',
            lastname: '',
            email: '',
            Friends: 0,
            FriendReq: 0,
            req: [],
            post: [],
            photo: null
        }
    }


    componentDidMount() {
        this.getInfo();
        this.getProfilePic();
        this.getReq();
        this.getPosts();
    }


    DeletePost = async (postid) => {
        let val = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post/" + postid, {
            method: 'DELETE',
            headers: {
                'X-Authorization': val
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    console.log("post deleted");
                    this.getPosts();
                    return response.json()
                }
                else if (response.status === 401) {
                    console.log("user not found")
                }
                else {
                    throw 'Something went wrong'
                }
            })
            .catch((error) => {
                console.log(error)
            })

    }

    getInfo = async () => {
        let value = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')
        return fetch("http://localhost:3333/api/1.0.0/user/" + id, {
            method: 'GET',
            headers: {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    return response.json()
                }
                else if (response.status === 401) {
                    console.log("user not found")
                }
                else {
                    throw 'Something went wrong'
                }
            })
            .then((responseJson) => {
                console.log("working");
                this.setState({
                    userid: responseJson.user_id,
                    firstname: responseJson.first_name,
                    lastname: responseJson.last_name,
                    email: responseJson.email,
                    Friends: responseJson.friend_count
                })
                console.log(this.state);
                console.log(responseJson);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getProfilePic = async () => {
        let value = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
            method: 'GET',
            headers: {
                'X-Authorization': value
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.blob()
                }
                else if (response.status === 304) {
                    return response.blob()
                }
                else if (response.status === 400) {

                    throw 'Invalid email or password';
                }
                else {
                    throw 'Something went wrong';
                }
            })
            .then((responseBlob) => {
                console.log("working");
                let data = URL.createObjectURL(responseBlob);
                this.setState({
                    photo: data,
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getReq = async () => {
        let value = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')

        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
            method: 'GET',
            headers: {
                'X-Authorization': value
            }
        })

            .then((response) => {
                if (response.status === 200) {
                    console.log(response);
                    return response.json()
                }
                else if (response.status === 401) {
                    console.log("user not found")
                }
                else {
                    throw 'Something went wrong'
                }
            })

            .then(async (responseJson) => {
                console.log(responseJson);
                this.setState({
                    req: responseJson
                })
                this.state.FriendReq = (this.state.req).length;
            })

            .catch((error) => {
                console.log(error);
            })


    }

    getPosts = async () => {
        let value = await AsyncStorage.getItem('@session_token');
        let id = await AsyncStorage.getItem('@session_id')

        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post",
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
                    Posts: responseJson
                })
            })
            .catch((error) => {
                console.log(error)
            })

    }


    render() {
        return (

            <View style={ProfileStyle.container}>
                <View style={ProfileStyle.ProfileInfo}>
                    <Pressable style={ProfileStyle.Button} onPress={() => this.props.navigation.navigate('Profile')}>
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>


              <Image
                source={{
                  uri: this.state.photo,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                }}
              />      



                            <View style={{ marginLeft: 20 }} >
                                <Title style={ProfileStyle.name}>{this.state.firstname} {this.state.lastname} </Title>

                                <Caption>{this.state.email}</Caption>
                                <Text>{this.state.userid}</Text>

                            </View>

                        </View>
                    </Pressable>


                    <View style={ProfileStyle.ProfileBtns}>

                        <Pressable style={ProfileStyle.Button} onPress={() => this.props.navigation.navigate('Friend')}>
                            <Text style={ProfileStyle.btnTxt}>Friends</Text>
                        </Pressable>

                        <Divider orientation="vertical" />

                        <Pressable style={ProfileStyle.Button} onPress={() => this.props.navigation.navigate('FriendReq')}>
                            <Text style={ProfileStyle.btnTxt}>Requests: {this.state.FriendReq}</Text>
                        </Pressable>

                        <Pressable style={ProfileStyle.Button} onPress={() => this.props.navigation.navigate('AddPost')}>
                            <Text style={ProfileStyle.btnTxt}> Add a Post </Text>
                        </Pressable>

                        <Pressable style={ProfileStyle.Button} onPress={() => this.props.navigation.navigate('Profile')}>
                            <Text style={ProfileStyle.btnTxt}> Profile </Text>
                        </Pressable>

                    </View>

                    <Divider style={ProfileStyle.Divider} />

                    <View>

                        <FlatList
                            scrollEnabled
                            data={this.state.Posts}
                            renderItem={({ item }) =>

                            (
                                <View>
                                    <View style={{ flexDirection: 'row' }}>
                                    <Image
                source={{
                  uri: this.state.photo,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                }}
              />      
                                        
                                        <View>
                                            <Title style={ProfileStyle.postname}>{item.author.first_name} {item.author.last_name}</Title>
                                            <Caption style={ProfileStyle.time}>{item.timestamp}</Caption>
                                        </View>
                                    </View>

                                    <Text style={ProfileStyle.Posttxt}>{item.text}</Text>
                                    <Text>Likes: {item.numLikes}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Pressable style={ProfileStyle.likebtn} onPress={() => this.likePost(item.user_id, item.post_id)}>
                                            <Text style={ProfileStyle.btnPostTxt}>Like</Text>
                                        </Pressable>

                                        <Pressable style={ProfileStyle.likebtn} onPress={() => this.DeletePost(item.post_id)}>
                                            <Text style={ProfileStyle.btnPostTxt}>Delete</Text>
                                        </Pressable>

                                    </View>
                                    <Divider style={ProfileStyle.Divider} />

                                </View>
                            )}

                            keyExtractor={(item, index) => item.post_id}
                        />
                    </View>

                </View>
            </View>




        );
    }
}

const ProfileStyle = StyleSheet.create(
    {
        container:
        {
           
        },

        btnPostTxt:
        {
            color: 'black',
            fontWeight: 'bold'
        },

        likebtn:
        {
            borderRadius: 30,
            height: 30,
            marginTop: 10,
            width: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#008CBA',
        },


        Posttxt:
        {
            fontSize: 15,
            fontWeight: "bold",
        },

        postname:
        {
            marginLeft: 10,
            marginTop: 10,
            fontSize: 15,
        },

        time:
        {
            marginBottom: 10,
            marginRight: 10,
        },

        Divider:
        {
            marginTop: 10,
        },

        Button:
        {
            flex: 1,
            borderRadius: 4,
            marginLeft: 10,

        },

        btnTxt:
        {
            color: 'Black',
            fontWeight: 'bold'
        },

        ProfileBtns:
        {
            flexDirection: 'row',
            marginTop: 15,
            backgroundColor: '#008CBA',
        },

        ProfileInfo:
        {
            paddingHorizontal: 30,
            marginBottom: 25,
        },
    }
)

export default HomeScreen;
