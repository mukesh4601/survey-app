
import React from "react";
import "./style.scss"
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import Reducers from "./Store/Reducers/index";
//  Routing Includes
import Login from "./components/welcome/welcome";
import PlayGround from "./components/Questionnaire/Questionnaire.jsx"


const history = createBrowserHistory();
const composeEnhancers =
  (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      trace: true,
      traceLimit: 25
    })) ||
  compose;
const store = createStore(Reducers, composeEnhancers(applyMiddleware(thunk)));


const routing = (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" component={() => { return <Login /> }} name="login" />
        <Route exact path="/playground" component={() => { return <PlayGround /> }} name="Play Area" />
      </div>
    </Router>
  </Provider>
);

ReactDOM.render(routing, document.querySelector('#app'));
serviceWorker.unregister();