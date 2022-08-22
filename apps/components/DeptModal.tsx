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
  addDept: Function;
  hideModal: Function;
  beer: beerType[];
};
const WIDTH = Dimensions.get("screen").width;
const DeptIntial = {
  name: "",
  beer: "",
  beerName: "",
  amount: "",
  dept: "",
  accusition: "",
};
type DeptsType = {
  name: string;
  bottle:
    | {
        name: string;
        id: number;
        amount: number;
      }[]
    | [];
  dept: number;
  accusition: string;
};
const DeptModal = ({ visible, addDept, hideModal, beer }: Props) => {
  const [Dept, setDept] = useState(DeptIntial);
  const [Depts, setDepts] = useState<DeptsType | undefined>();

  const [show, setShow] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const Typebutton = useRef(null);
  const Deptbutton = useRef(null);

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
          setShow(true);
        }
      );
    }
  };
  const hide = (text: string, id: number) => {
    if (!text?.startsWith("background")) {
      if (Dept.amount !== "") {
        let p = beer.find((b) => b.id == id);
        let amnt = Dept.amount;
        if ((p?.totalBottle || 0) < parseInt(amnt))
          amnt = String(p?.totalBottle);
        setDept({
          ...Dept,
          amount: amnt,
          beerName: text,
          beer: String(id),
        });
      } else setDept({ ...Dept, beerName: text, beer: String(id) });
    }
    setShow(false);
  };
  const closeModal = () => {
    setDept(DeptIntial);
    setDepts(undefined);
    hideModal();
  };
  const validateInput = () => {
    if (
      (!Depts || Depts?.bottle.every((l) => l.id !== parseInt(Dept.beer))) &&
      !isNaN(parseInt(Dept.dept))
    ) {
      let b:
        | [
            {
              id: number;
              name: string;
              amount: number;
            }
          ]
        | [] = [];
      if (Dept.beer)
        b = [
          {
            id: parseInt(Dept.beer),
            name: Dept.beerName,
            amount: parseInt(Dept.amount),
          },
        ];

      if (!Depts) {
        let d: DeptsType = {
          name: Dept.name,
          dept: parseFloat(Dept.dept),
          bottle: b,
          accusition: Dept.accusition,
        };
        setDepts(d);
        return d;
      }

      setDepts({ ...Depts, bottle: [...Depts.bottle, ...b] });
      return Depts;
    }
    Alert.alert("Input Error", "All the fields are required");
  };
  const updatePrice = (text: string) => {
    if (Dept.beer == "") {
      setDept({ ...Dept, amount: text });
    } else {
      let p = beer.find((b) => b.id == parseInt(Dept.beer));
      if ((p?.totalBottle || 0) < parseInt(text)) text = String(p?.totalBottle);
      setDept({
        ...Dept,
        amount: text,
      });
    }
  };
  const updateDepts = () => {
    let d = Depts;
    if (!Depts) {
      d = validateInput();
    }
    setDept(DeptIntial);
    addDept(d);
    setDepts(undefined);
  };
  return (
    <Modal visible={visible} transparent={true} style={{ flex: 1 }}>
      <View style={styles.modalOverlay}>
        <View style={styles.ModalPopupView}>
          <Text style={{ alignSelf: "center" }}>Add Dept</Text>
          <FlatList
            data={Depts?.bottle}
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
                <Text>{item.name}</Text>
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
          <Text>Name</Text>
          <TextInput
            value={Dept.name}
            placeholder="name"
            style={styles.textInputStyle}
            onChangeText={(text) => setDept({ ...Dept, name: text })}
          />
          <Text>Beer</Text>
          <View style={[styles.textInputStyle, { ...styles.dropdownWrapper }]}>
            <TouchableOpacity
              ref={Deptbutton}
              onPress={() => showDropDown(Deptbutton.current, "Beer")}
            >
              <Text style={{ color: "#777777" }}>{Dept.beerName}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>Dept</Text>
              <TextInput
                keyboardType="numeric"
                value={Dept.dept}
                placeholder="dept"
                style={styles.textInputStyle}
                onChangeText={(text) => setDept({ ...Dept, dept: text })}
              />
            </View>
            <View style={{ flexGrow: 1, marginLeft: 5 }}>
              <Text>Amount</Text>
              <TextInput
                keyboardType="numeric"
                value={Dept.amount}
                placeholder="SPrice"
                onChangeText={(text) => updatePrice(text)}
                style={styles.textInputStyle}
              />
            </View>
          </View>
          <View style={styles.twoColumn}>
            <View style={{ flexGrow: 1, marginRight: 5 }}>
              <Text>accusition</Text>
              <TextInput
                value={Dept.accusition}
                placeholder="accusition"
                onChangeText={(text) => setDept({ ...Dept, accusition: text })}
                style={styles.textInputStyle}
              />
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
              onPress={updateDepts}
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
          values={beer.map((b) => ({ id: b.id, name: b.name }))}
        />
      </View>
    </Modal>
  );
};

export default DeptModal;

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
