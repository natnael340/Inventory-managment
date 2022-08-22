import React from "react";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DeptModal from "../components/DeptModal";
import { Header } from "../components/Header";
import { DeptDrawerNavigationProp } from "../components/types";
import { useBeerContext } from "../store/store";
import { addDept as addDepts, setDept } from "../store/deptreducer";
import { useEffect } from "react";
import { useRef } from "react";
import db from "../database/db";

type Props = {
  navigation: DeptDrawerNavigationProp;
};

const Debt = ({ navigation }: Props) => {
  const {
    beers: { beers, depts },
    dispatch,
  } = useBeerContext();
  const [data, setData] = useState();
  const [visible, setVisible] = useState<boolean>(false);
  const isMountedRef: { current: boolean | undefined } = useRef();
  const addDept = (depts: {
    name: string;
    bottle:
      | {
          id: number;
          name: string;
          amount: number;
        }[]
      | [];
    dept: number;
    accusition: string;
  }) => {
    setVisible(false);
    dispatch(
      addDepts({
        ...depts,
        bottle: JSON.stringify(depts.bottle),
        date: new Date().toISOString().split("T")[0],
      })
    );
  };
  const fetchDept = async () => {
    const { rows } = await db.execute(
      "select name, sum(dept) as total from dept group by name;"
    );
    if (isMountedRef.current) setData(rows);
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchDept();
    return () => {
      isMountedRef.current = false;
    };
  }, [depts]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        title="Dept"
        children={null}
        openDrawer={() => navigation.openDrawer()}
      />
      <DeptModal
        visible={visible}
        hideModal={() => setVisible(false)}
        beer={beers}
        addDept={addDept}
      />
      <View style={{ margin: 5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 5,
          }}
        >
          <Text>Name</Text>
          <Text>Dept</Text>
          <Text>action</Text>
        </View>
        <View>
          <FlatList
            data={depts}
            keyExtractor={(item, index) => String(item.id)}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  backgroundColor: "white",
                  justifyContent: "space-between",
                  padding: 5,
                  elevation: 3,
                  borderRadius: 5,
                  marginVertical: 5,
                }}
                onPress={() =>
                  navigation.navigate("BedirDetail", { name: item.name })
                }
              >
                <Text>{item.name}</Text>
                <Text>{item.dept}</Text>
                <TouchableOpacity>
                  <Text style={{ color: "green" }}>Update</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.add} onPress={() => setVisible(true)}>
        <Text style={styles.addLogo}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Debt;

const styles = StyleSheet.create({
  add: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  addLogo: {
    fontSize: 36,
    color: "white",
  },
});
