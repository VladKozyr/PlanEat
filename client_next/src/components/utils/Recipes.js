import React, {useEffect} from 'react'
import {Col, Empty, Row} from "antd";
import RecipeCard from "./card/RecipeCard";
import {connect} from "react-redux";
import {fetchRecipes} from "../../_actions/sort_actions";

function Recipes({recipes, category, fetchRecipes}) {

    useEffect(() => {
        fetchRecipes();
    },[category]);

    const displayRecipe = recipes.map((recipe, index) => (
        <Col xl={8} lg={8} md={12} sm={12} xs={24} key={index}>
            <RecipeCard id={recipe.id} image={recipe.recipeImage.url} caption={recipe.recipeCaption}
                        time={recipe.time} calories={recipe.calories} products={recipe.products} utensils={recipe.utensils} slug={recipe.slug}/>
        </Col>
    ));

    return (
        <>
            <Row gutter={[16, 16]}>
                {recipes.length !== 0 ? displayRecipe :
                    <Empty description={"Немає обраних рецептів..."} style={{margin: "100px auto"}}/>}
            </Row>
        </>
    )
}

const mapStateToProps = state => {
    return {
        recipes: state.recipesReducer.filteredRecipes,
        category: state.recipesReducer.category
    }
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        fetchRecipes: (filter) => dispatch(fetchRecipes(filter), state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipes);