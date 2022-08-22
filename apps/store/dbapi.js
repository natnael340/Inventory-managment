import db from "../database/db";
import { ADD_BEER, MODIFY_BEER } from "./Beerstore";
import { addDept, ADD_DEPT } from "./deptreducer";
import { ADD_LOG, CLEAR_LOG, modifyLog } from "./logreducer";

const apiMiddleware = async (state, action, next) => {
  switch (action.type) {
    case ADD_BEER: {
      let { name, price, profit, type, totalBottle, stock, bottlePrice } =
        action.payload;
      const { insertId } = await db.execute(
        "insert into beer(name, price, profit, type, totalBottle, stock, bottlePrice) values (?,?,?,?,?,?,?);",
        [name, price, profit, type, totalBottle, stock, bottlePrice]
      );

      action.payload = { ...action.payload, id: insertId };
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
    case ADD_LOG:
      let { beer, type, amount, price } = action.payload;
      let date = new Date().toISOString().split("T")[0];
      let p = state.logs.find((l) => l.beer == beer && l.date == date);
      if (p) {
        amount += p.amount;
        price += p.price;
        await db.execute(
          "update log set amount = ?, price = ? where beer=? and date=?",
          [amount, price, beer, date]
        );
        action.payload = { ...action.payload, id: p.id, amount, price };
        next(modifyLog(action.payload));
      } else {
        const { insertId } = await db.execute(
          "insert into log(beer, type, amount, price, date) values (?,?,?,?,?);",
          [beer, type, amount, price, date]
        );
        action.payload = { ...action.payload, id: insertId };
        next(action);
      }
      break;
    case CLEAR_LOG:
      await db.execute("delete from log");
      next(action);
      break;
    case ADD_DEPT:
      let { name, dept, accusition, bottle, date: de } = action.payload;
      console.log(name, dept, accusition, bottle, de);
      const { insertId } = await db.execute(
        "insert into dept(name,dept,bottle,accustion, date) values (?,?,?,?,?);",
        [name, dept, bottle, accusition, de]
      );
      action.payload = { ...action.payload, id: insertId };
      next(action);
      break;
    default:
      next(action);
      break;
  }
};

export const dbApiMiddleWare = (state, dispatch) => {
  const dispatchWithMiddleware = (action) => {
    apiMiddleware(state, action, dispatch);
    //dispatch(action);
  };
  return dispatchWithMiddleware;
};
