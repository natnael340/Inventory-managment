import React, { createContext, useContext, useReducer } from "react";
import { combineReducers } from "./combineReducer";
import { dbApiMiddleWare } from "./dbapi";
import { beerReducer } from "./Beerstore";
import { logReducer } from "./logreducer";
import { deptReducer } from "./deptreducer";

const rootReducer = combineReducers({
  beers: beerReducer,
  logs: logReducer,
  depts: deptReducer,
});

const Context = createContext();

const BeerProvider = (props) => {
  ///const { rows } = await db.execute("select * from beer");
  const [beers, dispatch] = useReducer(rootReducer, props.intialState);

  const disp = dbApiMiddleWare(beers, dispatch);

  const beer = { beers, dispatch: disp };
  return <Context.Provider value={beer} {...props} />;
};
//context
const useBeerContext = () => {
  return useContext(Context);
};

export { BeerProvider, useBeerContext };
