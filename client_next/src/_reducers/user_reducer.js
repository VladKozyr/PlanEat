import {ADD_RECIPE, AUTH_USER, DELETE_RECIPE, LOGIN_USER, LOGOUT_USER} from "../_actions/types";

let initialState = {
    isAuth: undefined,
    user: {}
};

export default function UR(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return {
                ...state,
                ...action.payload
            };
        case AUTH_USER:
            return {
                ...state,
                isAuth: true,
                ...action.payload
            };
        case LOGOUT_USER:
            window.localStorage.removeItem("jwt");
            window.localStorage.removeItem("access_token");
            return {
                ...state,
                user: {},
                isAuth: false,
            };
        case DELETE_RECIPE:
            const newIds = state.ids.splice(action.payload,1);
            return{
                ...state,
                ids: newIds
            }
        case ADD_RECIPE:
            return{
                ...state,
                ids:action.payload
            }
        default:
            return state;
    }
}