//actions

import db from "../database/db";

export const ADD_LOG = "ADD_LOG";
export const MODIFY_LOG = "MODIFY_LOG";
export const REMOVE_LOG = "REMOVE_LOG";
export const CLEAR_LOG = "CLEAR_LOG";

//ACTION CREATOR
export const addLog = (payload) => ({ type: ADD_LOG, payload });
//export const setLog = (payload) => ({ type: ADD_LOG, payload });
export const modifyLog = (payload) => ({ type: MODIFY_LOG, payload });
export const removeLog = (payload) => ({ type: REMOVE_LOG, payload });
export const clearLog = () => ({ type: CLEAR_LOG });

//reducer
export const logReducer = (state, action) => {
  console.log("action in logreducer", action);
  switch (action.type) {
    case ADD_LOG:
      return { ...state, logs: [...state.logs, action.payload] };
    case MODIFY_LOG:
      return {
        ...state,
        logs: state.logs.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case REMOVE_LOG:
      return {
        ...state,
        logs: state.logs.filter((o) => o.id !== action.payload),
      };
    case CLEAR_LOG:
      return {
        ...state,
        logs: [],
      };
    default:
      return state;
  }
};

const logMiddleware = async (state, action, next) => {
  switch (action.type) {
    case ADD_LOG:
      let { beer, type, amount, price } = action.payload;
      let date = new Date().toISOString().split("T")[0];
      p = state.find((l) => l.beer == beer && p.date == date);
      if (p) {
        await db.execute(
          "update log set amount = ?, price = ?, where beer=? and date=?",
          [amount, price, beer, date]
        );
        next(modifyLog(action.payload));
      } else {
        await db.execute(
          "insert into log(beer, type, amount, price, date) values (?,?,?,?,?);",
          [beer, type, amount, price, date]
        );
        next(action);
      }
  }
};
