import React, {useState, useEffect} from "react"
import {Col, Menu, Modal} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import OptionCard from "../card/OptionCard";
import {getOptionIcon} from "./SearchFilter";
import {Scrollbars} from "react-custom-scrollbars";

function ModalFilter({options, categories, isVisible, onCancel, onSelect}) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0].categoryName);

    function getProductsFromSelectedCategory(category) {

        const products = options.filter((element) => {
            return element.category === category
        });
        return (
            products.map((product, index) => (
                <div key={index} style={{display: "flex", alignItems: "center", margin: "10px", width:"25%"}}>
                    <OptionCard productIcon={getOptionIcon(product)} isEnabled={false}
                                onItemClick={(key) => onSelect(product)}/>
                    <div style={{display: "block"}}>
                        <span style={{fontSize: "10px", fontWeight: "600", display: "block", lineHeight: "10px"}}>
                        {product.caption}
                        </span>
                        {/*<span style={{fontSize: "8px", fontWeight: "500", display: "block"}}>*/}
                        {/*{product.calories + " ккл / 100гр"}*/}
                        {/*</span>*/}
                    </div>
                </div>
            ))
        )
    }

    return (
        <Modal
            width={700}
            visible={isVisible}
            footer={null}
            onCancel={onCancel}
        >
            <Scrollbars style={{height: "100%", margin: "0", maxWidth: "150px", borderRadius: "12px"}} universal={true}>
                <Menu style={{width: "150px"}}
                      mode="vertical"
                      defaultSelectedKeys={[categories[0].categoryName]}>
                    {categories.map((category, index) => (
                        <Menu.Item icon={<MenuOutlined/>}
                                   key={index}
                                   index={category.categoryName}
                                   onClick={({item, key, keyPath, selectedKeys, domEvent}) => {
                                       domEvent.stopPropagation();
                                       setSelectedCategory(categories[key].categoryName)
                                   }}
                                   style={{fontWeight: "600"}}>
                            {category.categoryDisplayNameUA}
                        </Menu.Item>
                    ))}
                </Menu>
            </Scrollbars>

            <Scrollbars style={{height: "100%", width:"100%", margin: "0", borderRadius: "12px"}} universal={true}>
            <div>
                <div style={{display: "flex", justifyContent: "start", flexWrap: "wrap", padding: "0px 20px"}}>
                    {getProductsFromSelectedCategory(selectedCategory)}
                </div>
            </div>
            </Scrollbars>
        </Modal>
    )
}

export default ModalFilter;