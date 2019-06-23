import React from "react";

// import { Link } from "react-router-dom";
import { connect } from "react-redux";

export function ProfilePic(props) {
    // console.log("profilepic props", props.userData);

    if (!props.userData) {
        return (
            <div className="loading">
                <img src="./Ajax-loader.gif" />
            </div>
        );
    } else {
        return (
            <div className="profile-pic-container">
                <img
                    className="profilepic"
                    src={props.userData.imageurl}
                    alt={`${props.userData.first} ${props.userData.last}`}
                />
            </div>
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

export default connect(mapStateToProps)(ProfilePic);
