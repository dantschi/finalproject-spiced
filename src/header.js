import React from "react";
// import { Logo } from "./logo";
// import { ProfilePic } from "./profilepic";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ProfilePic from "./profilepic";

export function Header(props) {
    console.log("header props", props);

    return (
        <header>
            <div className="header-content-container">
                <Link to="/">
                    <div className="logo-container">Logo</div>
                </Link>
                <div className="header-links">
                    <div className="header-menu">
                        <ProfilePic toggleMenu={props.toggleMenu} />
                    </div>
                </div>
            </div>
        </header>
    );
}

const mapStateToProps = state => {
    console.log("redux state header");
    return {};
};

export default connect(mapStateToProps)(Header);
