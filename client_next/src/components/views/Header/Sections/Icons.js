import React from "react"
import Icon from '@ant-design/icons'
import PlanEatSvg from "../../../../static/icons/PlanEat.svg"
import DishImageSvg from "../../../../static/icons/dishIcon.svg"
import MoreImageSvg from "../../../../static/icons/moreIcon.svg"
import {useMediaQuery} from "react-responsive";

export function Logo(props) {
    const isMobile = useMediaQuery({query: '(max-width: 845px)'});
    return (
        <div style={{margin: `${isMobile? "0 40px 0 0 " : "0 80px 0 0"}`}}>
            <a href={"/"}>
                <PlanEatSvg style={{margin: "0", cursor: "pointer"}}/>
            </a>
        </div>
    )
}

export function DishIcon(props) {

    return (
        <Icon component={DishImageSvg} style={{fontSize: "18px"}}/>
    )
}

export function MoreIcon(props) {
    return (
        <Icon component={MoreImageSvg} style={{fontSize: "18px"}}/>
    )
}