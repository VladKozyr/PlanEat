import React from "react";
import {FacebookFilled, InstagramFilled, TwitterOutlined} from "@ant-design/icons";
import MediaQuery from "react-responsive";
import {useMediaQuery} from 'react-responsive'

function Share({recipeId}) {

    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1026px)'});

    return (
        <>
            {!isTabletOrMobile &&
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "20px",
                backgroundColor: "white"
            }}>
                <p style={{fontSize: "18px", margin: "0px 50px"}}>Поділись рецептом з друзями!</p>
                <div style={{display: "flex"}}>
                    <TwitterOutlined style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                    <FacebookFilled style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                    <InstagramFilled style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                </div>
            </div>
            }
            {isTabletOrMobile &&
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                paddingBottom: "20px",
                backgroundColor: "white",
                flexDirection: "column",
                whiteSpace: "nowrap"
            }}>
                <p style={{fontSize: "18px", margin: "0px 50px"}}>Поділись рецептом з друзями!</p>
                <div style={{display: "flex"}}>
                    <TwitterOutlined style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                    <FacebookFilled style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                    <InstagramFilled style={{color: '#FFCA44', fontSize: "35px", margin: "0px 15px"}}/>
                </div>
            </div>
            }
        </>
    )
}

export default Share