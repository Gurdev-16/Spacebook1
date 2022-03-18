import React, {Component, Fragment} from 'react';
import {Text, View, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import {ScrollView} from 'react-native-gesture-handler';


const searchInDrop = ['Friend List', 'Suggested Friends'];

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchData: [],
      q: '',
      search_in: 'all',
      limit: 20,
      offset: 0,

    };
  }


  addFriend = async (friendId) => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');

    return fetch("http://localhost:3333/api/1.0.0/user/" + friendId + '/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      }
    })
    .then((response) => {
      if(response.status === 200){
          return response.json()
      }else if(response.status === 401){
        this.props.navigation.navigate("Login");
      }else if (response.status === 403){
        alert("Friend already added");
          throw 'Friend already added';
      }else{
      throw 'Something went wrong';
      }
     
        })
        .catch((error) => {
          if (error.status == 403) {
            alert(' friend alrady added');
          } else {
            console.log(error);
          }
        });
  };

  getSearchData = async () => {
    const id = await AsyncStorage.getItem('@session_id');
    const value = await AsyncStorage.getItem('@session_token');
    const url = "http://localhost:3333/api/1.0.0/" + 'search?q=' + this.state.q +
      '&search_in=' + this.state.search_in +
      '&limit=' + this.state.limit +
      '&offset=' + this.state.offset;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value
      },
    })
        .then((response) => {
          let text;
          if (response.status == 200) {
            response.json().then((json) =>{
              this.setState({
                isLoading: false,
                searchData: json,
              });
            });
                    }
        })
        .catch((error) => {
          if (error.status == 403) {
            alert('Friend request pending/ friend already exists');
          } else {
            console.log(error);
          }
        });
  };

  render() {
    console.log('Search');
    const selectOptions = searchInDrop.map((element) =>
      <Picker.Item label={element} value={element} key={element}/>,
    );
    return (
      <ScrollView>
        
            <Text>Press to choose</Text>

            <Picker
              selectedValue={this.state.search_in}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({'search_in': itemValue.toLowerCase()})
              }>
              {selectOptions}
            </Picker>
          
          <Button
            title="Search"
            onPress={() => this.getSearchData()}
          />
        
        <Fragment>
          <FlatList
            data={this.state.searchData}
            extraData={this.state}
            await renderItem={({item}) =>
              <View>
                <View>
                  <Text>{item.user_givenname} {item.user_familyname}</Text>
                </View>
                <Button
                  title="Send a friend request"
                  onPress={() => this.addFriend(item.user_id)}
                />
              </View>
            }
            keyExtractor={(item) => item.user_id}
          />
        </Fragment>
        
      </ScrollView>

    );
  }
}
export default SearchScreen;