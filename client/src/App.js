import React, { useReducer } from "react";
import Login from "./components/Login";
import AppContext from "./utils/AppContext";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import User from "./pages/User";

export default function App() {
  const initialState = { token: '', basket: [] };
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update_token":
        return { ...state, token: action.token }
      case "subtract":
        return
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
            <Route path="/admin" exact>
              <Admin />
            </Route>
            <Route path="/user" exact>
              <User />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  );
}