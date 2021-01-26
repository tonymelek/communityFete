import React, { useReducer } from "react";
import Login from "./components/Login";
import AppContext from "./utils/AppContext";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import Merchant from "./pages/Merchant";
import Checkout from "./pages/Checkout";
import OrderTracker from "./pages/OrderTacker";



export default function App() {



  const initialState = { token: '', user_email: '', basket: {}, role: '', orderTotal: 0, balance: 0, refreshAPI: true, display: { class: 'd-none', color: '', text: '' } };
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "update_token":
        return { ...state, token: action.token }
      case "update_balance":
        return { ...state, balance: action.balance }
      case "update_role":
        return { ...state, role: action.role }
      case "update_email":
        return { ...state, user_email: action.email }
      case "update_orderTotal":
        return { ...state, orderTotal: action.orderTotal }
      case "refreshAPI":
        return { ...state, refreshAPI: action.refreshAPI }
      case "updateBasket":
        return { ...state, basket: action.basket }
      case "notifier":
        return { ...state, display: action.display }
      default:
        return state;
    }
  }, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
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
            <Route path="/checkout">
              <Checkout />
            </Route>
            <Route path="/order-tracker">
              <OrderTracker />
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