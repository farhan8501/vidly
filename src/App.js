import React, { Component } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import Movies from "./components/movies";
import { Route, Redirect, Switch } from "react-router-dom";
import Rentals from "./components/rentals";
import Customers from "./components/customers";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import MovieForm from "./components/movieForm";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";
import auth from "./services/authService";
import ProtectedRoute from "./components/commons/protectedRoutes";
class App extends Component {
  state = {};
  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main>
          <Switch>
            <Route path="/login" component={LoginForm}></Route>
            <Route path="/logout" component={Logout}></Route>

            <Route path="/registerForm" component={RegisterForm}></Route>
            <ProtectedRoute path="/movies/:id" component={MovieForm} />
            <Route
              path="/movies"
              render={props => <Movies {...props} user={this.state.user} />}
            ></Route>

            <Route path="/customers" component={Customers}></Route>
            <Route path="/rentals" component={Rentals}></Route>
            <Route path="/not-found" component={NotFound}></Route>
            <Redirect from="/" exact to="/movies" />
            <Redirect to="/not-found" />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
