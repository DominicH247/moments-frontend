import React, { Component } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import StyledButton from "../components/StyledButton";
import Amplify, { Auth } from "aws-amplify";
import config from "../aws-exports";
import { withAuthenticator } from "aws-amplify-react-native";

Amplify.configure(config);

export default class LoginScreen extends Component {
  isMounted = false;
  state = {
    image: [],
    uploaded: true,
    visible: false,
    username: "",
    password: "",
    email: "",
    code: ""
  };

  componentDidMount() {
    this.isMounted = true;
  }

  signUp = () => {
    Auth.signUp({
      username: this.state.username,
      password: this.state.password,
      attributes: { email: this.state.email }
    });
  };

  confirmSignUp = () => {
    Auth.confirmSignUp(this.state.username, this.state.code).then(response => {
      console.log(response, "RESPONSE");
    });
  };

  signIn = () => {
    Auth.signIn(this.state.username, this.state.password).then(response => {
      console.log(response, "RESPONSE");
    });
  };

  render() {
    return (
      <View>
        <TextInput
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
          placeholder={"Username"}
          placeholderTextColor={"turquoise"}
        />
        <TextInput
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder={"password"}
          placeholderTextColor={"turquoise"}
          secureTextEntry={true}
        />
        <TextInput
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
          placeholder={"email"}
          placeholderTextColor={"turquoise"}
        />

        <StyledButton text="SignUp" onPress={this.signUp} />
        <TextInput
          value={this.state.code}
          onChangeText={code => this.setState({ code })}
          placeholder={"SignUp Code"}
          placeholderTextColor={"turquoise"}
        />
        <StyledButton text="Confirm Signup Code" onPress={this.confirmSignUp} />

        <TextInput
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
          placeholder={"Username"}
          placeholderTextColor={"turquoise"}
        />
        <TextInput
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
          placeholder={"password"}
          placeholderTextColor={"turquoise"}
          secureTextEntry={true}
        />
        <StyledButton text="Sign In" onPress={this.signIn} />
      </View>
    );
  }
}
