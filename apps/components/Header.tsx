import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

type Props = {
  title: string;
  openDrawer: Function;
  children: React.ReactNode | undefined;
};

export const Header = ({ title, openDrawer, children }: Props) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={() => openDrawer()}>
          <Entypo name="menu" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ color: "white", marginLeft: 5 }}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 40,
    width: "100%",
    backgroundColor: "#120A8F",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 5,
    justifyContent: "space-between",
  },
  headerLeft: {
    alignItems: "center",
    flexDirection: "row",
  },
});
