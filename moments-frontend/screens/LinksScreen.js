import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import axios from "axios";

class LinksScreen extends Component {
  state = {
    photos: [],
    updated: false
  };

  componentDidMount() {
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

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.text}>Your Images</Text>
          <Button color="white" onPress={this.updatePhotos} title="Update Photos"></Button>
          <View style={styles.photoContainer}>
            {this.state.photos.reverse().map(url => {
              console.log(url);
              return (
                <View>
                  <Image style={styles.onePhoto} source={{ url }}></Image>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default LinksScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#266A2F"
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
    marginTop: 25,
    flex: 0,
    height: 150,
    width: 150
  },
  text: {
    color: "white",
    fontSize: 30,
    padding: 20
  }
});
