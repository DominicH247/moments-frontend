import * as React from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import LottieView from "lottie-react-native";
import { ImageBrowser } from "expo-image-picker-multiple";

class HomeScreen extends Component {
  state = {
    image: null,
    uploaded: true,
    visible: false
  };

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        // alert("Accept camera roll permissions to make this work!");
      }

      const { status2 } = await Permissions.askAsync(Permissions.CAMERA);
      if (status2 !== "granted") {
        // alert("Accept camera permissions to make this work!");
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
    this.setState({ visible: true });
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
        this.setState({ image: null, visible: false });
      })
      .catch(error => {
        console.log("--------> Big Ol' Error -------->", error);
      });
  };

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.text}>Please select an image</Text>
          </View>

          <View
            style={!this.state.image ? styles.buttonContainerRow : styles.buttonContainerColumn}
          >
            <>
              <StyledButton text="Camera Roll" onPress={this.pickImage} />
              <StyledButton text="Take Photo" onPress={this.takePicture} />
            </>

            {this.state.image && (
              <StyledButton text="Upload to Bucket" onPress={this.uploadImage} />
            )}
            {this.state.image && !visible && (
              <Image style={styles.photoContainer} source={{ uri: this.state.image.uri }}></Image>
            )}
          </View>
          {visible && (
            <View style={styles.container}>
              <LottieView
                visible={visible}
                source={require("./lottieLoading.json")}
                autoPlay
                loop
                style={{ height: 200 }}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2F"
  },
  lottie: { width: 100, height: 100 },
  contentContainer: {
    paddingTop: 30,
    flex: 1,
    alignItems: "center"
  },
  buttonContainerRow: {
    flex: 0,
    flexDirection: "row"
  },
  buttonContainerColumn: {
    flex: 0,
    flexDirection: "column",
    alignItems: "center"
  },
  photoContainer: {
    margin: 10,
    flex: 0,
    alignItems: "center",
    width: 300,
    height: 300
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  }
});
