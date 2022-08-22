import React, {
  useState,
  useReducer,
  useContext,
  createContext,
  useEffect,
} from "react";
import db from "../database/db";
const Context = createContext();

//initialstate
const intialItems = [
  {
    id: 1,
    name: "Waliya",
    price: 25,
    type: "beer",
    profit: 3.5,
    totalBottle: 48,
    stock: 24,
    bottlePrice: 10,
  },
  {
    id: 2,
    name: "Bedele",
    price: 10,
    type: "beer",
    profit: 3.5,
    totalBottle: 48,
    stock: 24,
    bottlePrice: 10,
  },
  {
    id: 3,
    name: "Harrar",
    price: 5,
    type: "beer",
    profit: 3.5,
    totalBottle: 48,
    stock: 24,
    bottlePrice: 10,
  },
];
//actions

export const ADD_BEER = "ADD_BEER";
export const SET_BEER = "SET_BEER";
export const MODIFY_BEER = "MODIFY_BEER";
export const REMOVE_BEER = "REMOVE_BEER";

//ACTION CREATOR
export const addBeer = (payload) => ({ type: ADD_BEER, payload });
export const setBeer = (payload) => ({ type: ADD_BEER, payload });
export const modifyBeer = (payload) => ({ type: MODIFY_BEER, payload });
export const removeBeer = (payload) => ({ type: REMOVE_BEER, payload });

//reducer
export const beerReducer = (state, action) => {
  switch (action.type) {
    case ADD_BEER: {
      return { ...state, beers: [...state.beers, action.payload] };
    }
    case MODIFY_BEER: {
      return {
        ...state,
        beers: state.beers.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    }
    case REMOVE_BEER:
      return {
        ...state,
        beers: state.beers.filter((o) => o.id !== action.payload),
      };
    case SET_BEER:
      return action.payload;
    default:
      return state;
  }
};
/*
//middleware
const Beermiddleware = async (action, next) => {
  switch (action.type) {
    case ADD_BEER: {
      let { name, price, profit, type, totalBottle, stock, bottlePrice } =
        action.payload;
      const { insertId } = await db.execute(
        "insert into beer(name, price, profit, type, totalBottle, stock, bottlePrice) values (?,?,?,?,?,?,?);",
        [name, price, profit, type, totalBottle, stock, bottlePrice]
      );

      action.payload = { ...action.payload, id: insertId };
      console.log(action.payload);
      next(action);
      break;
    }
    case MODIFY_BEER: {
      let { id, price, profit, totalBottle, stock, bottlePrice } =
        action.payload;
      await db.execute(
        "update beer set price = ?, profit = ?, totalBottle = ?, stock = ?, bottlePrice = ? where id = ?;",
        [price, profit, totalBottle, stock, bottlePrice, id]
      );
      next(action);
      break;
    }
    default:
      break;
  }
};

const beerApiMiddleWare = (reducer, intialState, middleware) => {
  const [beers, dispatch] = useReducer(reducer, intialState);
  const dispatchWithMiddleware = (action) => {
    middleware(action, dispatch);
    //dispatch(action);
  };
  return { beers, dispatch: dispatchWithMiddleware };
};

//provider
const BeerProvider = (props) => {
  //const { rows } = await db.execute("select * from beer");
  //const [beers, dispatch] = useReducer(beerReducer, props.intialState);

  const beer = beerApiMiddleWare(
    beerReducer,
    props.intialState,
    Beermiddleware
  );

  return <Context.Provider value={beer} {...props} />;
};
//context
const useBeerContext = () => {
  return useContext(Context);
};

export { BeerProvider, useBeerContext };
*/
