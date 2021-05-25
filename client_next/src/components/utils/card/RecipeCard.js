import React from "react"
import Icon from "@ant-design/icons/lib";
import {BACKEND_URL} from "../../../../config"
import {Card, Image, Button} from "antd"

import ClockIcon from "../../../static/icons/clockIcon.svg"
import FireIcon from "../../../static/icons/fireIcon.svg"
import {connect} from "react-redux";

import CustomOptionCard from "./СustomOptionCard";
import axios from "axios";
import {deleteRecipe, addRecipe} from "../../../_actions/user_actions";

const optionsLength = 4;

async function addCard(jwt, userId, cardId, ids) {
    if(ids === null)
        ids = [];
    ids.push(parseInt(cardId));
    await axios.put(`${BACKEND_URL}/users/${userId}`, {ids: ids}, {
        headers: {
            'Authorization': `Bearer ${jwt}`}
    });
}

function RecipeCard(props) {
    let optionsArray = [];
    console.log("Props: " + props.ids + "" + props.id);
    console.log(props.ids.includes(parseInt(props.id)));
    const getOptions = (options) => {
        if (options.length > optionsLength) {
            optionsArray = options.slice(0, optionsLength - 1).map((option) => {
                    return <CustomOptionCard key={option.name} item={option}/>
                }
            );
            optionsArray.push(<CustomOptionCard key={"more"} item={options.length - optionsLength + 1}/>)
        } else {
            optionsArray = options.map((option) => {
                return <CustomOptionCard key={option.name} item={option}/>
            })
        }
        return optionsArray;
    };

    return (
        <>
            <Card hoverable={true} style={{borderRadius: "10px", height: "320px", cursor: "default"}} key={props.id}
                  bodyStyle={{padding: "0px", borderRadius: "10px", height: "120px"}}
                  className={"product-card"}>
                <Image src={BACKEND_URL + props.image}
                       fallback="data:image/png;base64,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"
                       className={"card-image"}
                       style={{borderRadius: "10px"}}
                       preview={false}
                />
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    margin: "10px",
                    justifyContent: "space-between",
                    height: "100%"
                }}>
                    <span style={{fontWeight: "600", fontSize: "19px"}}>{props.caption}</span>
                    <div style={{display: "flex"}}>
                        <div style={{display: "flex", justifyContent: "flex-start", width: "50%"}}>
                            {getOptions(props.products)}
                        </div>
                        <div style={{display: "flex", justifyContent: "flex-end", width: "50%"}}>
                            {getOptions(props.utensils)}
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", padding: "3px"}}>
                        <div>
                            <span style={{fontSize: "12px", lineHeight: "16px", display: "block"}}>
                                <Icon component={ClockIcon} style={{fontSize: "16px", marginRight: "5px"}}/>
                                {props.time} хв
                            </span>
                            <span style={{fontSize: "12px", lineHeight: "16px", display: "block"}}>
                                <Icon component={FireIcon}
                                      style={{fontSize: "16px", marginRight: "5px", color: "black"}}/>
                                 {props.calories} ккал
                            </span>
                        </div>
                        <a href={"/recipe/" + props.slug}>
                            <Button style={{
                                height: "100%",
                                borderRadius: "8px",
                                backgroundColor: "#FFCA44",
                                fontWeight: "600",
                                cursor: "pointer",
                            }} className={"product-card-button"}> До рецепту </Button>
                        </a>
                        {props.isAuth && <Button style={{
                            height: "100%",
                            borderRadius: "8px",
                            backgroundColor: "#FFCA44",
                            fontWeight: "600",
                            cursor: "pointer",
                        }} className={"product-card-button"} onClick={() => {
                            if(props.ids === null || props.ids.indexOf(parseInt(props.id)) === -1)
                                return props.addRecipes(props.id).then(console.log);
                            return props.deleteRecipes(props.id).then(console.log);
                        }}> {props.ids.includes(parseInt(props.id)) ? "-" : "+"} </Button>}
                    </div>
                </div>
            </Card>
        </>
    )
}

const mapStateToProps = state => {
    return {
        isAuth: state.user.isAuth,
        jwt: state.jwt.jwt,
        userId: state.user.id,
        ids: state.user.ids,
    };
}
const mapDispatchToProps = {
    deleteRecipes: deleteRecipe,
    addRecipes: addRecipe
}
export default connect(mapStateToProps, mapDispatchToProps)(RecipeCard);