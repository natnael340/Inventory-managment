import React, { useState } from "react";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import {
  beerType,
  LogDrawerNavigationProp,
  LogScreenRouteProp,
} from "../components/types";
import db from "../database/db";
import { useBeerContext } from "../store/store";

type Props = {
  navigation: LogDrawerNavigationProp;
  route: LogScreenRouteProp;
};

const LogScreen = ({ navigation, route }: Props) => {
  const {
    beers: { beers, logs },
  } = useBeerContext();
  let { date } = route.params || { date: "" };
  const [data, setData] = useState();
  const [extraData, setExtraData] = useState<{
    total: number;
    profit: number;
    amount: number;
    stock: number;
  }>();
  useEffect(() => {
    (async () => {
      const { rows } = await db.execute(
        "select l.id, l.amount, b.name, b.price, b.profit, b.stock, b.type  from log as l join beer as b on l.beer = b.id where l.date = ?",
        [date]
      );
      setData(rows);
      let [a, p, pr, s] = [0, 0, 0, 0];
      for (let r in rows) {
        a += rows[r].amount;
        p += rows[r].price * rows[r].amount;
        pr += rows[r].profit * rows[r].amount;
      }
      beers.map((b: beerType) => {
        s += b.stock;
      });
      setExtraData({
        total: Math.round((p + pr + Number.EPSILON) * 100) / 100,
        profit: Math.round((pr + Number.EPSILON) * 100) / 100,
        amount: a,
        stock: s,
      });
    })();
  }, [date, logs]);
  if (date !== "")
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Home"
          openDrawer={() => navigation.openDrawer()}
          children={null}
        />
        <Text
          style={{
            fontSize: 36,
            fontWeight: "bold",
            textAlign: "center",
            marginVertical: 10,
          }}
        >
          {date}
        </Text>
        <View
          style={{
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.7)",
            padding: 20,
            borderRadius: 5,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Amount</Text>
            <Text>{extraData?.amount}</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Profit</Text>
            <Text>{extraData?.profit}$</Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontWeight: "bold" }}>Stock</Text>
            <Text>{extraData?.stock}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderColor: "#777",
              borderWidth: 0.5,
              marginVertical: 5,
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>Total</Text>
            <Text>{extraData?.total}$</Text>
          </View>
        </View>
        <View style={{ marginVertical: 10, flex: 1 }}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => String(item.id)}
            renderItem={({ item, index }) => (
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  borderColor: "#0a75e4",
                  borderWidth: 1,
                  margin: 10,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 18, fontWeight: "300" }}>
                    {item.name}
                  </Text>
                  <Text>{item.stock}</Text>
                </View>
                <Text>Sold: {item.amount}</Text>
                <Text>
                  Price Earned: {(item.price + item.profit) * item.amount}
                </Text>
                <Text>Type: {item.type}</Text>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    );
  else return <View></View>;
};

export default LogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
