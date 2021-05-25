import {DEFAULT, SET_JWT, SET_TOKEN} from "../_reducers/jwt_reducer";

export function setJwtToken(jwt) {
    return {
        type: SET_JWT,
        payload: jwt
    }
}

export function setAccessToken(token) {
    return {
        type: SET_TOKEN,
        payload: token
    }
}

export function setDefault() {
    return {
        type: DEFAULT
    }
}