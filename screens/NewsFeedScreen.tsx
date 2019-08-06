import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NewsFeedScreen() {
  return (
    <View style={styles.container}>
      <Text>NewsFeed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
