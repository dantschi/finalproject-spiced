import React from "react";
import { HashRouter, Route } from "react-router-dom";
import {Link } from "react-router-dom";
import axios from "./axios";

export class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data: {},
            error: ""
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log("handlechange target, valuie", e.target.name, e.target.value);
        
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            error: ""
        })
    }

    submitRegister() {
        console.log("submit register this.state.data", this.state.data);
        const {fn,ln,em,pw1,pw2} = this.state.data;
        if (!fn || !ln || !em || !pw1 || !pw2) {
            console.log("field is empty");
            this.setState({error: "Please fill every field!"})

        } else {
            if (pw1==pw2) {
                axios.post("/register", {fn,ln,em,pw}).then(rslt=>{
                    console.log("register result");
                    if (rslt.data.success) {
                        location.replace("/");
                    } else {
                        this.setState({error:rslt.data.error})
                    }
                    
                }).catch(err=>{
                    this.setState({error: "Something went wrong"});
                })
            } else {
                this.setState({error: "Passwords must be identical"})
            }
        }
    }

    submitLogin() {
        console.log("sumbitLogin fires, state", this.state.data);
        
    }

    render() {
        return(
            <div className="welcome-wrapper">
                <div className="register-box">
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
                <input
                    name="fn"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="First name"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="ln"
                    type="text"
                    onChange={this.handleChange}
                    placeholder="Last name"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="em"
                    type="email"
                    onChange={this.handleChange}
                    placeholder="Email address"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="pw1"
                    type="password"
                    onChange={this.handleChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="pw2"
                    type="password"
                    onChange={this.handleChange}
                    placeholder="Password again"
                    autoComplete="new-password"
                    required
                />

                <button onClick={() => this.submitRegister()}>Register</button>

                </div>

                <div className="login-box">
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
                <input
                    name="em"
                    type="email"
                    onChange={this.handleChange}
                    placeholder="Email address"
                    autoComplete="new-password"
                    required
                />
                <input
                    name="pw"
                    type="password"
                    onChange={this.handleChange}
                    placeholder="Password"
                    autoComplete="new-password"
                    required
                />
                <button onClick={() => this.submitLogin()}>Login</button>
                </div>



            </div>
        )
    }
}