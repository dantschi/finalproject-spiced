import React from "react";
import { connect } from "react-redux";
import { getLessons } from "./actions";
import axios from "./axios";

export class Lessons extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {
        axios
            .get("/get-lessons")
            .then(rslt => {
                console.log(rslt);
                this.props.dispatch(getLessons(rslt));
            })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        if (!props.lessons) {
            return (
                <div className="loading">
                <img src="./Ajax-loader.gif" />
                </div>

            )
        } else {
            return(
                <div className="lessons-container">
                {!!props.lessons.length&&
                    props.lessons.map(lesson=>(
                        <div className="lesson-box" key={lesson.id}>
                            <div className="lesson-">
                                <h3>Lesson #{lesson.id}</h3>
                                <p>{lesson.title}</p>
                                <p>{lesson.description}</p>


                            </div>
                        </div>

                    ))
                }

                <div>
            )

        }
    }
}

const mapStateToProps = state => {
    console.log("profile state, props", state);
    if (!state.lessons) {
        return {};
    } else {
        return {
            lessons: state.lessons
        };
    }
};

export default connect(mapStateToProps)(Lessons);
