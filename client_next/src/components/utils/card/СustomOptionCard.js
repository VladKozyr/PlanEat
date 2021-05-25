import React from "react"
import styles from "./card.module.css"
import {Image} from "antd";
import {BACKEND_URL} from "../../../../config";

function CustomOptionCard({item, size, onHover}) {

    let custom = {};

    if(size !== undefined) {
        custom.width = size;
        custom.height = size;
        custom.padding = "5px"
    }

    const getItemIcon = item => {
        if(item.icon === null) return;
        if (typeof item === 'number') {
            return (<span style={{display: "block", color: "rgba(0, 0, 0, 0.65)"}}>
                {"+" + item}
            </span>)
        } else {
            return (
                <Image src={BACKEND_URL + item.icon.url}
                       preview={false}/>
            )
        }
    };

    return (
        <div className={styles['option']} style={custom}>
            {getItemIcon(item)}
        </div>
    )
}

export default CustomOptionCard;