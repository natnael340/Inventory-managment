import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React from "react";
type Props = {
  show: boolean;
  position: {
    x: number;
    y: number;
  };
  hide: Function;
  values: {
    id: number | void;
    name: string;
  }[];
};

const DropDown = ({ show, position, hide, values }: Props) => {
  if (show) {
    const { y: top, x: left } = position;
    const width = 100;
    console.log(values);
    return (
      <TouchableWithoutFeedback onPress={() => hide("background Pressed")}>
        <View style={styles.container}>
          <View style={[styles.menu, { top, left: left, width }]}>
            <FlatList
              keyExtractor={(item, inde) => String(inde)}
              data={values}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => hide(item.name, item.id)}
                  style={styles.dropdownOption}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
  return <></>;
};

export default DropDown;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
    borderColor: "#0ABAB5",
    borderWidth: 0.5,
    borderRadius: 3,
  },
  dropdownOption: {
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
  },
});
