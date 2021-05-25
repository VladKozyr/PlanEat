import React, {useEffect, useState} from "react";
import Auth from "../../src/hoc/Auth";
import {connect} from "react-redux";
import Header from "../../src/components/views/Header/Header";
import Client from "../../lib/apollo";
import gql from "graphql-tag";
import Recipes from "../../src/components/utils/Recipes";
import {Button, Col, Empty, Row} from "antd";
import RecipeCard from "../../src/components/utils/card/RecipeCard";
import styles from "../../styles/Main.module.css";
import axios from "axios";
import {BACKEND_URL} from "../../config";

export async function getStaticProps() {
    const {data} = await Client.query({
        query: gql`
            query {
                categories{
                    id
                    categoryName
                    categoryImage{
                        url
                    }
                    categoryDisplayNameUA
                }
            }`
    });
    return {props: {categories: data.categories}}
}

const QUERY = gql`query
              getRecipes($ids: [Int]){
                recipes(where: {
                  id: $ids
                }){
                  id
                  slug
                  recipeImage{
                    url
                  }
                  calories
                  time
                  recipeCaption
                  products{
                    icon{
                      url
                    }
                  }
                  utensils{
                    icon{
                      url
                    }
                  }
                }
              }`;


function Profile({recipes, categories}) {
    const [likeRecipes, setLikeRecipes] = useState([])
    useEffect(() => {
        async function fetchData() {
            if(recipes === null)
                recipes = [];
            if (recipes !== undefined) {
                const recipeId = {
                    ids: recipes
                        // recipes.map(recipes => recipes.id)
                }

                if(recipes.length !== 0)
                    return Client.query({query:QUERY, variables: recipeId}).then(({data}) => data.recipes);
                return undefined;
            }
        }
        fetchData().then(setLikeRecipes);
    }, [recipes]);


    const displayRecipe = likeRecipes === undefined? "":likeRecipes.map((recipe, index) => (
        <Col xl={8} lg={8} md={12} sm={12} xs={24} key={index}>
            <RecipeCard id={recipe.id} image={recipe.recipeImage.url} caption={recipe.recipeCaption}
                        time={recipe.time} calories={recipe.calories} products={recipe.products} utensils={recipe.utensils} slug={recipe.slug}/>
        </Col>
    ));
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Header categories={categories}/>
            <div className={styles["main-page-wrapper"]}>
            <Row gutter={[16, 16]}>
                {likeRecipes !== undefined ? displayRecipe :
                    <Empty description={"Немає обраних рецептів..."} style={{margin: "100px auto"}}/>}
            </Row>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        recipes: state.user.ids
    };
}

export default Auth(connect(mapStateToProps)(Profile), true);