import React from "react";
import { View, Text } from "react-native";

export default function Card({ title, value }) {
  return (
    <View style={{
      backgroundColor: "#fff",
      padding: 15,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 3
    }}>
      <Text style={{ fontSize: 14 }}>{title}</Text>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{value}</Text>
    </View>
  );
}
