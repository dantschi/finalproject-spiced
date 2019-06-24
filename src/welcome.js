import React from "react";
import { HashRouter, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "./axios";

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        // this.handleChangeLogin = this.handleChangeLogin.bind(this);
    }

    handleChange(e) {
        console.log(
            "handlechangeregister target, value",
            e.target.name,
            e.target.value
        );
        console.log(this.state);
        this.setState({
            data: {
                ...this.state.data,
                [event.target.name]: event.target.value
            },
            error: ""
        });
    }

    // handleChangeLogin(e) {
    //     console.log("handlechangelogin target, value", e.target.name, e.target.value);
    //     console.log(this.state);

    //     this.setState({

    //             login: {
    //                 ...this.state.data,
    //                 [e.target.name]: e.target.value
    //             }

    //     })
    // }

    submitRegister() {
        console.log("submit register this.state.data", this.state.data);
        const { first, last, emailReg, password1, password2 } = this.state.data;
        console.log(first, last, emailReg, password1);

        if (!first || !last || !emailReg || !password1 || !password2) {
            console.log("field is empty");
            this.setState({ error: "Please fill every field!" });
        } else {
            if (password1 == password2) {
                console.log(
                    "passwords are identical",
                    first,
                    last,
                    emailReg,
                    password1
                );

                axios
                    .post("/register", { first, last, emailReg, password1 })
                    .then(rslt => {
                        console.log("register result", rslt);
                        if (rslt.data.success) {
                            location.replace("/");
                        } else {
                            this.setState({ error: rslt.data.error });
                        }
                    })
                    .catch(err => {
                        this.setState({ error: "Something went wrong" });
                    });
            } else {
                this.setState({ error: "Passwords must be identical" });
            }
        }
    }

    submitLogin() {
        console.log("sumbitLogin fires, state", this.state.data);
        const { email, password } = this.state.data;
        if (!email || !password) {
            console.log("field is empty");
            this.setState({ error: "Please fill every field!" });
        } else {
            axios
                .post("/login", { email, password })
                .then(rslt => {
                    console.log("login result", rslt);
                    location.replace("/");
                })
                .catch(err => {
                    console.log(err);
                    this.setState({ error: "Something went wrong" });
                });
        }
    }

    render() {
        return (
            <div className="welcome-wrapper">
                <div className="welcome-background"> </div>
                <div className="welcome-box">
                    <div className="register-box">
                        {this.state.error && (
                            <p className="error-message">{this.state.error}</p>
                        )}
                        <input
                            value={this.state.data.first}
                            name="first"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="First name"
                            autoComplete="new-password"
                            required
                        />
                        <input
                            name="last"
                            type="text"
                            onChange={this.handleChange}
                            placeholder="Last name"
                            autoComplete="new-password"
                            required
                        />

                        <input
                            value={this.state.data.emailReg}
                            name="emailReg"
                            type="email"
                            onChange={this.handleChange}
                            placeholder="Email address"
                            autoComplete="new-password"
                            required
                        />
                        <input
                            name="password1"
                            type="password"
                            onChange={this.handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />
                        <input
                            name="password2"
                            type="password"
                            onChange={this.handleChange}
                            placeholder="Password again"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            className="welcome-button"
                            onClick={() => this.submitRegister()}
                        >
                            Register
                        </button>
                    </div>

                    <div className="login-box">
                        {this.state.error && (
                            <p className="error-message">{this.state.error}</p>
                        )}
                        <input
                            value={this.state.data.email}
                            name="emailLogin"
                            type="email"
                            onChange={this.handleChange}
                            placeholder="Email address"
                            autoComplete="new-password"
                            required
                        />
                        <input
                            value={this.state.data.password}
                            name="password"
                            type="password"
                            onChange={this.handleChange}
                            placeholder="Password"
                            autoComplete="new-password"
                            required
                        />
                        <button
                            className="welcome-button"
                            onClick={() => this.submitLogin()}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
