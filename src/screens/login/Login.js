import React, { Component } from 'react';
import Header from '../../common/Header';
import './Login.css';
import { Link } from "react-router-dom";

import { Card, FormControl, FormHelperText, Typography, InputLabel, Input, Button } from '@material-ui/core/';

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: "",
            usernameRequiredAlert: "dispNone",
            password: "",
            passwordRequiredAlert: "dispNone",
            incorrectCredentialsAlert: "dispNone"
        }
    }

    userNameChangeHandler = (event) => {
        this.setState({ username: event.target.value })
    }

    passwordChangeHandler = (event) => {
        this.setState({ password: event.target.value });
    }

    loginClickHandler = () => {
        this.setState({ incorrectCredentialsAlert: "dispNone" })

        let isInputFieldsValid = ((this.state.username !== "") && (this.state.password !== ""))

        this.state.username === "" ? this.setState({ usernameRequiredAlert: "dispBlock" }) : this.setState({ usernameRequiredAlert: "dispNone" });
        this.state.password === "" ? this.setState({ passwordRequiredAlert: "dispBlock" }) : this.setState({ passwordRequiredAlert: "dispNone" });

        let dummyUsername = "ahans30";
        let dummyPassword = "password";
        let accessToken = "IGQVJXT25DbGxkbnVILVk5WVFkSlQxaWdHUWZAwNW1yZA1dBZAUF1NHJmSUN6eE5MQkExdDZAxVGtZANFRXWmcybGhFOUI3emxkWXQ1MEpWeTU2VkFjZAGhiSWxTQnNER05valljYnFEUUF1ZAjBvMEM4NDhpSFpYSEdjWUdnUzZAr";

        if ((this.state.username === dummyUsername) && (this.state.password === dummyPassword)) {
            window.sessionStorage.setItem("access-token", accessToken);
            this.props.history.push("/home");
        } else if (isInputFieldsValid) {
            this.setState({ incorrectCredentialsAlert: "dispBlock" })
        }
    }

    render() {
        return (
            <div>
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