import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { AppLoading } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import Theme from "../config/theme";
import getApiConnector from "../services/get-api-connector";
import { apiUrl, apiConfig } from "../config/api";
import { googleLogin } from "../services/google-auth";
import googleAuth from "../config/google-auth";

const apiConnector = getApiConnector(apiUrl, apiConfig);

export default function HomeScreen(props) {
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const goToLogin = () => {
    // props.navigation.navigate("Login", { apiConnector });
    // @ts-ignore
    googleLogin(googleAuth).then((token: string) => {
      setIsAuthenticating(true);
      apiConnector.client
        .authenticate({ strategy: "google", access_token: token })
        .then(() => setIsAuthenticated(true))
        .catch((error: any) => {
          console.log(error.message);
          setIsAuthenticated(false);
        })
        .finally(() => setIsAuthenticating(false));
    });
  };

  useEffect(() => {
    setIsAuthenticating(true);

    apiConnector.client
      .reAuthenticate()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setIsAuthenticating(false));
  }, [0]);

  if (isAuthenticating) {
    return <AppLoading />;
  } else if (isAuthenticated) {
    return props.navigation.navigate("NewsFeed", { apiConnector });
  } else {
    return (
      <View style={styles.container}>
        <View style={[styles.container, { marginTop: "20%" }]}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 24,
                fontWeight: "600",
                color: Theme.primary
              }
            ]}
          >
            UnitedCHURCH
          </Text>
        </View>
        <View style={{ height: 130, width: 130, flex: 2 }}>
          <Image
            style={styles.image}
            source={require("../assets/images/homeCross.png")}
          />
        </View>
        <View style={styles.container}>
          <Text
            style={[
              styles.text,
              {
                fontSize: 18
              }
            ]}
          >
            Sharing Across a United Church
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Theme.backGround,
            marginBottom: "20%"
          }}
          onPress={goToLogin}
        >
          <LinearGradient
            colors={[Theme.primary, Theme.fadedPrimary]}
            start={[0, 0.5]}
            end={[1, 0.5]}
            style={styles.callToActionBtn}
          >
            <Text style={[styles.text, styles.callToActionText]}>
              Get Started
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    textAlign: "center",
    fontSize: 14,
    color: Theme.secondary
  },
  callToActionText: {
    fontSize: 18,
    fontWeight: "500",
    color: Theme.backGround
  },
  callToActionBtn: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: "15%",
    borderRadius: 39.5
  },
  image: {
    height: null,
    width: null,
    flex: 1,
    resizeMode: "cover"
  }
});
