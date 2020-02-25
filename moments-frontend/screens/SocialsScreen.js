import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
import StyledButton from "../components/StyledButton";

class SocialsScreen extends Component {
  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View>
          <Text style={styles.text}>Get Your Photos from Social Media</Text>
        </View>

        <View>
          <StyledButton text="Connect Instagram" />
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
