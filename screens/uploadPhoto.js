import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet} from 'react-native'
 
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';



class CameraScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      login_info: {},
      isLoading: true,
      hasPermission: null,
      type: Camera.Constants.Type.back,
    };
  }

  async componentDidMount() {
    const value = await AsyncStorage.getItem('@session_token');
      const data = await AsyncStorage.getItem('@session_id');
      this.setState({
        isLoading: false,
      
    });
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  
  };

  sendToServer = async (data) => {
    const res = await fetch(data.base64);
    const blob = await res.blob();
    let value = await AsyncStorage.getItem('@session_token');
    let id = await AsyncStorage.getItem('@session_id')

    return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/photo", {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': val,
      },
      body: blob,
    })
      .then((response) => {
        console.log('Picture added', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

render() {
    if (this.state.hasPermission) {
      return (
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={this.state.type}
            ref={(ref) => this.camera = ref}
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.takePicture();
                }}
              >
                <Text style={styles.text}> Take Photo </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  const type = type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back;

                  this.setState({ type });
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
    return (
      <Text>No access to camera</Text>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});


export default CameraScreen;