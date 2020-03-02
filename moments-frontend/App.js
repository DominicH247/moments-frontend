import * as React from "react";
import { Platform, StatusBar, StyleSheet, View, Text, Image, Styles } from "react-native";
import { SplashScreen } from "expo";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import useLinking from "./navigation/useLinking";
import StyledButton from "./components/StyledButton";
import AppIntroSlider from "react-native-app-intro-slider";

const Stack = createStackNavigator();

function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const [showApp, setShowApp] = React.useState(false);
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const slides = [
    {
      key: "moments1",
      title: "Hello, welcome to moments",
      text: "this is an app",
      text2: "for you to use",
      image: require("./assets/images/diverse-group.png"),
      height: 250,
      width: 380,
      backgroundColor: "#3EC4CA"
    },
    {
      key: "moments2",
      title: "This man has a phone",
      text: "Take a photo",
      text2: "Upload",
      image: require("./assets/images/man-phone.png"),
      height: 300,
      width: 300,
      backgroundColor: "#ffb92b"
    },
    {
      key: "moments3",
      title: "this is a frame with a family",
      text: "Send to Frame!",
      image: require("./assets/images/family-frame.png"),
      height: 270,
      width: 350,
      backgroundColor: "#cdd7d6"
    }
  ];

  _renderItem = ({ item }) => {
    console.log(item);
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-around",
          alignItems: "center",
          backgroundColor: item.backgroundColor
        }}
      >
        <Text>{item.title}</Text>
        <Image
          source={item.image}
          style={{
            height: item.height,
            width: item.width
          }}
        />
        <Text>{item.text}</Text>
        <Text>{item.text2}</Text>
      </View>
    );
  };
  _onDone = () => {
    setShowApp(true);
  };

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf")
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else if (showApp) {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  } else {
    return (
      <AppIntroSlider
        showSkipButton={true}
        slides={slides}
        renderItem={_renderItem}
        onDone={_onDone}
      />
    );
  }
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  slide: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  image: {
    height: 270,
    width: 350
  }
});

export default App;
