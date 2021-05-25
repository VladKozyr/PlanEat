import React, {useEffect, useState} from "react"
import {Dropdown, Menu} from "antd";
import {SORT_BY_UTENSILS, SORT_BY_CALORIES, SORT_BY_PRODUCTS, SORT_BY_TIME} from "../../../_actions/sort_types";
import DownOutlined from "@ant-design/icons/lib/icons/DownOutlined";
import {
    sortByCalories,
    sortByProducts,
    sortByTime,
    sortByUtensils
} from "../../../_actions/sort_actions";
import {connect} from "react-redux";
import Router from "next/router";
import withQueryParams from "../../../hoc/withQueryParams";

function RecipesSort({
                         router,
                         recipes,
                         sortByTime,
                         sortByProducts,
                         sortByUtensils,
                         sortByCalories
                     }) {

    const initialState = router.query.sort !== undefined ? router.query.sort : SORT_BY_TIME;
    const [selectedSort, setSelectedSort] = useState(initialState);

    const sorts = {};
    sorts[SORT_BY_TIME] = {
        caption: "за часом",
        func: sortByTime
    };
    sorts[SORT_BY_CALORIES] = {
        caption: "за калоріями",
        func: sortByCalories
    };
    sorts[SORT_BY_PRODUCTS] = {
        caption: "за продуктами",
        func: sortByProducts
    };
    sorts[SORT_BY_UTENSILS] = {
        caption: "за приладдям",
        func: sortByUtensils
    };

    useEffect(() => {
        sorts[selectedSort].func();
    }, [recipes]);

    const handleMenuClick = e => {
        setSelectedSort(e.key);
        sorts[e.key].func();
        Router.push({
            pathname: Router.pathname,
            query: {
                ...router.query,
                sort: e.key
            }
        }).then(r => console.log(e.key));
    };

    const menu = (
        <Menu>
            {
                Object.keys(sorts).map((key) => (
                    <Menu.Item key={key} onClick={handleMenuClick}>
                        <p>{sorts[key].caption}</p>
                    </Menu.Item>
                ))
            }
        </Menu>
    );

    return (
        <div style={{display: "block"}}>
            <div style={{
                display: "flex",
                width: "250px",
                height: "34px",
                background: "rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(0, 0, 0, 0.15)",
                boxSizing: "border-box",
                borderRadius: "12px",
                textAlign: "center",
                alignItems: "center",
                fontSize: "11px"
            }}>
                <div style={{
                    display: "flex",
                    width: "100px",
                    height: "100%",
                    alignItems: "center",
                    borderRight: "1px solid rgba(0, 0, 0, 0.15)"
                }}>
                <span style={{margin: "0 auto"}}>
                    Сортування
                </span>
                </div>
                <Dropdown overlay={menu} trigger={['click']} style={{display: "block",}}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "150px",
                            padding: "0 10px"
                        }}>
                            {sorts[selectedSort].caption}
                            <DownOutlined style={{display: "block"}}/>
                        </div>
                    </a>
                </Dropdown>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        recipes: state.recipesReducer.recipes
    }
};


const mapDispatchToProps = {
    sortByTime,
    sortByCalories,
    sortByProducts,
    sortByUtensils
};

export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(RecipesSort));