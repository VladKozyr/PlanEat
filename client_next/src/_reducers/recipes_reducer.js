import {
    SET_FILTER_PRODUCTS,
    SET_FILTER_TIME,
    SET_FILTER_UTENSILS,
    SET_RECIPES,
    SORT_BY_UTENSILS,
    SORT_BY_CALORIES,
    SORT_BY_PRODUCTS,
    SORT_BY_TIME,
    SET_FILTER_CALORIES,
    GET_INITIAL,
    FETCH_RECIPES,
    SET_CATEGORY,
    FILTER_BY_TIME,
    FILTER_BY_CALORIES,
    FILTER_BY_TIME_AND_CALORIES, SET_FILTER_RANGE
} from "../_actions/sort_types";

const initialState = {
    category: "",
    recipes: [],
    filteredRecipes: [],
    products: [],
    utensils: [],
    sort: SORT_BY_TIME,
    range: {
        time: {
            min: 0,
            max: 1000
        },
        calories: {
            min: 0,
            max: 1000
        }
    },
    time: {
        min: 0,
        max: 1000
    },
    calories: {
        min: 0,
        max: 1000
    }
};

const recipesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_RECIPES:
            return state;

        case SET_CATEGORY:
            return {
                ...state,
                category: action.payload
            };

        case SET_RECIPES:
            let recipes = action.payload;
            return {
                ...state,
                recipes,
                filteredRecipes: recipes
            };

        case GET_INITIAL:
            return {
                ...initialState
            };

        case SET_FILTER_PRODUCTS:
            return {
                ...state,
                products: action.payload
            };

        case SET_FILTER_UTENSILS:
            return {
                ...state,
                utensils: action.payload
            };

        case SET_FILTER_TIME:
            return {
                ...state,
                time: action.payload
            };

        case SET_FILTER_CALORIES:
            return {
                ...state,
                calories: action.payload
            };

        case SET_FILTER_RANGE:
            return {
                ...state,
                range: action.payload
            };

        case FILTER_BY_TIME_AND_CALORIES:
            let timeParams = state.time;
            let caloriesParams = state.calories;
            let filteredByTime = state.recipes.filter((recipe) => {
                return recipe.time >= timeParams.min && recipe.time <= timeParams.max;
            });
            console.log(filteredByTime);
            let filteredByCalories = filteredByTime.filter((recipe) => {
                return recipe.calories >= caloriesParams.min && recipe.calories <= caloriesParams.max;
            });
            console.log(filteredByCalories);
            return {
                ...state,
                filteredRecipes: filteredByCalories
            };

        case SORT_BY_TIME:
            return {
                ...state,
                sort: SORT_BY_TIME,
                filteredRecipes: [...state.filteredRecipes].sort((a, b) => {
                    return a.time - b.time
                })
            };
        case SORT_BY_CALORIES:
            return {
                ...state,
                sort: SORT_BY_CALORIES,
                filteredRecipes: [...state.filteredRecipes].sort((a, b) => {
                    return a.calories - b.calories
                })
            };
        case SORT_BY_PRODUCTS:
            return {
                ...state,
                sort: SORT_BY_PRODUCTS,
                filteredRecipes: [...state.filteredRecipes].sort((a, b) => {
                    return a.products.length - b.products.length
                })
            };
        case SORT_BY_UTENSILS:
            return {
                ...state,
                sort: SORT_BY_UTENSILS,
                filteredRecipes: [...state.filteredRecipes].sort((a, b) => {
                    return a.utensils.length - b.utensils.length
                })
            };
        default:
            return state;
    }
};

export const getProducts = state => state.recipesReducer.products;
export const getUtensils = state => state.recipesReducer.utensils;
export const getTime = state => state.recipesReducer.range.time;
export const getCalories = state => state.recipesReducer.range.calories;

export default recipesReducer;