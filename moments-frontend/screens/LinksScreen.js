import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import Amplify, { Auth } from "aws-amplify";

class LinksScreen extends Component {
  isMounted = false;
  state = {
    photos: [],
    updated: false,
    username: ""
  };

  componentDidMount() {
    this.isMounted = true;
    Auth.currentAuthenticatedUser()
      .then(response => {
        this.setState({ username: response.username });
      })
      .catch(response => {
        alert("Please Login");
      });
  }

  updatePhotos = () => {
    axios
      .get(
        `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/${this.state.username}`
      )
      .then(response => {
        this.setState({ photos: response.data.images });
      });
  };

  deleteImageFromDB = url => {
    console.log(url);
    // remove from DB
    const data = { url: url };
    // console.log(data);
    axios
      .post(
        `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/images/${this.state.username}`,
        data
      )
      .then(response => {
        console.log(response);
      });
    // remove from state
    this.setState(currentState => {
      const survivingPhotos = currentState.photos.filter(photo => {
        return photo !== url;
      });
      return { photos: survivingPhotos };
    });
  };

  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    console.log(this.state.username);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.text}>Your Images</Text>
        </View>

        <View>
          <StyledButton text="Update Photos" onPress={this.updatePhotos} />
        </View>

        <View style={styles.photoContainer}>
          {this.state.photos.reverse().map(url => {
            return (
              <View key={url}>
                <TouchableOpacity onPress={() => this.deleteImageFromDB(url)}>
                  <Image style={styles.onePhoto} source={{ url }}></Image>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F2F2F"
  },
  contentContainer: {
    paddingTop: 15,
    alignItems: "center"
  },
  photoContainer: {
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
