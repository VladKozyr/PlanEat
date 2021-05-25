export const initialState = {
    jwt: "",
    accessToken: ""
};

export const TEST = "TEST";
export const DEFAULT = "DEFAULT";
export const SET_JWT = "SET_JWT";
export const SET_TOKEN = "SET_TOKEN";

export default function jwt(state = initialState, action) {
    switch (action.type) {
        case DEFAULT:
            return {
                ...state,
                jwt: '',
                accessToken: ''
            };
        case SET_JWT:
            window.localStorage.setItem("jwt", action.payload);
            return {
                ...state,
                jwt: action.payload
            };
        case SET_TOKEN:
            window.localStorage.setItem("access_token", action.payload);
            return {
                ...state,
                accessToken: action.payload
            };
        default:
            return state;
    }
}