import React from "react";
import {Button, Form, Input} from "antd";
import Header from "../../src/components/views/Header/Header";
import gql from "graphql-tag";
import Client from "../../lib/apollo";

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

function Subscribe({categories}) {

    return (
        <>
            <Header categories={categories}/>
            <div style={{width: "70%", marginLeft: "15%", paddingTop:"30px"}}>
                <Form onFinish={()=>alert("Дякуюємо, Ваші дані збережено")}>
                    <Form.Item label={"Ім'я"} name={"name"} required>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={"Email"} name={"email"} required>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={"primary"} htmlType={"submit"}>
                            Підписатися
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default Subscribe