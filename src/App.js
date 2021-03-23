import React from "react";
import { Switch, Route } from "react-router-dom";

import ROUTES from "./utils/routes";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUpContainer from "./redux/containers/pages/SignUpContainer";
import Recipe from "./pages/Recipe";

function App() {
  return (
    <Switch>
      <Route path={ROUTES.LOGIN}>
        <Login />
      </Route>
      <Route path={ROUTES.SIGNUP}>
        <SignUpContainer />
      </Route>
      <Route path={ROUTES.RECIPE}>
        <Recipe />
      </Route>
      <Route path={ROUTES.HOME} exact>
        <Home />
      </Route>
    </Switch>
  );
}

export default App;
