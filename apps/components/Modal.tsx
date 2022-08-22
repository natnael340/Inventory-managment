import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  UIManager,
  findNodeHandle,
  Dimensions,
  Button,
} from "react-native";
import React, { useState } from "react";
import { useRef } from "react";
import DropDown from "./DropDown";
import { Alert } from "react-native";
import { beerType } from "./types";
import { useEffect } from "react";

type Props = {
  visible: boolean;
  addBeer: Function;
  hideModal: Function;
  beers: beerType | null;
  clearbeer: Function;
};
const WIDTH = Dimensions.get("screen").width;
const beerIntial = {
  id: 0,
  name: "",
  price: "",
  stock: "",
  sPrice: "",
  type: "Beer",
  totalBottle: "",
  bottlePrice: "",
};
type beeerType = {
  id: number | void;
  name: string;
  price: string;
  stock: string;
  sPrice: string;
  type: string;
  totalBottle: string;
  bottlePrice: string;
};
const CustomModal = ({
  visible,
  addBeer,
  hideModal,
  beers,
  clearbeer,
}: Props) => {
  const [beer, setBeer] = useState<beeerType>(beerIntial);

  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const button = useRef(null);

  const showDropDown = () => {
    if (button) {
      UIManager.measure(
        Number(findNodeHandle(button.current)),
        (x, y, width, height, pageX, pageY) => {
          const position = {
            left: pageX,
            top: pageY,
            width: width,
            height: height,
          };
          setPosition({ x: pageX, y: pageY + height });
          setShow(true);
        }
      );
    }
  };
  const hide = (text: string) => {
    if (!text?.startsWith("background")) setBeer({ ...beer, type: text });
    setShow(false);
  };
  const closeModal = () => {
    setBeer(beerIntial);
    hideModal(true);
    clearbeer();
  };
  const validateInput = () => {
    if (
      beer.name.length > 2 &&
      [
        beer.price,
        beer.sPrice,
        beer.bottlePrice,
        beer.stock,
        beer.totalBottle,
      ].every((p) => !isNaN(parseInt(p)))
    ) {
      let d = {
        id: beer.id,
        name: beer.name,
        price: parseFloat(beer.price),
        profit: parseFloat(beer.sPrice) - parseFloat(beer.price),
        type: beer.type,
        totalBottle: parseInt(beer.totalBottle),
        bottlePrice: parseFloat(beer.bottlePrice),
        stock: parseInt(beer.stock),
      };
      addBeer(d);
      return;
    }
    Alert.alert("Input Error", "All the fields are required");
  };
  useEffect(() => {
    if (beers) {
      setBeer({
        id: beers.id,
        name: beers.name,
        price: String(beers.price),
        type: beers.type,
        sPrice: String(beers.profit + beers.price),
        stock: String(beers.stock),
        bottlePrice: String(beers.bottlePrice),
        totalBottle: String(beers.totalBottle),
      });
    }
  }, [beers]);
  return (
    <Modal visible={visible} transparent={true} style={{ flex: 1 }}>
      <View style={styles.modalOverlay}>
        <View style={styles.ModalPopupView}>
          <Text style={{ alignSelf: "center" }}>Add Beer</Text>
          <Text>Name</Text>
          <TextInput
            value={beer.name}
            textContentType="name"
            placeholder="Name"
            onChangeText={(text) => setBeer({ ...beer, name: text })}
            style={styles.textInputStyle}
          />
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>Price</Text>
              <TextInput
                keyboardType="numeric"
                value={beer.price}
                placeholder="Price"
                onChangeText={(text) => setBeer({ ...beer, price: text })}
                style={styles.textInputStyle}
              />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>SPrice</Text>
              <TextInput
                keyboardType="numeric"
                value={beer.sPrice}
                placeholder="SPrice"
                onChangeText={(text) => setBeer({ ...beer, sPrice: text })}
                style={styles.textInputStyle}
              />
            </View>
          </View>
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>Type</Text>
              <View
                style={[styles.textInputStyle, { ...styles.dropdownWrapper }]}
              >
                <TouchableOpacity ref={button} onPress={showDropDown}>
                  <Text style={{ color: "#777777" }}>{beer.type}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>Stock</Text>
              <TextInput
                keyboardType="numeric"
                value={beer.stock}
                placeholder="Stock"
                onChangeText={(text) => setBeer({ ...beer, stock: text })}
                style={styles.textInputStyle}
              />
            </View>
          </View>
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>NO of Bottle</Text>
              <TextInput
                keyboardType="numeric"
                value={beer.totalBottle}
                placeholder="Price"
                onChangeText={(text) => setBeer({ ...beer, totalBottle: text })}
                style={styles.textInputStyle}
              />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>Bottle Price</Text>
              <TextInput
                keyboardType="numeric"
                value={beer.bottlePrice}
                placeholder="SPrice"
                onChangeText={(text) => setBeer({ ...beer, bottlePrice: text })}
                style={styles.textInputStyle}
              />
            </View>
          </View>
          <View style={styles.twoColumn}>
            <TouchableOpacity
              onPress={closeModal}
              style={[
                styles.button,
                {
                  width: (WIDTH - 60) / 2 - 5,
                  marginLeft: 5,
                  backgroundColor: "#ff0038",
                },
              ]}
            >
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={validateInput}
              style={[
                styles.button,
                {
                  width: (WIDTH - 60) / 2 - 5,
                  marginLeft: 5,
                  backgroundColor: "#0abab5",
                },
              ]}
            >
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DropDown
          show={show}
          hide={hide}
          position={position}
          values={[
            { id: 1, name: "Beer" },
            { id: 2, name: "Alchol" },
            { id: 3, name: "Pin" },
          ]}
        />
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
  },
  ModalPopupView: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 20,
    padding: 10,
  },
  textInputStyle: {
    borderColor: "#0abab5",
    borderWidth: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    color: "#777777",
  },
  twoColumn: {
    flexDirection: "row",
  },
  dropdownWrapper: {
    paddingVertical: 10,
  },
  dropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderColor: "#0ABAB5",
    borderWidth: 0.5,
    borderRadius: 3,
    zIndex: 50,
  },
  dropdownOption: {
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.3)",
    zIndex: 50,
  },
  button: {
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
