import React, {useState} from "react"
import {Menu, Dropdown, Input, Modal} from 'antd';
import Client from "../../../../../lib/apollo"
import gql from "graphql-tag";
import {BACKEND_URL} from "../../../../../config";
import Link from "next/link";
import styles from './search.module.css'
import MediaQuery from "react-responsive";
import {SearchOutlined} from "@ant-design/icons";
import {useMediaQuery} from 'react-responsive'

const {Search} = Input;

const allCategories = {
    categoryDisplayNameUA: "Усі страви",
    id: "-1"
};


function Searchbar({categories}) {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 812px)'});
    const [selectedCategory, setSelectedCategory] = useState(allCategories.categoryDisplayNameUA);
    const [selectedKey, setSelectedKey] = useState(allCategories.id);
    const [searchItems, setSearchItems] = useState(<></>);
    const [modalVisible, setModalVisible] = useState(false);


    const updateSearchTerm = (event) => {
        let newSearchTerm = event.currentTarget.value
        if (newSearchTerm === "") {
            setSearchItems(<></>)
        } else {
            Client.query({
                query: gql`query{
                    recipes(where: {recipeCaption_contains : ${`\"${newSearchTerm}\"`}}){
                        id
                        recipeCaption
                        time
                        slug
                        calories
                        recipeImage{
                            url
                        }
                    }
                }`
            }).then(res => {
                setSearchItems(
                    <Menu style={{maxHeight: "400px", overflowY: "scroll"}}>
                        {res.data.recipes.map((recipe, index) => {
                            return (
                                <Menu.Item key={index}>
                                    <Link href={"/recipe/" + recipe.slug}>
                                        <div style={{display: "flex"}}>
                                            <img src={`${BACKEND_URL}${recipe.recipeImage.url}`}
                                                 style={{width: "67px", height: "50px"}} alt={"recipeImage"}/>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                fontSize: "16px",
                                                width: "100%",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                                <p style={{margin: "0 0 0 10px"}}>{recipe.recipeCaption}</p>
                                                <p style={{
                                                    margin: 0,
                                                    fontSize: "14px",
                                                    fontWeight: "600"
                                                }}>{recipe.calories} калорій, {recipe.timeText} хв</p>
                                            </div>
                                        </div>
                                    </Link>
                                </Menu.Item>
                            )
                        })}
                    </Menu>
                )
            });
        }
    };


    const menu = (
        <Menu>
            {
                categories.map((category) =>
                    (
                        <Menu.Item key={category.id} onClick={handleCategoryChange}>
                            <a href="#">{category.categoryDisplayNameUA}</a>
                        </Menu.Item>
                    )
                )
            }
            <li className={"ant-dropdown-menu-item-divider"}/>
            <Menu.Item key={-1} onClick={handleCategoryChange}>
                {allCategories.categoryDisplayNameUA}
            </Menu.Item>
        </Menu>
    );

    const searchComponent = (
        <div style={{display: 'flex', width: '100%', justifyContent: 'flex-end'}}>
            <Dropdown overlay={menu}
                      trigger={['hover']}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    padding: "0",
                }}>
                    <p className={styles['searchbar_category-picker']}>
                        {selectedCategory}
                    </p>
                </div>
            </Dropdown>
            <Dropdown
                placement="bottomCenter"
                overlay={searchItems}
                style={{maxHeight: "500px", overflowY: "scroll"}}
            >
                <Search placeholder="Пошук..."
                        onSearch={value => console.log(value)}
                        onChange={updateSearchTerm}
                        className={styles['searchbar']}
                        enterButton/>
            </Dropdown>
        </div>
    )

    function handleCategoryChange(itemProps) {
        let index = categories.findIndex((category) => category.id === itemProps.key);
        setSelectedKey(index);
        if (index !== -1)
            setSelectedCategory(categories[index].categoryDisplayNameUA);
        else
            setSelectedCategory(allCategories.categoryDisplayNameUA)

    }

    return (
        <>
            {isTabletOrMobile &&
            <div style={{width: "100%"}}>
                <div style={{
                    width: "50px",
                    height: "32px",
                    borderRadius: "12px",
                    background: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    float: "right",
                    zIndex: "1000"
                }}>
                    <SearchOutlined style={{fontSize: '20px', color: "white"}}
                                    onClick={() => setModalVisible(true)}/>
                    <Modal visible={modalVisible} onCancel={() => setModalVisible(false)}>
                        <div style={{maxHeight: "32px", display: "flex", margin: "30px 0 0 20px", width: "80%"}}>
                            {searchComponent}
                        </div>
                    </Modal>
                </div>
            </div>
            }
            {!isTabletOrMobile &&
            <div style={{alignSelf: "center", display: "flex", width: "70%"}}>
                {searchComponent}
            </div>
            }
        </>
    )
}

export default Searchbar