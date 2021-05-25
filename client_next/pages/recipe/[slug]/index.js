import React, {ReactElement} from "react";
import gql from "graphql-tag";
import Client from "../../../lib/apollo";
import Header from "../../../src/components/views/Header/Header";
import Share from "../../../src/components/views/Share/Share";
import styles from "../../../styles/Recipe.module.css";
import {BACKEND_URL} from "../../../config";
import ClockImageSvg from "../../../src/static/icons/clockIcon.svg";
import FireImageSvg from "../../../src/static/icons/fireIcon.svg";
import DishImageSvg from "../../../src/static/icons/dishIconOrange.svg";
import Icon from "@ant-design/icons";
import Head from "next/head";
import {Scrollbars} from 'react-custom-scrollbars';
import Markdown from "markdown-to-jsx";
import {Col, Row} from "antd";
import CustomOptionCard from "../../../src/components/utils/card/СustomOptionCard";
import {useMediaQuery} from 'react-responsive';


export async function getStaticPaths() {
    const {data} = await Client.query({
        query: gql`
            query { recipes{
                id
                slug
            }}`
    });

    const slugs = data.recipes.map((recipe) => ({
        params: {slug: recipe.slug}
    }));

    return {paths: slugs, fallback: false}
}

export async function getStaticProps({params}) {

    const {data} = await Client.query({
        query: gql`
            query {
                recipes (where: {
                        slug: \"${params.slug}\"
                    }){
                    id
                    slug
                    time
                    calories
                    recipeCaption
                    recipeDescription
                    recipePreparationTime
                    recipePortions
                    recipeText
                    products{
                        name
                        caption
                        icon{
                            url
                        }
                    }
                    utensils{
                        name
                        caption
                        icon{
                           url
                        }
                    }
                    recipeImage{
                        url
                    }
                    category
                }
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
    return {props: {recipe: data.recipes[0], categories: data.categories}}
}

/**
 * @return {string}
 */
function MinutesToDuration(s) {
    const days = Math.floor(s / 1440);
    s = s - days * 1440;
    const hours = Math.floor(s / 60);
    s = s - hours * 60;

    let dur = "PT";
    if (days > 0) {
        dur += days + "D"
    }
    if (hours > 0) {
        dur += hours + "H"
    }
    dur += s + "M";

    return dur;
}


function RecipePage({recipe, categories}) {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1026px)'});

    const getDishes = recipe.utensils.map(utensil => {
        return (
            <li className={styles["utils-list-container"]}
                itemProp={"recipeIngredient"}
                content={utensil.caption}>
                <CustomOptionCard item={utensil} className={styles["utils-icon"]} size={"40px"}/>
                <p style={{margin: "0 0 0 15px"}}>{utensil.caption}</p>
            </li>
        )
    });

    const getMobileDishes = recipe.utensils.map(utensil => {
        return (
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <li className={styles["utils-list-container"]}
                    itemProp={"recipeIngredient"}
                    content={utensil.caption}>
                    <CustomOptionCard item={utensil} className={styles["utils-icon"]} size={"40px"}/>
                    <p style={{margin: "0 0 0 15px"}}>{utensil.caption}</p>
                </li>
            </Col>
        )
    });

    const getIngredients = recipe.products.map(product => {
        return (
            <li className={styles["utils-list-container"]}>
                <CustomOptionCard item={product} className={styles["utils-icon"]} size={"40px"}/>
                <p style={{margin: "0 0 0 15px"}}>{product.caption}</p>
            </li>
        )
    });

    const getMobileIngredients = recipe.products.map(product => {
        return (
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <li className={styles["utils-list-container"]}>
                    <CustomOptionCard item={product} className={styles["utils-icon"]} size={"40px"}/>
                    <p style={{margin: "0 0 0 15px", fontSize: "12px"}}>{product.caption}</p>
                </li>
            </Col>
        )
    });

    return (
        <div itemScope itemType={"https://schema.org/Recipe"}>
            <Head>
                <title>{recipe.recipeCaption}</title>
            </Head>
            {!isTabletOrMobile &&
                <div className={styles["recipe-container"]}>
                    <Header categories={categories}/>
                    <div className={styles["recipe-content"]}>
                        <div className={styles["left-column-recipe"]}>
                            <img itemProp={"image"} src={BACKEND_URL + recipe.recipeImage.url}
                                 alt={recipe.recipeCaption + "-image"}
                                 className={styles["recipe-image"]}/>
                            <div className={styles["dishes-and-ingredients"]}>
                                {recipe.utensils.length !== 0 &&
                                <>
                                    <div className={styles["dishes"]}>
                                        <h3 style={{fontSize: "18px", fontWeight: "600"}}>Прибори:</h3>
                                        <Scrollbars universal={true}>
                                            {getDishes}
                                        </Scrollbars>
                                    </div>
                                </>
                                }
                                {recipe.products.length !== 0 &&
                                <>
                                    <div className={styles["ingredients"]}>
                                        <h3 style={{fontSize: "18px", fontWeight: "600"}}>Інгредієнти:</h3>
                                        <Scrollbars universal={true}>
                                            {getIngredients}
                                        </Scrollbars>
                                    </div>
                                </>
                                }
                            </div>
                        </div>
                        <div className={styles["right-column-recipe"]}>
                            <Scrollbars style={{height: "100%"}} universal={true}>
                                <div className={styles["heading-block"]}>
                                    <h1 style={{fontWeight: "800"}}>{recipe.recipeCaption}</h1>
                                    <div className={styles["metrics"]}>
                                        <div style={{display: "flex"}}>
                                            <div className={styles["metric"]} style={{width: "170px"}}>
                                                <Icon component={ClockImageSvg} className={styles["metric-icon"]}/>
                                                <p>
                                                    <meta itemProp={"prepTime"}
                                                          content={MinutesToDuration(recipe.recipePreparationTime)}/>
                                                    {`Підготовка:    ${recipe.recipePreparationTime}хв.`}
                                                </p>
                                            </div>
                                            <div className={styles["metric"]}
                                                 style={{width: "120px"}}
                                                 itemProp={"nutrition"}>
                                                <Icon component={FireImageSvg} className={styles["metric-icon"]}/>
                                                <p>
                                                    <meta itemProp={"calories"}/>
                                                    {recipe.calories} кКал
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{display: "flex"}}>
                                            <div className={styles["metric"]} style={{width: "170px"}}>
                                                <Icon component={ClockImageSvg} className={styles["metric-icon"]}/>
                                                <p>
                                                    <meta itemProp={"performTime"}
                                                          content={MinutesToDuration(recipe.time)}/>
                                                    {`Приготування:   ${recipe.time}хв.`}
                                                </p>
                                            </div>
                                            <div className={styles["metric"]} style={{width: "120px"}}>
                                                <Icon component={DishImageSvg} className={styles["metric-icon"]}/>
                                                <p itemProp={"recipeYield"}>
                                                    {recipe.recipePortions + " порції(й)"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{fontSize: "15px"}}>{recipe.recipeDescription}</p>
                                </div>
                                <p style={{fontSize: "18px"}}>Покроковий рецепт:</p>
                                <p className={"recipeText"}>
                                    <Markdown>
                                        {recipe.recipeText}
                                    </Markdown>
                                </p>
                            </Scrollbars>
                        </div>
                    </div>
                    <Share recipeId={recipe.id}/>
                </div>}
            {isTabletOrMobile &&
            <div className={styles["recipe-container"]}>
                <Header categories={categories}/>
                <h1 style={{fontWeight: "800"}}>{recipe.recipeCaption}</h1>
                <img src={BACKEND_URL + recipe.recipeImage.url} alt={recipe.recipeCaption + "-image"}
                     className={styles["recipe-image"]}
                     itemProp={"image"}/>
                <div className={styles["metrics"]}>
                    <div style={{display: "flex"}}>
                        <div className={styles["metric"]} style={{width: "170px"}}>
                            <Icon component={ClockImageSvg} className={styles["metric-icon"]}/>
                            <p>
                                <meta itemProp={"prepTime"}
                                      content={MinutesToDuration(recipe.recipePreparationTime)}/>
                                {`Підготовка:    ${recipe.recipePreparationTime}хв.`}
                            </p>
                        </div>
                        <div className={styles["metric"]} style={{width: "120px"}}>
                            <Icon component={FireImageSvg} className={styles["metric-icon"]}/>
                            <p>
                                <meta itemProp={"calories"}/>
                                {recipe.calories} кКал
                            </p>
                        </div>
                    </div>
                    <div style={{display: "flex"}}>
                        <div className={styles["metric"]} style={{width: "170px"}}>
                            <Icon component={ClockImageSvg} className={styles["metric-icon"]}/>
                            <p>
                                <meta itemProp={"performTime"}
                                      content={MinutesToDuration(recipe.time)}/>
                                {`Приготування:   ${recipe.time}хв.`}
                            </p>
                        </div>
                        <div className={styles["metric"]} style={{width: "120px"}}>
                            <Icon component={DishImageSvg} className={styles["metric-icon"]}/>
                            <p itemProp={"recipeYield"}>
                                {recipe.recipePortions + " порції(й)"}
                            </p>
                        </div>
                    </div>
                </div>
                {recipe.utensils.length !== 0 &&
                <>
                    <h3 style={{fontSize: "18px", fontWeight: "600"}}>Прибори:</h3>
                    <Row>
                        {getMobileDishes}
                    </Row>
                </>
                }
                {recipe.products.length !== 0 &&
                <>
                    <h3 style={{fontSize: "18px", fontWeight: "600"}}>Інгредієнти:</h3>
                    <Row>
                        {getMobileIngredients}
                    </Row>
                </>
                }
                <p style={{fontSize: "18px", fontWeight: "600"}}>Покроковий рецепт:</p>
                <p className={styles["recipeText"]}>
                    <Markdown>
                        {recipe.recipeText}
                    </Markdown>
                </p>
                <Share recipeId={recipe.id}/>
            </div>
            }
        </div>
    )
}

export default RecipePage