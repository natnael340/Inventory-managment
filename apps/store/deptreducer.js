export const ADD_DEPT = "ADD_DEPT";
export const MODIFY_DEPT = "MODIFY_DEPT";
export const REMOVE_DEPT = "REMOVE_DEPT";

//ACTION CREATOR
export const addDept = (payload) => ({ type: ADD_DEPT, payload });
export const setDept = (payload) => ({ type: ADD_DEPT, payload });
export const modifyDept = (payload) => ({ type: MODIFY_DEPT, payload });
export const removeDept = (payload) => ({ type: REMOVE_DEPT, payload });

//reducer
export const deptReducer = (state, action) => {
  switch (action.type) {
    case ADD_DEPT:
      return { ...state, depts: [...state.depts, action.payload] };
    case MODIFY_DEPT:
      return {
        ...state,
        depts: state.depts.map((o) =>
          o.id === action.payload.id ? action.payload : o
        ),
      };
    case REMOVE_DEPT:
      return {
        ...state,
        depts: state.depts.filter((o) => o.id !== action.payload),
      };
    default:
      return state;
  }
};
