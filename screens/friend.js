import React, {Component} from 'react';
import {View, Text, FlatList, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

class FriendScreen extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoading: true,
      listData: [],

    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
      
  }


  componentWillUnmount() {
    this.unsubscribe();
  }

  getData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/"+ id +"/friends",  {
          'headers': {
            'Content-Type': 'application/json',
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
        
        .catch((error) => {
            console.log(error);
        })
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login'); 
    }
    else{
      const value = await AsyncStorage.getItem('@session_id');
    if (value == null) {
        this.props.navigation.navigate('Login');}}
        
    };

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
          <Text>Here is your friend list...</Text>
         
          <FlatList
                data={this.state.listData}
                renderItem={({item,}) => (
                    <View>
                      <Text>{item.user_givenname} {item.user_familyname}  </Text>
                    </View>
                    
                )}
                keyExtractor={(item,index) => item.user_id.toString()}
              />
               <Button
         title="Add Friends"
         onPress={() => this.props.navigation.navigate("Search")}
         />
        </View>
      );
    }
    
  }
}



export default FriendScreen;
