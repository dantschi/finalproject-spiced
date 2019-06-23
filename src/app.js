import React from "react";
import axios from "./axios";
import Header from "./header";
import { ProfilePic } from "./profilepic";
import { Menu } from "./menu";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { Recorder } from "./recorder";
import { Profile } from "./profile";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOnScreen: false
        };

        this.logout = this.logout.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    componentDidMount() {
        //getting user data when App mounts, and setting this.state.
        // axios
        //     .get("/getuserdata")
        //     .then(rslt => {
        //         console.log(rslt.data);
        //         this.setState(rslt.data);
        //         // console.log("App did mount:", this.state);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
        //
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

    toggleMenu(e) {
        console.log("togglemenu", e);

        this.state.menuOnScreen
            ? this.setState({ menuOnScreen: false })
            : this.setState({ menuOnScreen: true });
        console.log(this.state);
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app-wrapper">
                    <Header toggleMenu={this.toggleMenu} />
                    <div className="anything-else">
                        <h1>App is on screen</h1>
                        {this.state.menuOnScreen && <Menu />}
                        <div className="logout">
                            <img onClick={this.logout} src="/logout.svg" />
                        </div>
                    </div>
                    <Route path="/profile" component={Profile} />
                    <Route path="/recorder" component={Recorder} />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    console.log(state);
    return {};
};

export default connect(mapStateToProps)(App);
