import React, { Component } from "react";
import { TextInput, View, Button, StyleSheet } from "react-native";

export default class LoginScreen extends Component {
  isMounted = false;
  state = {
    image: [],
    uploaded: true,
    visible: false,
    username: ""
  };

  componentDidMount() {
    this.isMounted = true;
  }

  onLogin() {
    const { username } = this.state;
    if (username.length > 5) {
      alert(`Your username is ${username}`);
    } else {
      alert("Enter Valid Username");
    }
  }

  onSignup() {
    const { username } = this.state;
    if (username.length > 5) {
      alert(`You have signed up as ${username}`);
    } else if (username.length === 0) {
      alert("Enter Valid Username");
    } else {
      alert("Username requires at least 6 characters");
    }
  }

  render() {
    const { username } = this.state;
    return (
      <View>
        <TextInput
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
          placeholder={"Username"}
          placeholderTextColor={"turquoise"}
          style={styles.input}
        />
        <Button title={"Login"} style={styles.button} onPress={this.onLogin.bind(this)} />
        <Button title={"Signup"} style={styles.button} onPress={this.onSignup.bind(this)} />
        {this.props.navigation.navigate("HomeScreen", { username })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    alignItems: "center",
    margin: 8,
    width: 160,
    height: 44,
    padding: 14,
    borderWidth: 1,
    borderColor: "turquoise",
    borderRadius: 15
  },
  button: {
    margin: 8,
    backgroundColor: "#3EC4CA",
    padding: 14,
    width: 160,
    borderRadius: 15,
    alignItems: "center"
  }
});
