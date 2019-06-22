import React from "react";
import axiops from "./axios";

export class App extends React.Component{
    constructor(props) {
        super(props);
        this.state={}
    }

    render() {
        return (
            <div>
                <h1>
                    App is on screen
                </h1>

            </div>
        )
    }
}