import React, {useEffect} from "react"
import gql from "graphql-tag";
import Client from "../../../../lib/apollo";
import queryString from "query-string"
import {connect, useDispatch, useSelector} from "react-redux";
import Header from "../../../../src/components/views/Header/Header";
import styles from "../../../../styles/Main.module.css";
import {Col, Collapse, Row, Button} from "antd";
import Recipes from "../../../../src/components/utils/Recipes";
import Markdown from "markdown-to-jsx";
import {
    filterByCalories,
    filterByProducts, filterByTime,
    filterByUtensils, getInitial, setCategory,
    setRecipes,
    sortByTime
} from "../../../../src/_actions/sort_actions";
import RecipesSort from "../../../../src/components/utils/filter/RecipesSort";
import SliderFilter from "../../../../src/components/utils/filter/SliderFilter";
import Head from "next/head";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import SearchFilter from "../../../../src/components/utils/filter/SearchFilter";
import {getCalories, getProducts, getTime, getUtensils} from "../../../../src/_reducers/recipes_reducer";

export async function getStaticPaths() {
    let {data} = await Client.query({
        query: gql`query {
            categories{
                categoryName
            }
            products{
                name
            }
            utensils{
                name
            }
        }`
    });

    let products = data.products.concat({});
    let utensils = data.utensils.concat({});
    let categories = data.categories.concat({categoryName: "all"});
    let paths = [];

    categories.forEach((category) => (
        products.forEach((product) => {
            utensils.forEach((utensil) => {
                let params = {};
                if (Object.keys(product).length === 0 && Object.keys(utensil).length === 0) {
                    params.all = null;
                } else {
                    params.product = product ? product.name : undefined;
                    params.utensil = utensil ? utensil.name : undefined
                }
                paths.push(
                    {
                        params: {
                            category: category.categoryName,
                            params: queryString.stringify(params, {sort: false})
                        }
                    })
            });
            paths.push({
                params: {
                    category: category.categoryName,
                    params: "all"
                }
            })
        }))
    );

    return {
        paths: paths,
        fallback: false
    }
}

const getQueryFilter = category => {
    if (category !== "all") {
        return `(where: {category: "${category}"})`
    }
    return ""
};

export async function getStaticProps(context) {
    const filter = getQueryFilter(context.params.category);
    const {data} = await Client.query({
        query: gql` query {
            recipes ${filter}{
            id
            calories
            time
            recipeCaption
            recipeImage{
                url
            }
            category
            products {
                name
            }
            utensils {
                name
            }
        }
        categories{
        id
        categoryName
        categoryImage{
        url
        }
        categoryDisplayNameUA
        }
        categoriesTexts{
        CategoryNameText
        CategoryText
        CategoryH1
        CategoryTitle
        CategoryDescription
        }
        products{
        caption
        name
        icon{
        url
        }
        category
        seoTitle
        }
        utensils{
        caption
        name
        icon{
        url
        }
        category
        seoTitle
        }
        categoriesProducts{
        categoryName
        categoryDisplayNameUA
        }
        categoriesUtensils{
        categoryName
        categoryDisplayNameUA
        }
        }`
    });
    return {
        props: {
            data: {
                category: context.params.category,
                recipes: data.recipes,
                categories: data.categories,
                categoriesTexts: data.categoriesTexts,
                products: data.products,
                utensils: data.utensils,
                categoriesProducts: data.categoriesProducts,
                categoriesUtensils: data.categoriesUtensils,
                params: queryString.parse(context.params.params)
            }
        }
    };
}

