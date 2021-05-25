import {applyMiddleware, createStore} from "redux";
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './src/_reducers/index';
import {composeWithDevTools} from 'redux-devtools-extension';
import {useMemo} from "react";

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore);


export function initStore() {
    return createStoreWithMiddleware(Reducer, composeWithDevTools(applyMiddleware()))
}

export function useStore(initialState) {
    return useMemo(() => initStore(), [initialState])
}