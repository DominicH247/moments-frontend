import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";

class LinksScreen extends Component {
  isMounted = false;
  state = {
    photos: [],
    updated: false
  };

  componentDidMount() {
    this.isMounted = true;
    axios
      .get("https://k8445cuwvd.execute-api.eu-west-2.amazonaws.com/latest/api/photos/crookydan")
      .then(response => {
        this.setState({ photos: response.data.data.Item.picURL });
      });
  }

  updatePhotos = () => {
    axios
      .get("https://k8445cuwvd.execute-api.eu-west-2.amazonaws.com/latest/api/photos/crookydan")
      .then(response => {
        console.log(response.data.data.Item.picURL);
        this.setState({ photos: response.data.data.Item.picURL });
      });
  };

  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
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
                <Image style={styles.onePhoto} source={{ url }}></Image>
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
