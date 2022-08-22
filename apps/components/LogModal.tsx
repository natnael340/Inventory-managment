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
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import DropDown from "./DropDown";
import { Alert } from "react-native";
import { beerType } from "./types";

type Props = {
  visible: boolean;
  addLog: Function;
  hideModal: Function;
  beer: beerType[];
};
const WIDTH = Dimensions.get("screen").width;
const LogIntial = {
  beer: "",
  beerName: "",
  amount: "",
  type: "Beer",
  price: "",
};
type LogsType = {
  beer: number;
  beerName: string;
  amount: number;
  type: string;
  price: number;
};
const CustomModal = ({ visible, addLog, hideModal, beer }: Props) => {
  const [Log, setLog] = useState(LogIntial);
  const [Logs, setLogs] = useState<LogsType[] | []>([]);
  const [DropDownOption, setDropDownOption] = useState<
    { name: string; id: number | void }[] | []
  >([]);
  const [show, setShow] = useState({ type: false, beer: false });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const Typebutton = useRef(null);
  const Logbutton = useRef(null);

  const showDropDown = (button: number | null, name: string) => {
    if (button) {
      UIManager.measure(
        Number(findNodeHandle(button)),
        (x, y, width, height, pageX, pageY) => {
          const position = {
            left: pageX,
            top: pageY,
            width: width,
            height: height,
          };
          setPosition({ x: pageX, y: pageY + height });
          if (name === "Beer") {
            setDropDownOption(
              beer.map((b) => ({
                name: b.name,
                id: b.id,
              }))
            );
            setShow({ type: false, beer: true });
          } else {
            setDropDownOption([
              { id: 1, name: "Sell" },
              { id: 2, name: "Buy" },
            ]);
            setShow({ beer: false, type: true });
          }
        }
      );
    }
  };
  const hide = (text: string, id: number) => {
    if (!text?.startsWith("background")) {
      if (text === "Sell" || text === "Buy") setLog({ ...Log, type: text });
      else {
        if (Log.amount !== "") {
          let p = beer.find((b) => b.id == id);
          let amnt = Log.amount;
          if ((p?.stock || 0) < parseInt(amnt)) amnt = String(p?.stock);
          setLog({
            ...Log,
            amount: amnt,
            beerName: text,
            beer: String(id),
            price: String(
              ((p?.price || 0) + (p?.profit || 0)) * parseInt(amnt) || 0
            ),
          });
        } else setLog({ ...Log, beerName: text, beer: String(id) });
      }
    }
    setShow({ type: false, beer: false });
  };
  const closeModal = () => {
    setLog(LogIntial);
    setLogs([]);
    hideModal(true);
  };
  const validateInput = () => {
    if (
      Logs.every((l) => l.beer !== parseInt(Log.beer)) &&
      [Log.price, Log.amount].every((p) => !isNaN(parseInt(p)))
    ) {
      let d: LogsType = {
        beerName: Log.beerName,
        beer: parseInt(Log.beer),
        price: parseFloat(Log.price),
        type: Log.type,
        amount: parseInt(Log.amount),
      };
      let l = [...Logs];
      l.push(d);
      setLogs([...Logs, d]);
      return;
    }
    Alert.alert("Input Error", "All the fields are required");
  };
  const updatePrice = (text: string) => {
    if (Log.beer == "") {
      setLog({ ...Log, amount: text });
    } else {
      let p = beer.find((b) => b.id == parseInt(Log.beer));
      if ((p?.stock || 0) < parseInt(text)) text = String(p?.stock);
      setLog({
        ...Log,
        amount: text,
        price: String(
          ((p?.price || 0) + (p?.profit || 0)) * parseInt(text) || 0
        ),
      });
    }
  };
  const updateLogs = () => {
    setLog(LogIntial);
    addLog(Logs);
    setLogs([]);
  };
  return (
    <Modal visible={visible} transparent={true} style={{ flex: 1 }}>
      <View style={styles.modalOverlay}>
        <View style={styles.ModalPopupView}>
          <Text style={{ alignSelf: "center" }}>Add Log</Text>
          <FlatList
            data={Logs}
            keyExtractor={(item, index) => String(index)}
            numColumns={3}
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: "lightblue",
                  padding: 5,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  marginHorizontal: 5,
                }}
              >
                <Text>{item.beerName}</Text>
                <View
                  style={{
                    marginHorizontal: 5,
                    backgroundColor: "#0ABAB5",
                    borderRadius: 10,
                    padding: 1,
                  }}
                >
                  <Text style={{ color: "white" }}>{item.amount}</Text>
                </View>
              </View>
            )}
          />
          <Text>Beer</Text>
          <View style={[styles.textInputStyle, { ...styles.dropdownWrapper }]}>
            <TouchableOpacity
              ref={Logbutton}
              onPress={() => showDropDown(Logbutton.current, "Beer")}
            >
              <Text style={{ color: "#777777" }}>{Log.beerName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>Price</Text>
              <TextInput
                keyboardType="numeric"
                value={Log.price}
                placeholder="Price"
                style={styles.textInputStyle}
                editable={false}
              />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>Amount</Text>
              <TextInput
                keyboardType="numeric"
                value={Log.amount}
                placeholder="SPrice"
                onChangeText={(text) => updatePrice(text)}
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
                <TouchableOpacity
                  ref={Typebutton}
                  onPress={() => showDropDown(Typebutton.current, "type")}
                >
                  <Text style={{ color: "#777777" }}>{Log.type}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>&nbsp;</Text>
              <TouchableOpacity
                onPress={validateInput}
                style={[
                  styles.button,
                  styles.textInputStyle,
                  {
                    backgroundColor: "#32CD32",
                  },
                ]}
              >
                <Text style={{ color: "white" }}>Add</Text>
              </TouchableOpacity>
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
              onPress={updateLogs}
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
          show={show.type || show.beer}
          hide={hide}
          position={position}
          values={DropDownOption}
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
