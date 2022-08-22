import React, { useEffect, useState } from "react";
import { useRef } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import CustomModal from "../components/LogModal";
import {
  beerType,
  HomeDrawerNavigationProp,
  logsType,
  logType,
} from "../components/types";
import db from "../database/db";
import { addBeer, removeBeer, setBeer, modifyBeer } from "../store/Beerstore";
import { addLog as addLogs, clearLog as clearLogs } from "../store/logreducer";
import { useBeerContext } from "../store/store";

type Props = {
  navigation: HomeDrawerNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [logids, setLogIds] = useState<number[]>();
  const [log, setLog] = useState<logsType[] | []>([]);
  const [hideModal, setHideModal] = useState<boolean>(true);
  const isMounted: { current: boolean | undefined } = useRef();
  let {
    beers: { beers, logs },
    dispatch,
  } = useBeerContext();
  const addLog = async (data: logType[]) => {
    setHideModal(true);
    let ids: number[] = [];
    for (let i in data) {
      /*const { insertId } = await db.execute(
        "insert into log(beer, type, amount, price, date) values (?,?,?,?,?);",
        [
          data[i].beer,
          data[i].type,
          data[i].amount,
          data[i].price,
          new Date().toISOString().split("T")[0],
        ]
      );
      ids.push(insertId);*/
      let l = {
        beer: data[i].beer,
        type: data[i].type,
        price: data[i].price,
        amount: data[i].amount,
        date: new Date().toISOString().split("T")[0],
      };
      dispatch(addLogs(l));
      let beer = beers.find((p: beerType) => p.id == data[i].beer);
      beer.stock = beer.stock - data[i].amount;
      dispatch(modifyBeer(beer));
    }
  };
  const clearLog = () => {
    dispatch(clearLogs());
  };
  const fetchLog = async () => {
    /*
    let dates: { date: string; id: number; total: number }[] = [];
    let d: { date: string; id: number; total: number } | undefined;
    for (let i in logs) {
      d = dates.find((o) => o.date == logs[i].date);
      if (d) {
        d.total += logs[i].price;
        dates = dates.map((p) => (p.date === d?.date ? d : p));
      } else
        dates = [
          ...dates,
          { total: logs[i].price, id: logs[i].id, date: logs[i].date },
        ];
    }*/
    const { rows } = await db.execute(
      "select id, sum(price) as total, date from log;"
    );
    if (isMounted.current && rows[0].total !== null) setLog(rows);
  };
  useEffect(() => {
    isMounted.current = true;
    fetchLog();
    return () => {
      isMounted.current = false;
    };
  }, [logs]);
  return (
    <SafeAreaView style={styles.container}>
      <CustomModal
        visible={!hideModal}
        addLog={addLog}
        hideModal={setHideModal}
        beer={beers}
      />
      <Header
        title="Home"
        openDrawer={() => navigation.openDrawer()}
        children={null}
      />
      <View style={styles.head}>
        <Text>Gebi</Text>
        <Text>Kene</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          data={log}
          keyExtractor={(item, index) => String(item.id)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.todoList}
              activeOpacity={0.5}
              onPress={() => navigation.navigate("Log", { date: item.date })}
            >
              <Text style={colors.white}>
                {Math.round((item.total + Number.EPSILON) * 100) / 100}$
              </Text>
              <Text style={colors.white}>{item.date}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.head}>
        <Text>Wechi</Text>
        <Text>Kene</Text>
      </View>
      <TouchableOpacity style={styles.add} onPress={() => setHideModal(false)}>
        <Text style={styles.addLogo}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const colors = StyleSheet.create({
  white: {
    color: "white",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  todoList: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginVertical: 1,
    padding: 10,
  },
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
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
