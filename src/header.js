import React from "react";
// import { Logo } from "./logo";
// import { ProfilePic } from "./profilepic";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfilePic from "./profilepic";
// import { BrowserRouter, Route } from "react-router-dom";

export function Header(props, toggleMenu) {
    // console.log("header props", props, toggleMenu);

    if (!props.userData) {
        return (
            <div className="loading">
                <img src="./Ajax-loader.gif" />
            </div>
        );
    } else {
        // console.log("header props", props);
        return (
            <header>
                <div className="header-content-container">
                    <Link to="/">
                        <div className="logo-container">
                            <img src="/logo.png" />
                        </div>
                    </Link>

                    <div className="header-links">
                        <div
                            onClick={() => props.toggleMenu()}
                            className="header-menu"
                        >
                            <ProfilePic
                                imageurl={props.userData.imageurl}
                                first={props.userData.first}
                                last={props.userData.last}
                            />
                            <p>{`${props.userData.first} ${
                                props.userData.last
                            }`}</p>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = (state, props) => {
    console.log("profilepic state, props", state, props);
    if (!state.userData) {
        return {};
    } else {
        return {
            userData: state.userData
        };
    }
};

export default connect(mapStateToProps)(Header);

// {props.match.url === "/lessons" && (
//     <input
//         name="searchField"
//         type="text"
//         placeholder="Search"
//         autoComplete="new-password"
//         required
//     />
// )}
