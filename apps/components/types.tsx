import { DrawerNavigationProp } from "@react-navigation/drawer";
import { RouteProp } from "@react-navigation/native";

export type RootDrawerParamList = {
  Home: undefined;
  Log: { date: string };
  Beers: undefined;
  Bedir: undefined;
  BedirDetail: { name: string };
};

export type HomeDrawerNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Home"
>;

export type DeptDrawerNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Bedir"
>;

export type DeptDetailDrawerNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "BedirDetail"
>;

export type LogDrawerNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Log"
>;
export type LogScreenRouteProp = RouteProp<RootDrawerParamList, "Log">;
export type DeptScreenRouteProp = RouteProp<RootDrawerParamList, "BedirDetail">;
export type BeersDrawerNavigationProp = DrawerNavigationProp<
  RootDrawerParamList,
  "Beers"
>;
export type beerType = {
  id: number | void;
  name: string;
  price: number;
  type: string;
  profit: number;
  totalBottle: number;
  stock: number;
  bottlePrice: number;
};
export type logsType = {
  id: number;
  total: number;
  date: string;
};
export type logType = {
  id: number;
  beer: number;
  amount: number;
  type: string;
  price: number;
  date: number;
};