function FilteredPage({
                          data,
                          setCategory,
                          filterByProducts,
                          filterByUtensils,
                          filterByTime,
                          filterByCalories
                      }) {

    const category = data.categoriesTexts.find((category) => {
        return category.CategoryNameText === data.category
    });

    const getH1 = () => {
        let H1 = category.CategoryH1;
        let product = data.params.product;
        let utensil = data.params.utensil;
        if (product) {
            let productObj = data.products.find((p) => p.name === product);
            H1 += " " + productObj.seoTitle;
        }
        if (utensil) {
            let utensilObj = data.utensils.find((p) => p.name === utensil);
            H1 += " " + utensilObj.seoTitle;
        }
        return H1;
    };

    const getTitle = () => {
        let title = category.CategoryTitle;
        let product = data.params.product;
        let utensil = data.params.utensil;
        if (product) {
            let productObj = data.products.find((p) => p.name === product);
            title += " " + productObj.seoTitle;
        }
        if (utensil) {
            let utensilObj = data.utensils.find((p) => p.name === utensil);
            title += " " + utensilObj.seoTitle;
        }
        return title;
    };

    useEffect(() => {
        setCategory(data.category);
    }, []);

    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <Head>
                <title>
                    {getTitle()}
                </title>
                <meta name={"description"} content={category.CategoryDescription}/>
                {data.params.product > 1 || data.params.utensils ?
                    <meta name="robots" content="index,follow"/> :
                    <meta name="robots" content="noindex,nofollow"/>}
            </Head>
            <Header categories={data.categories}/>
            <div className={styles["main-page-wrapper"]}>
                <Collapse defaultActiveKey={['1']} onChange={() => console.log("smth")}
                          style={{width: "100%", margin: "20px", borderRadius: "7px"}}
                          ghost>
                    <Collapse.Panel disabled header={<strong>Фільтри</strong>}
                                    key="1"
                                    // extra={
                                    //     <Button type={"primary"}
                                    //             icon={<DeleteOutlined/>}
                                    //             onClick={(event => {
                                    //                 event.stopPropagation();
                                    //
                                    //             })}>Очистити</Button>
                                    // }
                        >
                        <Row gutter={[16, 16]} style={{margin: "0"}}>
                            <Col xl={8} lg={8} md={12} sm={12} xs={24}>
                                <SearchFilter options={data.products}
                                              optionName={"product"}
                                              optionCaption={"Продукти"}
                                              categories={data.categoriesProducts}
                                              params={data.params.product}
                                              selector={filterByProducts}
                                              getter={getProducts}/>
                            </Col>
                            <Col xl={8} lg={8} md={12} sm={12} xs={24}>
                                <SearchFilter options={data.utensils}
                                              optionName={"utensil"}
                                              optionCaption={"Прибори"}
                                              categories={data.categoriesUtensils}
                                              params={data.params.utensil} selector={filterByUtensils}
                                              getter={getUtensils}/>
                            </Col>
                            <Col xl={8} lg={8} md={24} sm={24} xs={24}>
                                <Row gutter={[0, 16]}>
                                    <Col xl={24} lg={24} md={12} sm={12} xs={24} style={{width: "100%"}}>
                                        <SliderFilter optionName={"Калорії"}
                                                      getParamFunction={(recipe) => recipe.calories}
                                                      units={"ккл"}
                                                      filter={filterByCalories}
                                                      getter={getCalories}/>
                                    </Col>
                                    <Col xl={24} lg={24} md={12} sm={12} xs={24} style={{width: "100%"}}>
                                        <SliderFilter optionName={"Час"}
                                                      getParamFunction={(recipe) => recipe.time}
                                                      units={"хв"}
                                                      filter={filterByTime}
                                                      getter={getTime}/>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Collapse.Panel>
                </Collapse>

                <Row gutter={[8, 8]}>
                    <Col xs={24} sm={12}>
                        <h1 style={{display: "block"}}>{getH1()}</h1>
                    </Col>
                    <Col xs={24} sm={12} style={{display: "flex", justifyContent: "center"}}>
                        <RecipesSort category={category.categoryName} style={{display: "flex", justifyContent: "end"}}/>
                    </Col>
                </Row>
                <Recipes recipes={data.recipes}/>
                <Markdown>{category.CategoryText}</Markdown>
            </div>
        </div>
    )
}

const mapDispatchToProps = (dispatch, state) => {
    return {
        setCategory: (category) => dispatch(setCategory(category)),
        filterByProducts: (products) => dispatch(filterByProducts(products)),
        filterByUtensils: (utensils) => dispatch(filterByUtensils(utensils)),
        filterByTime: (minTime, maxTime) => dispatch(filterByTime(minTime, maxTime), state),
        filterByCalories: (minTime, maxTime) => dispatch(filterByCalories(minTime, maxTime), state)
    }

};

export default connect(null, mapDispatchToProps)(FilteredPage)