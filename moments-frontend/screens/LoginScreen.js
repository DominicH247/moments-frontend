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
    alert(`Your username is ${username}`);
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
    return (
      <View>
        <TextInput
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
          placeholder={"Username"}
          placeholderTextColor="turquoise"
          style={styles.input}
        />
        <Button title={"Login"} style={styles.input} onPress={this.onLogin.bind(this)} />
        <Button title={"Signup"} style={styles.input} onPress={this.onSignup.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: "turquoise",
    marginBottom: 10
  }
});
