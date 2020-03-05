import * as React from "react";
import { Component } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";
import StyledDarkButton from "../components/StyledDarkButton";
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
        axios
          .get(
            `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/upload/${this.state.username}`
          )
          .then(response => {
            this.setState({ photos: response.data.images });
          });
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
    const data = { url: url };
    axios
      .post(
        `https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/images/${this.state.username}`,
        data
      )
      .then(response => {
        console.log(response);
      });
    this.setState(currentState => {
      const survivingPhotos = currentState.photos.filter(photo => {
        return photo !== url;
      });
      return { photos: survivingPhotos };
    });
  };

  changeActiveUser = () => {
    const data = { usr: this.state.username };
    axios
      .patch(`https://0cu7huuz9g.execute-api.eu-west-2.amazonaws.com/latest/api/activeuser/`, data)
      .then(response => {
        console.log(response);
      });
  };

  componentWillUnmount() {
    this.isMounted = false;
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View>
            <Text style={styles.text}>Your Current Images</Text>
          </View>

          <View style={styles.top}>
            <StyledButton text="Update Photos" onPress={this.updatePhotos} />
            {this.state.photos.length > 0 && (
              <Text style={styles.smallText}>Tap photos to remove them from your frame</Text>
            )}
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
        <View style={styles.bottomButton}>
          <StyledDarkButton text="Frame My Moments" onPress={this.changeActiveUser} />
        </View>
      </View>
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
    paddingTop: 30,
    alignItems: "center"
  },
  top: {
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
  },
  smallText: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    padding: 20
  },
  bottomButton: {
    flex: 0,
    alignItems: "center"
  }
});
