import React, { Component } from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./login/Login";
import Profile from "./profile/Profile";

// This is a controller component that provides access and routing for the SPA Image Viewer and its 3 views viz.
// 1. Login Page ("/")
// 2. Home Page ("/home")
// 3. Profile Page ("/profile")
class Controller extends Component {
  constructor() {
    super();
    this.baseUrl = "https://graph.instagram.com/";
    //Please change the accessToken to change the account generated manaually from testing Instagram Account.
    //This access token will be used by login page to extract data from Insgragram API endpoints.
    this.accessToken = "IGQVJWZAl94eU5URE45WjhabFc5TmxpWV9MYUdoQl9vUFNybS1EQl9NRURySFRWbF9GMlhCa0R4UUZAvRFlZAaWIxam9SNzhBby1HZAGlIZAXAwVWdhZA2x1cnhCOXNfbXdNUzc3RFk4bmIweF81Y09PRUEwakF1eUp0cUxQYndz";
  }
  render() {
    return (
      <Router>
        <div className="root-container">
          {/* Route to each component. BaseUrl for Instagram endpoint is passed as prop to each component for its functioning */}
          <Route exact path="/" render={(props) => <Login {...props} baseUrl={this.baseUrl} accessToken={this.accessToken} />} />
          <Route exact path="/home" render={({ history }, props) => (<Home history={history} {...props} baseUrl={this.baseUrl} />)} />
          <Route exact path="/profile" render={({ history }, props) => (<Profile history={history} {...props} baseUrl={this.baseUrl} />)} />
        </div>
      </Router>
    );
  }
}

export default Controller;