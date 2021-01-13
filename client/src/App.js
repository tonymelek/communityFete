import React, { useReducer } from "react";
import Login from "./components/Login";
import AppContext from "./utils/AppContext";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import Merchant from "./pages/Merchant";

export default function App() {
  const initialState = { token: '', basket: [], role: '', balance: 0 };
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update_token":
        return { ...state, token: action.token }
      case "update_balance":
        return { ...state, balnace: action.balance }
      case "update_role":
        return { ...state, role: action.role }
      default:
        return state;
    }
  }, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App container">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <Login />
            </Route>
            <Route path="/admin" >
              <Admin />
            </Route>
            <Route path="/user" >
              <User />
            </Route>
            <Route path="/merchant" >
              <Merchant />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}