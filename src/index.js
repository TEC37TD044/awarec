import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
// import RtlLayout from "layouts/RTL.js";
import AdminLayout from "layouts/Admin.js";

import "assets/scss/material-dashboard-pro-react.scss?v=1.10.0";
import { AuthUserProvider } from "hooks/useAuth";
import AuthenticationContext from "components/AuthenticationContext";

ReactDOM.render(
  <BrowserRouter>
    <AuthUserProvider>
      <Switch>
        <AuthenticationContext>
          <Route path="/auth" component={AuthLayout} />
          <Route path="/admin" component={AdminLayout} />
          <Redirect from="/" to="/admin/my-assets" />
        </AuthenticationContext>
      </Switch>
    </AuthUserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
