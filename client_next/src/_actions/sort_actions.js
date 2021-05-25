import {
    SET_FILTER_CALORIES,
    SET_FILTER_PRODUCTS,
    SET_FILTER_TIME,
    SET_FILTER_UTENSILS,
    GET_INITIAL,
    SET_RECIPES,
    SORT_BY_CALORIES,
    SORT_BY_PRODUCTS,
    SORT_BY_TIME,
    SORT_BY_UTENSILS,
    SET_CATEGORY,
    FILTER_BY_TIME,
    FILTER_BY_CALORIES,
    FILTER_BY_TIME_AND_CALORIES,
    SET_FILTER_RANGE
} from "./sort_types";
import gql from "graphql-tag";
import Client from "../../lib/apollo"

const QUERY = gql`query 
    getFilteredRecipes($category:String, $products: [String], $utensils: [String]){
            recipes(where: {
              category: $category
              products: {
                name: $products
              },
              utensils: {
                name: $utensils
              }
            }){
            id
            slug
            calories
            time
            recipeCaption
            recipeImage{
                url
            }
            category
            products {
                name
                icon {
                    url
                }
            }
            utensils {
                name
                icon {
                    url
                }
            }
        }
    }`;

export function setCategory(category) {
    return {
        type: SET_CATEGORY,
        payload: category
    }
}

export function setRecipes(recipes) {
    return {
        type: SET_RECIPES,
        payload: recipes
    }
}

export function fetchRecipes() {

    return (dispatch, getState) => {
        const state = getState().recipesReducer;
        let vars = {
            products: state.products.map((product) => product.name),
            utensils: state.utensils.map((utensil) => utensil.name)
        };
        if (state.category !== "all") vars.category = state.category;
        Client.query({query: QUERY, variables: vars})
            .then(({data}) => {
                let recipes = data.recipes;
                console.log(recipes);
                dispatch({
                    type: SET_FILTER_RANGE,
                    payload: {
                        time: getFilterRange(recipes, getTime),
                        calories: getFilterRange(recipes, getCalories)
                    }
                });
                dispatch({
                    type: SET_RECIPES,
                    payload: recipes
                });
                dispatch({
                    type: state.sort,
                    payload: null
                })
            })
    }
}

export function getInitial() {
    return {
        type: GET_INITIAL,
        payload: undefined
    }
}


export function filterByProducts(products) {
    return {
        type: SET_FILTER_PRODUCTS,
        payload: products
    }
}

export function filterByUtensils(utensils) {
    return {
        type: SET_FILTER_UTENSILS,
        payload: utensils
    }
}

export function filterByTime(minTime, maxTime) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_FILTER_TIME,
            payload: {
                min: minTime,
                max: maxTime
            }
        });
        dispatch({
            type: FILTER_BY_TIME_AND_CALORIES,
            payload: null
        });
        dispatch({
            type: getState().recipesReducer.sort,
            payload: null
        });
    }
}

export function filterByCalories(minCalories, maxCalories) {
    return (dispatch, getState) => {
        dispatch({
            type: SET_FILTER_CALORIES,
            payload: {
                min: minCalories,
                max: maxCalories
            }
        });
        dispatch({
            type: FILTER_BY_TIME_AND_CALORIES,
            payload: null
        });
        dispatch({
            type: getState().recipesReducer.sort,
            payload: null
        });
    }
}

export function sortByTime() {
    return {
        type: SORT_BY_TIME,
        payload: undefined
    }
}

export function sortByCalories() {
    return {
        type: SORT_BY_CALORIES,
        payload: undefined
    }
}

export function sortByProducts() {
    return {
        type: SORT_BY_PRODUCTS,
        payload: undefined
    }
}

export function sortByUtensils() {
    return {
        type: SORT_BY_UTENSILS,
        payload: undefined
    }
}

const getFilterRange = (recipes, getParamFunction) => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < recipes.length; i++) {
        let param = getParamFunction(recipes[i]);
        if (param < min) min = param;
        if (param > max) max = param;
    }

    return {
        min, max
    };
};
const getTime = product => product.time;
const getCalories = utensil => utensil.calories;