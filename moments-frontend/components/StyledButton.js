import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

const StyledButton = props => {
  const content = (
    <View style={styles.button}>
      <Text style={styles.text}>{props.text}</Text>
    </View>
  );

  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    margin: 10,
    backgroundColor: "#3EC4CA",
    padding: 14,
    width: 180,
    borderRadius: 15,
    alignItems: "center"
  },
  text: {
    color: "white",
    fontSize: 20
  }
});

export default StyledButton;
