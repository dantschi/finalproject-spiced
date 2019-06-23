import React from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";

export function ProfilePic({ props, imageurl, firstname, lastname }) {
    // console.log("profilepic props", props);

    return (
        <div onClick={() => props.toggleMenu()} className="profile-pic">
            <img src={imageurl} alt={`${firstname} ${lastname}`} />
        </div>
    );
}

const mapStateToProps = (state, props) => {
    return {};
};

export default connect(mapStateToProps)(ProfilePic);
