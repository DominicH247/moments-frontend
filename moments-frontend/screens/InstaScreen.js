import React, { Component } from "react";
import { TextInput, View, StyleSheet, ScrollView } from "react-native";
import StyledButton from "../components/StyledButton";
import Amplify, { Auth } from "aws-amplify";
import config from "../aws-exports";
import axios from "axios";
import { Linking } from "react-native";
import { WebView } from "react-native-webview";

class instaScreen extends Component {
  render() {
    const uri =
      "https://api.instagram.com/oauth/authorize?client_id=200702797656640&redirect_uri=https://moments-s3.herokuapp.com/api&scope=user_profile,user_media&response_type=code";
    return (
      <WebView
        ref={ref => {
          this.webview = ref;
        }}
        source={{ uri }}
        onNavigationStateChange={event => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}

export default instaScreen;
