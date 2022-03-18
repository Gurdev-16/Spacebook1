import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';


class ProfileScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      UserInfo: {},
      firstname: '',
      lastname: '',
      email: '',
      Friends: 0,
      photo: null
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });}

    async componentDidMount() {
    this.getData();
    this.getPPic();
  }

  getData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/", {
      method: 'GET',
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

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };
  getPPic = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
      method: 'GET',
          'headers': {
            'X-Authorization':  value 
            
          }
        })
        .then((res) => {
          return res.blob();
          
      })
      .then((resBlob) => {
        console.log("profile pic working");
        let  data =URL.createObjectURL(resBlob);
        this.setState({
          photo: data,
 

        })

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
console.log("here", this.state);
      return (
  
        <View>

        <View>
        <Image
                source={{
                  uri: this.state.photo,
                }}
                style={{
                  align: 'center',
                  width: 80,
                  height: 80,
                  borderWidth: 2,
                }}
              />      

           </View>
           <View>
             
                    <View>
                      <Text>
                       Name:{" "}
                       {this.state.firstname} {this.state.lastname}
                      </Text>
                      <Text>
                       Email:{" "}
                       {this.state.email}
                      </Text>
                      <Text>
                       Friend Count:{" "}
                       {this.state.Friends}
                      </Text>
                    </View>
              
              <Button
      
         title="upload new profile picture"
         onPress={() => this.props.navigation.navigate('UploadPhoto')}
         />
        <Button
         title="Sign out"
         onPress={() => this.props.navigation.navigate("Logout")}
         />

     </View>

       <View style={styles.buttonContainer}>
         
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

    });

export default ProfileScreen;
