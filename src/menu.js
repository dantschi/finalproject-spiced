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
                    <Link to="/lessons">
                        <li className="aside-menu-item">Lessons</li>
                    </Link>
                    <Link
                        to="/yourlessons"
                        // onClick={() => this.props.toggleMenu()}
                    >
                        <li className="aside-menu-item">Your lessons</li>
                    </Link>
                    <Link
                        to="/create-lesson"
                        // onClick={() => this.props.toggleMenu()}
                    >
                        <li className="aside-menu-item">Create lesson</li>
                    </Link>

                    <Link to="/profile">
                        <li className="aside-menu-item">Profile</li>
                    </Link>
                </ul>
            </div>
        );
    }
}
