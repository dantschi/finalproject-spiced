import React from "react";

export class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // this.showProps = this.showProps.bind(this);
        // this.deleteAccount = this.deleteAccount.bind(this);
        console.log("profile this.props", this.props);
    }

    // showProps() {
    //     console.log("this.props in Profile: ", this.props);
    // }

    render() {
        return (
            <div className="profile-container">
                <h2>Edit profile</h2>
                <div>Personal data</div>
                <p>First</p>
                <p>Last</p>
                <p>Location</p>
                <p>Genres you like</p>
                <p>Bands you like</p>
                <p>Instruments you play</p>
                <p>
                    Anything else you want to share with others about yourself
                </p>
            </div>
        );
    }
}
