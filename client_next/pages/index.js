import React from "react"
import styles from "../styles/Main.module.css"
import {Col, Row} from 'antd'
import Header from "../src/components/views/Header/Header";
import Client from "../lib/apollo"
import gql from 'graphql-tag';
import ProductCard from "../src/components/utils/card/Card";
import Head from "next/head";

const QUERY = gql`
    query {
        categories{
            id
            categoryName
            categoryImage{
                url
            }
            categoryDisplayNameUA
        }
    }`;


export async function getStaticProps() {
    const {data} = await Client.query({
        query: QUERY
    });
    return {props: {categories: data.categories}}
}

function Main({categories}) {

    const displayCategories = categories.map((category, index) => (
        <Col xl={8} lg={8} md={12} sm={12} xs={24} key={index}>
            <ProductCard id={category.id} image={category.categoryImage.url} caption={category.categoryDisplayNameUA}
                         name={category.categoryName}/>
        </Col>
    ));


    return (
        <>
            <Head>
                <title>PlanEat | Швидке харчування</title>
                <meta name={"description"}
                      content={"Заходьте на Planeat та знаходьте смачні рецепти на кожен день. Тут ви знайдете швидкі рецепти на сніданок, обід та вечерю. Також ви завжди зможете дивувати рідних швидкими рецептами десертів на кожен день."}/>
            </Head>
            <div style={{display: "flex", flexDirection: "column"}}>
                <Header categories={categories}/>
                <div className={styles["main-page-wrapper"]}>
                    <h1 className={styles["heading"]}>Planeat - харчуйся швидко!</h1>
                    <p style={{fontSize: "15px", width: "70%", color: "rgba(0, 0, 0, 0.45)", textAlign: "center"}}>
                        Привіт любий друже! Любиш смачно харчуватися, але нема часу щоб готувати? Тоді ти потрапив куди
                        треба!
                        На нашому сайті ти можеш знайти швидкі і смачні рецепти на кожен день.
                    </p>
                    <Row gutter={[16, 16]} justify={"center"}>
                        {displayCategories}
                    </Row>
                </div>
                <footer style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "70px",
                    marginBottom:"10px"
                }}>
                    <a href={"/subscribe"}>Підписатися на нові рецепти</a>
                </footer>
            </div>
        </>

    )
}

export default Main
