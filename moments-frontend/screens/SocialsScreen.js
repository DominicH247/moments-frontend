import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";

class SocialsScreen extends Component {
  state = {
    instaUsername: "",
    instaPhotos: [],
    valid: true,
    reason: "Invalid Input"
  };

  updateUsername = event => {
    console.log(event);
    this.setState({ instaUsername: event });
  };

  getInstaPhotos = () => {
    if (this.state.instaUsername !== "") {
      this.setState({ instaUsername: "", instaPhotos: [] });
      axios
        .get(`https://www.instagram.com/${this.state.instaUsername}/?__a=1&max_id=<end_cursor>`)
        .then(({ data }) => {
          let URLs = data.graphql.user.edge_owner_to_timeline_media.edges.map(item => {
            if (item.node.display_url !== undefined && item.node.display_url !== null) {
              return item.node.display_url;
            }
          });
          if (URLs.length > 0) {
            this.setState({ instaPhotos: URLs, valid: true });
          } else {
            this.setState({ reason: "Instagram Is Private" });
          }
        })
        .catch(error => {
          this.setState({ valid: false, reaon: "Invalid Input" });
        });
    } else {
      this.setState({ valid: false, reaon: "Invalid Input" });
    }
  };

  uploadMultipleImages = () => {
    const selectedFiles = this.state.instaPhotos;

    selectedFiles.map(url => {
      axios
        .patch(
          `https://k8445cuwvd.execute-api.eu-west-2.amazonaws.com/latest/api/photos/crookydan`,
          { photos: url }
        )
        .then(response => {
          console.log(response);
        });
    });
  };

  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.text}>Get Your Photos from Social Media</Text>
        </View>

        <View>
          <TextInput
            style={{
              height: 40,
              width: 300,
              paddingLeft: 15,
              borderColor: "gray",
              borderWidth: 1,
              color: "white"
            }}
            onChangeText={this.updateUsername}
            value={this.state.instaUsername}
          />
        </View>

        <View>
          <StyledButton text="Connect Instagram" onPress={this.getInstaPhotos} />
          <StyledButton text="Upload All Photos to DB" onPress={this.uploadMultipleImages} />
        </View>

        {!this.state.valid && (
          <View>
            <Text style={styles.text}>{this.state.reason}</Text>
          </View>
        )}

        <View style={styles.photoContainer}>
          {this.state.instaPhotos.map(url => {
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

export default SocialsScreen;

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
    textAlign: "center",
    color: "white",
    fontSize: 30,
    padding: 20
  }
});
