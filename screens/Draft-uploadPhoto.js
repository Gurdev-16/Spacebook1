/*import React, {Component} from 'react';
import {View, Text, FlatList, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native';
import {RNCamera} from 'react-native-camera';


class UploadPhotoScreen extends Component {
    constructor(props){
      super(props);
      this.state = {
        token: ''
      
      }
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
  
    takePicture = async() => {
      if(this.camera){
        const options = {quality:0.5, base64:true}
        const data = await this.camera.takePictureAsync(options);
        
  
        console.log(data.uri, value);
  
        return fetch("http://localhost:3333/api/1.0.0/user/photo",
        {
          method: 'POST',
          headers: {
            "Content-Type": "image/jpeg",
            "X-Authorization": value
          },
          body: data
        })
        .then((response) => {
          Alert.alert("Picture Added!");
        })
        .catch((error) => {
          console.error(error);
        });
      }
    }
  
    render(){
      return(
        <View style={{flex:1, width:'100%'}}>
          <RNCamera
            ref={ref => {
              this.camera = ref;
              }}
            style={{
              flex:1,
              width: '100%'
              }}
            />
            <Button title="Take Photo" onPress={() => {this.takePicture()}} />
        </View>
        )
    }
  }
  
  export default UploadPhotoScreen;
  */
