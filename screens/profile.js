import React, {Component} from 'react';
import {View, Text, Image, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      UserInfo: {},
      photo: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getData();
    this.getUserInfo();
   // this.getProfilePic();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
      

  getData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/search/", {
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
  getUserInfo = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+ id, {
           method: 'GET',
          'headers': {
            'Content-Type': 'application/json',
            'X-Authorization':  value 
          }
          })}


          

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

        <View>
          <Image
           source={{
             uri:this.state.photo,
           }}
           
           />

           </View>
           <View>
          <FlatList
                data={this.state.getUserInfo}
                renderItem={({item}) => (
                    <View>
                      <Text>
            Name:
            {' '}
            {item.user_givenname}
            {' '}
            {item.user_familyname}
          </Text>

          <Text>
           Email address:
           {'  '}
           {item.user_email}
          </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
        <View>
         
       </View>

       <View style={styles.buttonContainer}>
         <Button
         style={styles.buttonStyle}
         title="Edit"
         onPress={() => this.props.navigation.navigate('UploadPhoto')}
         />
         </View>
         </View>
         </View>
     
      );
    }
    

  }}
  const styles = StyleSheet.create({

    flexContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    },
    
    buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    },
    
    buttonStyle: {
    width: 50,
    height: 50,
    },
    
    imageStyle: {
    width: 350,
    height: 350,
    borderWidth: 5,
    alignSelf: 'center',
    },

    });

export default ProfileScreen;
