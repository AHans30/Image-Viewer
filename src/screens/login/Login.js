import React, { Component } from 'react';
import Header from '../../common/Header';
import './Login.css';
import { Link } from "react-router-dom";
import { Card, FormControl, FormHelperText, Typography, InputLabel, Input, Button } from '@material-ui/core/';

//This is Login component and provides the functionality of loggin a user in based on pre-set username and password
// { username: ahans30
//   password: password }
class Login extends Component {

    constructor() {
        super();
        this.state = {
            //To check if user is successfully logged into the application.
            isLoggedIn: window.sessionStorage.getItem("access-token") !== null ? true : false,
            username: "",
            usernameRequiredAlert: "dispNone",
            password: "",
            passwordRequiredAlert: "dispNone",
            incorrectCredentialsAlert: "dispNone"
        }
    }

    //Method used to catch value changes in username field of login form
    userNameChangeHandler = (event) => {
        this.setState({ username: event.target.value })
    }

    //Method used to catch value changes in password field of login form
    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value });
    }

    //Method run on login by the user. This validates the required fields and logs in user if entered user id and password
    // are same as mentioned above (and hard coded below).
    loginClickHandler = () => {
        this.setState({ incorrectCredentialsAlert: "dispNone" })

        let isInputFieldsValid = ((this.state.username !== "") && (this.state.password !== ""))

        this.state.username === "" ? this.setState({ usernameRequiredAlert: "dispBlock" }) : this.setState({ usernameRequiredAlert: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequiredAlert: "dispBlock" }) : this.setState({ passwordRequiredAlert: "dispNone" });

        let dummyUsername = "ahans30";
        let dummyPassword = "password";
        //accessToken passed from Controller as a prop
        let accessToken = this.props.accessToken;

        if ((this.state.username === dummyUsername) && (this.state.password === dummyPassword)) {
            //If password and username are validated - the access token is saved in session storage
            window.sessionStorage.setItem("access-token", accessToken);
            //The user is taken to home page on successful login
            this.props.history.push("/home");
        } else if (isInputFieldsValid) {
            this.setState({ incorrectCredentialsAlert: "dispBlock" })
        }
    }

    //Method called if the logged in user tries to direct to login page.
    redirectToHomeIfLoggedIn(){
        if(this.state.isLoggedIn){
            //User is redirected to homepage since s/he is already logged in
            this.props.history.push("/home")
        }
    }

    render() {
        return (
            <div>
                {this.redirectToHomeIfLoggedIn()}
                <Header />
                <div className="card-container">
                    <Card>
                        <div className="card-content">
                            <Typography variant="h5" component="h2">
                                LOGIN
                            </Typography>
                            <br />
                            <FormControl required>
                                <InputLabel htmlFor="username"> Username </InputLabel>
                                <Input id="username"
                                    type="text"
                                    username={this.state.username}
                                    onChange={this.userNameChangeHandler} />
                                <FormHelperText className={this.state.usernameRequiredAlert}>
                                    {/* If empty username is passed by user - a helper text is printed */}
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required>
                                <InputLabel htmlFor="Password"> Password </InputLabel>
                                <Input id="password"
                                    type="password"
                                    password={this.state.password}
                                    onChange={this.passwordChangeHandler} />
                                <FormHelperText className={this.state.passwordRequiredAlert}>
                                    {/* If empty password is passed by user - a helper text is printed */}
                                    <span className="red">required</span>
                                </FormHelperText>
                                <br />
                                <FormHelperText className={this.state.incorrectCredentialsAlert}>
                                    <span className="red">Incorrect username and/or password</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <Button component={Link} to={'/home'} variant="contained"  color="primary" onClick={this.loginClickHandler}>
                            LOGIN
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        )
    }
}

export default Login;