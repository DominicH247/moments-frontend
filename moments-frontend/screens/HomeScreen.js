import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Component } from "react";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import LottieView from "lottie-react-native";

class HomeScreen extends Component {
  state = {
    image: [],
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
    console.log(this.state.image);
    console.log(uri);
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
          this.setState({ image: [], visible: false });
        })
        .catch(error => {
          console.log("--------> Big Ol' Error -------->", error);
        });
    });
  };

  render() {
    console.log(this.state.image.length);
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

            {this.state.image.length > 0 && (
              <StyledButton text="Upload to Bucket" onPress={this.uploadImage} />
            )}

            {this.state.image.length === 1 && !visible && (
              <Image
                style={styles.photoContainer}
                source={{ uri: this.state.image[0].uri }}
              ></Image>
            )}

            {this.state.image.length > 1 && !visible && (
              <View style={styles.smallPhotoContainer}>
                {this.state.image.reverse().map(item => {
                  return (
                    <TouchableOpacity onPress={() => this.removeImage(item.uri)}>
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
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  }
});
