export default function reducer(state = {}, action) {
    // "action" is the function we defined in "actions.js"
    // ALWAYS CONSOLE LOG THE ACTION!!!! \\
    console.log("action: ", action);

    if (action.type == "ADD_USER_DATA") {
        return { ...state, userData: action.userData };
    }

    if (action.type == "CHANGE_USER_IMAGE") {
        return { ...state, imageurl: action.imageurl };
    }

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

    if (action.type === "A_A") {
        console.log("usersLessons in reducerdfgfgfffdfdsafsadfsdafasfafdasf");
        return { ...state, usersLessons: action.data };
    }

    console.log("state in reducers.js", state);
    return state;
}
