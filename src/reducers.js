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

    // if (action.type == "GET_CHAT_MESSAGES") {
    //     // console.log("action in get chat messages:", action.chatMessages);
    //     return {
    //         ...state,
    //         chatMessages: action.chatMessages.chatMessages.reverse()
    //     };
    // }
    //
    // if (action.type == "LAST_CHAT_MESSAGE") {
    //     // console.log("lastMessage in reducer: ", action.chatMessage);
    //     let temp = state.chatMessages;
    //
    //     return {
    //         ...state,
    //         chatMessages: temp.concat(action.chatMessage)
    //     };
    // }
    //in case of Foursquare copy
    // if (action.type == "ONLINE_USERS") {
    //     // console.log("onlineUsers in reducer: ", action.onlineUsers);
    //
    //     return {
    //         ...state,
    //         onlineUsers: action.onlineUsers
    //     };
    // }

    // if (action.type == "WALL_MESSAGES") {
    //     console.log("wallMessages in reducer ", action.wallMessages);
    //     return {
    //         ...state,
    //         wallMessages: action.wallMessages
    //     };
    // }
    console.log("state in reducers.js", state);
    return state;
}
