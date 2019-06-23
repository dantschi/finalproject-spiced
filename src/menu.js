import React from "react";
import { Link } from "react-router-dom";

export class Menu extends React.Component {
    constructor(props) {
        console.log("Menu props", props);
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="aside-menu">
                <Link to="/profile">
                    <p className="aside-menu-item">Profile</p>
                </Link>
                <Link to="/recorder" onClick={() => this.props.toggleMenu()}>
                    <p>Recorder</p>
                </Link>
                <Link to="/logout" onClick={() => this.props.toggleMenu()}>
                    <p className="aside-menu-item">Log out</p>
                </Link>
            </div>
        );
    }
}
