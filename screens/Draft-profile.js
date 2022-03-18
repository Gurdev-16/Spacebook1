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
      photo:{},
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });

    this.getData();
    this.getPhoto();
  }

  componentWillUnmount() {
    this.unsubscribe();
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
  getPhoto= async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+id+"/photo", {
      method: 'GET',
          'headers': {
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
console.log("here", this.state);
      return (
  
        <View>

        <View>
          <Image
           source={{
             uri:this.state.Photo,
           }}
           
           />

           </View>
           <View>
             <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                    <View>
                      <Text>
                       Name:{" "}
                      {item.user.UserInfo.first_name} 
                      {item.user.UserInfo.lat_name}
                      </Text>
                    </View>
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
                />
              <Button
      
         title="Edit"
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
    
    imageStyle: {
    width: 350,
    height: 350,
    borderWidth: 5,
    alignSelf: 'center',
    },

    });

export default ProfileScreen;
