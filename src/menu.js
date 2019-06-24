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
                <ul className="menu-list">
                    <Link to="/profile">
                        <li className="aside-menu-item">Profile</li>
                    </Link>
                    <Link
                        to="/create-lesson"
                        onClick={() => this.props.toggleMenu()}
                    >
                        <li className="aside-menu-item">Create lesson</li>
                    </Link>
                    <Link
                        to="/recorder"
                        onClick={() => this.props.toggleMenu()}
                    >
                        <li>Recorder</li>
                    </Link>
                    <Link to="/logout" onClick={() => this.props.toggleMenu()}>
                        <li className="aside-menu-item">Log out</li>
                    </Link>
                </ul>
            </div>
        );
    }
}
