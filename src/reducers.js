export default function reducer(state = {}, action) {
    // "action" is the function we defined in "actions.js"
    // ALWAYS CONSOLE LOG THE ACTION!!!! \\
    console.log("action: ", action);

    if (action.type == "ADD_USER_DATA") {
        return { ...state, userData: action.userData };
    }

    if (action.type == "CHANGE_USER_IMAGE") {
        return { ...state.userData, imageurl: action.imageurl };
    }

    // if (action.type=="CHANGE_USER_DATA") {
    //     console.log("change user data in reducers", action.data);
    //     return { ...state.userData}
    // }

    if (action.type == "GET_LESSONS") {
        console.log("action.lessons in reducers", action.lessons);
        return { ...state, lessons: action.lessons.data };
    }

    if (action.type == "NEW_LESSON") {
        if (!state.lessons) {
            // let temp = [].push();
            return { ...state, lessons: [action.lesson] };
        } else {
            let temp = state.lessons;
            temp.unshift(action.lesson);

            return { ...state, lessons: temp };
        }
    }

    if (action.type == "USERS_LESSONS") {
        console.log("usersLessons in r", action);
        return { ...state, usersLessons: action.lessons };
    }

    if (action.type == "OWN_LESSONS") {
        if (!state.ownLessons) {
            return { ...state, ownLessons: action.lessons };
        } else {
            let temp = state.ownLessons;
            temp.concat(action.lessons);
            return { ...state, ownLessons: temp };
        }
        // console.log("usersLessons in r", action);
        // return { ...state, usersLessons: action.lessons };
    }

    console.log("state in reducers.js", state);
    return state;
}
