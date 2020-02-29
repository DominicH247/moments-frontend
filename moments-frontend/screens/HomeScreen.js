import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
import LottieView from "lottie-react-native";
import Amplify, { Auth } from "aws-amplify";

class HomeScreen extends Component {
  state = {
    image: [],
    uploaded: true,
    visible: false,
    username: ""
  };

  componentDidMount() {
    this.getPermissionAsync();
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ username: response.username });
      })
      .catch(response => {
        alert("Please Login");
      });
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
      if (this.state.image.length < 4) {
        this.setState(currentState => {
          return { image: [...currentState.image, result] };
        });
      } else {
        alert("Please upload photos before choosing more");
      }
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
      if (this.state.image.length < 4) {
        this.setState(currentState => {
          return { image: [...currentState.image, result] };
        });
      } else {
        alert("Please upload photos before choosing more");
      }
    }
  };

  removeImage = uri => {
    this.setState(currentState => {
      const survivingImages = currentState.image.filter(image => {
        return image.uri !== uri;
      });
      return { image: survivingImages };
    });
  };

  uploadImage = event => {
    this.setState({ visible: true });
    this.state.image.forEach(item => {
      let file = item.uri.replace("file://", "");
      const data = new FormData();
      data.append("profileImage", { uri: file, name: "image.jpeg" });
      axios
        .post("https://moments-s3.herokuapp.com/api/upload", data, {
          headers: {
            accept: "application/json",
            "Accept-Language": "en-US,en;q=0.8",
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`
          }
        })
        .then(response => {
          if (response.status === 200) {
            axios.post(
              `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/`,
              { imageLocation: response.data.location, usr: this.state.username }
            );
          }
          this.setState({ image: [], visible: false });
        })
        .catch(error => {
          console.log("--------> Big Ol' Error -------->", error);
        });
    });
  };

  render() {
    const { visible } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.text}>Please Select Images</Text>
          </View>
          <View style={styles.buttonContainerColumn}>
            <>
              <StyledButton text="Camera Roll" onPress={this.pickImage} />
              <StyledButton text="Take Photo" onPress={this.takePicture} />
            </>
            {this.state.image.length === 1 && !visible && (
              <>
                <Text style={styles.smallText}>
                  Tap photos to remove them from your selection before uploading to your frame
                </Text>
                <TouchableOpacity onPress={() => this.removeImage(this.state.image[0].uri)}>
                  <Image
                    style={styles.photoContainer}
                    source={{ uri: this.state.image[0].uri }}
                  ></Image>
                </TouchableOpacity>
              </>
            )}
            {this.state.image.length > 1 && !visible && (
              <View style={styles.smallPhotoContainer}>
                <Text style={styles.smallText}>
                  Tap photos to remove them from your selection before uploading to your frame
                </Text>
                {this.state.image.reverse().map(item => {
                  return (
                    <TouchableOpacity key={item.uri} onPress={() => this.removeImage(item.uri)}>
                      <Image
                        key={item.uri}
                        style={styles.onePhoto}
                        source={{ uri: item.uri }}
                      ></Image>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
        {this.state.image.length > 0 && (
          <>
            <View style={styles.bottomButton}>
              <StyledDarkButton text="Send To Frame" onPress={this.uploadImage} />
            </View>
          </>
        )}
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
  contentContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  lottie: { width: 100, height: 100 },
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
  smallPhotoContainer: {
    flex: 0,
    width: 400,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  onePhoto: {
    backgroundColor: "white",
    marginTop: 25,
    height: 150,
    width: 150
  },
  smallText: {
    textAlign: "center",
    color: "turquoise",
    fontSize: 15,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  },
  bottomButton: {
    flex: 0,
    alignItems: "center"
  }
});
