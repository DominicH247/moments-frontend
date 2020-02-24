import * as React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";

class HomeScreen extends Component {
  state = {
    image: null,
    uploaded: true
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
      const { status2 } = await Permissions.askAsync(Permissions.CAMERA);
      if (status2 !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    }
  };

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });
    if (!result.cancelled) {
      this.setState({ image: result });
    }
  };

  uploadImage = event => {
    // let file = Platform.OS === "android" ? this.state.image.uri : this.state.image.uri.replace("file://", "");
    let file = this.state.image.uri.replace("file://", "");
    const data = new FormData();
    data.append("profileImage", { uri: file, name: "image.jpeg" });
    axios
      .post("https://calm-scrubland-54250.herokuapp.com/api/images/", data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`
        }
      })
      .then(response => {
        if (response.status === 200) {
          axios.patch(
            `https://k8445cuwvd.execute-api.eu-west-2.amazonaws.com/latest/api/photos/crookydan`,
            { photos: response.data.location }
          );
        }
        this.setState({ image: null });
      })
      .catch(error => {
        console.log("--------> Big Ol' Error -------->", error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.text}>Please select an image</Text>
            {this.state.image && (
              <Image style={styles.photoContainer} source={{ uri: this.state.image.uri }}></Image>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <>
              <Button color="white" onPress={this.pickImage} title="Camera Roll"></Button>
              <Button color="white" onPress={this.takePicture} title="Take Photo"></Button>
            </>
            {this.state.image && (
              <Button
                color="white"
                onPress={this.uploadImage}
                title="Upload Image to S3 Bucket"
              ></Button>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#266A2F"
  },
  contentContainer: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center"
  },
  photoContainer: {
    flex: 0,
    alignItems: "center",
    width: 400,
    height: 400
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  }
});
