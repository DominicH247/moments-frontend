import React, { Component } from "react";
import { TextInput, View, StyleSheet, ScrollView, Text, Image } from "react-native";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
import Amplify, { Auth } from "aws-amplify";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import LottieView from "lottie-react-native";
import Constants from "expo-constants";
import config from "../aws-exports";
import axios from "axios";

Amplify.configure(config);

export default class LoginScreen extends Component {
  isMounted = false;
  state = {
    image: null,
    uploaded: true,
    visible: false,
    username: "",
    password: "",
    email: "",
    code: "",
    hasSignedUp: false,
    needsToSignUp: false,
    hasSignedIn: false
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.isMounted = true;
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ hasSignedIn: true, username: response.username });
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

  uploadReferenceImage = () => {
    console.log("UPLOADING");
    this.setState({ visible: true });
    let file =
      Platform.OS === "android"
        ? this.state.image.uri
        : this.state.image.uri.replace("file://", "");
    const data = new FormData();
    data.append("profileImage", {
      uri: file,
      name: "image.jpeg",
      type: "image/jpeg"
    });
    axios
      .post(`https://moments-s3.herokuapp.com/api/upload/reference/${this.state.username}`, data, {
        headers: {
          accept: "application/json",
          "Accept-Language": "en-US,en;q=0.8",
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`
        }
      })
      .then(response => {
        console.log(response);
        this.setState({ image: null, visible: false });
      });
  };

  showSignUp = () => {
    this.setState({ needsToSignUp: true });
  };

  signUp = () => {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: { email: this.state.email }
    })
      .then(response => {
        this.setState({ hasSignedUp: true });
        data = { usr: response.user.username };
        axios
          .post(
            `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/createuser/`,
            data
          )
          .then(response => {
            console.log(response, "Inside axios createUser response");
          });
      })
      .catch(error => {
        console.log(error);
        alert("Problem with sign up");
      });
  };

  switchToLogin = () => {
    this.setState({ needsToSignUp: false });
  };

  confirmSignUp = () => {
    Auth.confirmSignUp(this.state.username, this.state.code).then(response => {
      this.signIn().then(response => {
        this.setState({ hasSignedIn: true });
      });
    });
  };

  signIn = () => {
    Auth.signIn(this.state.username, this.state.password).then(response => {
      console.log(response);
      this.setState({
        hasSignedIn: true,
        password: "",
        email: "",
        code: ""
      });
    });
  };

  signOut = () => {
    Auth.signOut().then(response => {
      this.setState({ hasSignedIn: false, username: "" });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.buttonContainerColumn}>
            {this.state.hasSignedIn ? (
              <>
                <Text style={styles.text}> Hello {this.state.username} welcome back! </Text>
                <Text style={styles.smallText}>
                  {" "}
                  In order for your frame to recognise you please take a clear photo of your face
                  and upload it to our recognition database{" "}
                </Text>
                <StyledButton text="Take Reference Photo" onPress={this.takePicture} />

                {this.state.image && !this.state.visible && (
                  <>
                    <Text style={styles.text}>Photo ready to upload</Text>
                    <Image
                      style={styles.photoContainer}
                      source={{ uri: this.state.image.uri }}
                    ></Image>
                    <StyledButton text="Upload Image" onPress={this.uploadReferenceImage} />
                  </>
                )}
                {this.state.visible && (
                  <View style={styles.container}>
                    <LottieView
                      visible={this.state.visible}
                      source={require("./lottieLoading.json")}
                      autoPlay
                      loop
                      style={{ height: 200 }}
                    />
                  </View>
                )}

                <StyledDarkButton text="Sign Out" onPress={this.signOut} />
              </>
            ) : (
              <>
                {this.state.needsToSignUp ? (
                  <>
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.username}
                      onChangeText={username => this.setState({ username })}
                      placeholder={"Username"}
                      placeholderTextColor={"turquoise"}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                      placeholder={"password"}
                      placeholderTextColor={"turquoise"}
                      secureTextEntry={true}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.email}
                      onChangeText={email => this.setState({ email })}
                      placeholder={"email"}
                      placeholderTextColor={"turquoise"}
                    />
                    <StyledButton text="SignUp" onPress={this.signUp} />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.code}
                      onChangeText={code => this.setState({ code })}
                      placeholder={"Sign Up Code"}
                      placeholderTextColor={"turquoise"}
                    />
                    <StyledButton text="Confirm Signup Code" onPress={this.confirmSignUp} />
                    <StyledButton text="Log In Instead" onPress={this.switchToLogin} />
                  </>
                ) : (
                  <>
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.username}
                      onChangeText={username => this.setState({ username })}
                      placeholder={"Username"}
                      placeholderTextColor={"turquoise"}
                    />
                    <TextInput
                      style={styles.inputBox}
                      value={this.state.password}
                      onChangeText={password => this.setState({ password })}
                      placeholder={"password"}
                      placeholderTextColor={"turquoise"}
                      secureTextEntry={true}
                    />
                    <StyledButton text="Sign In" onPress={this.signIn} />
                    <StyledButton text="Register" onPress={this.showSignUp} />
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2F"
  },
  contentContainer: {
    paddingTop: 30,
    alignItems: "center"
  },
  photoContainer: {
    margin: 10,
    flex: 0,
    alignItems: "center",
    width: 250,
    height: 250
  },
  inputBox: {
    padding: 10,
    color: "white",
    fontSize: 30
  },
  buttonContainerColumn: {
    paddingTop: 70,
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around"
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20,
    textAlign: "center"
  },
  smallText: {
    textAlign: "center",
    color: "turquoise",
    fontSize: 15,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5
  }
});
