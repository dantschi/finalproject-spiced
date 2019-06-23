export default function reducer(state = {}, action) {
    // "action" is the function we defined in "actions.js"
    // ALWAYS CONSOLE LOG THE ACTION!!!! \\
    console.log("action: ", action);

    if (action.type == "ADD_USER_DATA") {
        return { ...state, userData: action.userData };
    }

    if (action.type == "CHANGE_USER_INFO") {
        return { ...state, userData: action.userData };
    }

    if (action.type == "GET_CHAT_MESSAGES") {
        // console.log("action in get chat messages:", action.chatMessages);
        return {
            ...state,
            chatMessages: action.chatMessages.chatMessages.reverse()
        };
    }

    if (action.type == "LAST_CHAT_MESSAGE") {
        // console.log("lastMessage in reducer: ", action.chatMessage);
        let temp = state.chatMessages;

        return {
            ...state,
            chatMessages: temp.concat(action.chatMessage)
        };
    }

    if (action.type == "ONLINE_USERS") {
        // console.log("onlineUsers in reducer: ", action.onlineUsers);

        return {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

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
