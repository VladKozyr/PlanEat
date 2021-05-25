import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER, DELETE_RECIPE, ADD_RECIPE,
} from './types';
import axios from "axios";
import {setAccessToken, setJwtToken} from "./jwt_actions";
import {BACKEND_URL} from "../../config";

export function registerUser(dataToSubmit) {
    //make request here

    return {
        type: REGISTER_USER,
        payload: null
    }
}

export function loginUser(user) {

    return {
        type: LOGIN_USER,
        payload: user
    }
}

export function auth(accessToken) {

    return (dispatch) => {
        return axios({
            method: "GET",
            url: `${BACKEND_URL}/auth/google/callback?${accessToken}`,
        })
            .then(res => res.data)
            .then(res => {
                dispatch(setJwtToken(res.jwt));
                dispatch(setAccessToken(accessToken));
                dispatch({
                    type: AUTH_USER,
                    payload: res.user
                });
                res.isAuth = true;
                return res;
            })
    };
}

export function deleteRecipe(id) {
    return (dispatch, getState) => {

        const state = getState();
        let ids = state.user.ids;
        const jwt = state.jwt.jwt;
        const userId = state.user.id;
        let index = ids.indexOf(parseInt(id));
        ids.splice(index,1);

        return axios.put(`${BACKEND_URL}/users/${userId}`, {ids: ids}, {
            headers: {
                'Authorization': `Bearer ${jwt}`
            }
        }).then(res => {
            dispatch({
                type: DELETE_RECIPE,
                payload: index
            })
        })
    }
}

export function addRecipe(id){
    return (dispatch, getState) => {

        const state = getState();
        let ids = state.user.ids;
        if(ids === null)
            ids = [];
        ids.push(parseInt(id));
        const jwt = state.jwt.jwt;
        const userId = state.user.id;

        return axios.put(`${BACKEND_URL}/users/${userId}`, {ids: ids}, {
            headers: {
                'Authorization': `Bearer ${jwt}`}
        }).then(res => {
            dispatch({
                type: ADD_RECIPE,
                payload: ids
            })
        })
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
        payload: null
    }
}