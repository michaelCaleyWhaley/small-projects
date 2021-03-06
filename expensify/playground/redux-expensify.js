import { createStore, combineReducers } from "redux";
import uuid from "uuid";

// expenses action generators
const addExpense = ({
  description = "",
  note = "",
  amount = 0,
  createdAt = 0,
} = {}) => ({
  type: "ADD_EXPENSE",
  expense: {
    id: uuid(),
    description,
    note,
    amount,
    createdAt,
  },
});

const removeExpense = ({ id } = {}) => ({
  type: "REMOVE_EXPENSE",
  id,
});

const editExpense = (id, updates) => ({
  type: "EDIT_EXPENSE",
  id,
  updates,
});

// expenses reducer
// default state
const expensesReducerDefaultState = [];
const expensesReducer = (state = expensesReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_EXPENSE":
      return [...state, action.expense];
    case "REMOVE_EXPENSE":
      return state.filter(expense => expense.id !== action.id);
      return state;
    case "EDIT_EXPENSE":
      return state.map(currentValue => {
        if (currentValue.id === action.id) {
          return {
            ...currentValue,
            ...action.updates,
          };
        } else {
          return currentValue;
        }
      });
    default:
      return state;
  }
};

// filter action generators
const setTextFilter = (text = "") => ({ type: "SET_TEXT_FILTER", text });
const sortByAmount = () => ({ type: "SORT_BY_AMOUNT" });
const sortByDate = () => ({ type: "SORT_BY_DATE" });
const setStartDate = startDate => ({
  type: "SET_START_DATE",
  startDate,
});
const setEndDate = endDate => ({ type: "SET_END_DATE", endDate });
// filters reducers
const filtersReducerDefaultState = {
  text: "",
  sortBy: "amount", // date or amount
  startDate: undefined,
  endDate: undefined,
};
const filtersReducer = (state = filtersReducerDefaultState, action) => {
  switch (action.type) {
    case "SET_TEXT_FILTER":
      return { ...state, text: action.text };
    case "SORT_BY_AMOUNT":
      return { ...state, sortBy: "amount" };
    case "SORT_BY_DATE":
      return { ...state, sortBy: "date" };
    case "SET_START_DATE":
      const startDate = action.startDate;
      return { ...state, startDate };
    case "SET_END_DATE":
      const endDate = action.endDate;
      return { ...state, endDate };
    default:
      return state;
  }
};

// get visible expenses
const getVisibleExpenses = (expenses, { text, sortBy, startDate, endDate }) => {
  return expenses
    .filter(expense => {
      const startDateMatch =
        typeof startDate !== "number" || expense.createdAt >= startDate;
      const endDateMatch =
        typeof endDate !== "number" || expense.createdAt <= endDate;
      const textMatch =
        expense.description.toLowerCase().indexOf(text.toLowerCase()) !== -1;
      return startDateMatch && endDateMatch && textMatch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return a.createdAt < b.createdAt ? 1 : -1;
      } else if (sortBy === "amount") {
        return a.amount < b.amount ? 1 : -1;
      }
    });
};

// store creation
let store = createStore(
  combineReducers({
    expenses: expensesReducer,
    filters: filtersReducer,
  }),
);

store.subscribe(() => {
  const state = store.getState();
  const visibleExpenses = getVisibleExpenses(state.expenses, state.filters);
  console.log(`visibleExpenses: `, visibleExpenses);
});

store.dispatch(sortByAmount());

const expenseOne = store.dispatch(
  addExpense({ description: "Rent", amount: 736.0, createdAt: -1000 }),
);

const expenseThree = store.dispatch(
  addExpense({ description: "Phone", amount: 500.0, createdAt: 5000 }),
);

const expenseTwo = store.dispatch(
  addExpense({ description: "Meal deal", amount: 3.0, createdAt: 1000 }),
);


// store.dispatch(setTextFilter("eal"));
// store.dispatch(setStartDate(0));
// store.dispatch(setEndDate(1250));

// store.dispatch(removeExpense({ id: expenseTwo.expense.id }));
// store.dispatch(editExpense(expenseOne.expense.id, { amount: 500 }));
// store.dispatch(setTextFilter("house"));
// store.dispatch(setTextFilter());
// store.dispatch(sortByAmount());
// store.dispatch(sortByDate());

// store.dispatch(setStartDate(12523300));
// store.dispatch(setStartDate());

// store.dispatch(setEndDate(14523300));
// store.dispatch(setEndDate());

// store.dispatch(setStartDate(12523300));
// store.dispatch(setEndDate(14523300));
