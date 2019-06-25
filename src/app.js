import React from "react";
import axios from "./axios";
import Header from "./header";
import ProfilePic from "./profilepic";
import { Menu } from "./menu";
import { connect } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { Recorder } from "./recorder";
import Profile from "./profile";
import { addUserData, getLessons } from "./actions";
import CreateLesson from "./createlesson";
import Lessons from "./lessons";
import Lesson from "./lesson";
import YourLessons from "./yourlessons";

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOnScreen: false
        };

        this.logout = this.logout.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    componentDidMount() {
        //getting user data when App mounts, and setting this.state.
        axios
            .get("/getuserdata")
            .then(rslt => {
                console.log(rslt.data);
                // this.setState(rslt.data);
                this.props.dispatch(addUserData(rslt.data));
                // console.log("App did mount:", this.state);
            })
            .catch(err => {
                console.log("app getuserdata error", err);
            });
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

    closeMenu() {
        this.setState({ menuOnScreen: false });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="app-wrapper">
                    <Header toggleMenu={this.toggleMenu} />
                    <div className="anything-else">
                        {this.state.menuOnScreen && (
                            <Menu toggleMenu={this.toggleMenu} />
                        )}
                        <div className="logout">
                            <img onClick={this.logout} src="/logout.svg" />
                        </div>
                    </div>
                    <Route
                        path="/profile"
                        render={props => <Profile closeMenu={this.closeMenu} />}
                    />
                    <Route
                        path="/recorder"
                        render={props => (
                            <Recorder closeMenu={this.closeMenu} />
                        )}
                    />
                    <Route
                        path="/create-lesson"
                        render={props => (
                            <CreateLesson closeMenu={this.closeMenu} />
                        )}
                    />
                    <Route
                        path="/lessons"
                        render={props => <Lessons closeMenu={this.closeMenu} />}
                    />
                    <Route
                        path="/lesson/:id"
                        render={props => (
                            <Lesson
                                closeMenu={this.closeMenu}
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route
                        path="/yourlessons"
                        render={props => (
                            <YourLessons closeMenu={this.closeMenu} />
                        )}
                    />
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (props, state) => {
    console.log("app redux state", state);
    if (!state.userData) {
        return {};
    } else {
        return {
            userData: state.userData
        };
    }
};

export default connect(mapStateToProps)(App);
