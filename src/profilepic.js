import React from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";

export function ProfilePic(props) {
    console.log("profilepic props", props);

    return (
        <div onClick={() => props.toggleMenu()} className="profile-pic">
            ProfilePic and image
        </div>
    );
}
