// https://www.youtube.com/watch?v=YPgMnugXBJo
// React Authentication with Cookie

// react-router-dom exports DOM-aware components, like <Link> (which renders an <a>)
// and <BrowserRouter> (which interacts with the browser's window.history ).
// react-router-dom re-exports all of react-router's exports, so you only need
// to import from react-router-dom in your project.

import React from "react";
import "./styles.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from "react-router-dom";
import Cookies from "js-cookie";
import AuthApi from "./AuthApi";

const App = () => {
  const [auth, setAuth] = React.useState(false);

  const readCookie = () => {
    const user = Cookies.get("user");
    user === "loginTrue" ? setAuth(true) : setAuth(false);
  };

  React.useEffect(() => {
    readCookie();
  }, []);

  return (
    <div className="App">
      {/* <h2>Start editing to see some magic happen!</h2> */}
      {/* <Login />
      <Dashboard /> */}
      <AuthApi.Provider value={{ auth, setAuth }}>
        {/* you have to have the double brackets here.. */}
        <Router>
          <Routes />
        </Router>
      </AuthApi.Provider>
    </div>
  );
};

//login
const Login = () => {
  const Auth = React.useContext(AuthApi);
  console.log("auth...", Auth.auth);
  const handleOnClick = () => {
    Auth.setAuth(true);
    Cookies.set("user", "loginTrue");
  };

  return (
    <div>
      <h1>Hello CodeSandbox</h1>
      <h2>Please Login</h2>
      <button onClick={handleOnClick}>Login</button>
    </div>
  );
};

// dashboard, only visible when you are logged in.
const Dashboard = () => {
  const Auth = React.useContext(AuthApi);
  console.log("auth...", Auth.auth);
  const handleOnClick = () => {
    // console.log("auth...", Auth.auth);
    Auth.setAuth(false);
    // console.log("auth...", Auth.auth); // async ouch!  returns true
    Cookies.remove("user");
  };
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>You are logged in {String(Auth.auth)} </h2>
      <button onClick={handleOnClick}> Logout </button>
    </div>
  );
};

const Routes = () => {
  const Auth = React.useContext(AuthApi);
  return (
    <Switch>
      {/* <Route path="/login" component={Login} /> */}
      {/* <Route path="/" render={() => <Redirect to="/login" />} />   total fail*/}
      <ProtectedLogin path="/login" component={Login} auth={Auth.auth} />
      {/* <ProtectedLogin path="/" component={Login} auth={Auth.auth} />   still a fail*/}
      <ProtectedRoute
        path="/dashboard"
        component={Dashboard}
        auth={Auth.auth}
      />
    </Switch>
  );
};

const ProtectedRoute = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (auth ? <Component /> : <Redirect to="/login" />)}
    />
  );
};
const ProtectedLogin = ({ component: Component, auth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => (!auth ? <Component /> : <Redirect to="/dashboard" />)}
    />
  );
};

export default App;
