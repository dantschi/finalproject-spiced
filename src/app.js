import React from "react";
import axios from "./axios";
import {Header} from "./header";
import { ProfilePic } from "./profilepic";
import { BrowserRouter, Route } from "react-router-dom";

export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={}


        this.logout = this.logout.bind(this);
    }


    async logout(e) {
        console.log("logout fires", e);
        this.setState({
            loggedIn: false
        });
        let rslt = await axios.post("/logout", { wantToLogout: true });
        console.log("/logout response from server", rslt);
        location.replace("/");
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app-wrapper">        
                    <Header />
                    <h1>
                       App is on screen
                    </h1>

                    <div className="logout">
                        <img onClick={this.logout} src="/logout.svg" />
                    </div>
                </div>
            </BrowserRouter>
        )
    }
}