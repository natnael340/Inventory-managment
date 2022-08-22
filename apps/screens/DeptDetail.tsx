import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import {
  DeptDetailDrawerNavigationProp,
  DeptScreenRouteProp,
} from "../components/types";
import { useBeerContext } from "../store/store";

type Props = {
  navigation: DeptDetailDrawerNavigationProp;
  route: DeptScreenRouteProp;
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
  date: string;
}[];
type Deptsss =
  | {
      name: string;
      bottle: string;
      dept: number;
      accusition: string;
      date: string;
    }[]
  | [];
const DeptDetail = ({ navigation, route }: Props) => {
  let { name } = route.params || { name: "" };
  const [data, setData] = useState<DeptsType | []>([]);
  const {
    beers: { depts },
  }: { beers: { depts: Deptsss } } = useBeerContext();
  useEffect(() => {
    let p: DeptsType = depts
      .filter((d) => d.name === name)
      .map((b) => ({ ...b, bottle: JSON.parse(b.bottle) }));
    if (p) setData(p);
  }, [name, depts]);
  if (name && name !== "")
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title={name?.toUpperCase() || ""}
          openDrawer={() => navigation.openDrawer()}
          children={
            <View>
              <Text>Delete</Text>
            </View>
          }
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            elevation: 3,
            backgroundColor: "white",
            marginBottom: 10,
          }}
        >
          <View>
            <Text>Total Dept</Text>
            <Text>Total bottle</Text>
          </View>
          <View>
            <Text>
              {data.reduce((a: number, b: { dept: number }) => {
                return a + b.dept;
              }, 0)}
            </Text>
            <Text>
              {data.reduce((a: number, b: { bottle: { amount: number }[] }) => {
                let x = b.bottle.reduce((c: number, d: { amount: number }) => {
                  return c + d.amount;
                }, 0);
                return a + x;
              }, 0)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  else return <View></View>;
};

export default DeptDetail;

const styles = StyleSheet.create({});
