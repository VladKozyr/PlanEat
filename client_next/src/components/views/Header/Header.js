import React, {useEffect} from "react"
import Icon from '@ant-design/icons'
import {Logo} from "./Sections/Icons"
import Searchbar from "./Sections/Searchbar"
import styles from "./header.module.css"
import NavMenu from "./Sections/NavMenu";
import {useMediaQuery} from "react-responsive";
import {Button, Dropdown, Menu, Spin} from "antd";
import Avatar from "../../../static/icons/avatar.svg"
import Auth from "../../../hoc/Auth";
import {useRouter} from "next/router";
import {connect} from "react-redux";
import LogoutOutlined from "@ant-design/icons/lib/icons/LogoutOutlined";
import {logoutUser} from "../../../_actions/user_actions";


function Header(props) {
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'});

    const loginViaGoogle = () => window.location = "https://www.admin.planeat.co.ua/connect/google";
    const linkToProfile = () => window.location = "/user/profile";

    const menu = (
        <Menu>
            <Menu.Item key="1">Вподобані страви</Menu.Item>
            <Menu.Item key="2">Холодильник</Menu.Item>
            <Menu.Divider/>
            <Menu.Item key="3" onClick={() => props.logoutUser()}><LogoutOutlined/>Вийти</Menu.Item>
        </Menu>
    );

    const authOrUserProfileBtn = (
        <div>
            {props.isAuth === undefined ? <Spin/> :
                props.isAuth ? <Dropdown overlay={menu}>
                        <Button type={"text"}
                                style={{display: "flex", alignSelf: "center"}}
                                icon={<Icon component={Avatar} style={{fontSize: "24px"}}/>}
                                onClick={linkToProfile}>
                            Профіль
                        </Button>
                    </Dropdown>
                    : <Button type={"text"}
                              style={{display: "flex", alignSelf: "center"}}
                              icon={<Icon component={Avatar} style={{fontSize: "24px"}}/>}
                              onClick={loginViaGoogle}>
                        Увійти
                    </Button>}
        </div>
    );

    if (isTabletOrMobile) {
        return (
            <div className={styles["planeat-header"]} style={{width: "100vw"}}>
                <div className={styles["header-first-horizontal-row"]} style={{justifyContent: "space-between"}}>
                    <Logo/>
                    <Searchbar categories={props.categories}/>
                    {authOrUserProfileBtn}
                    <NavMenu categories={props.categories}/>
                </div>
            </div>
        )
    } else return (
        <div className={styles["planeat-header"]} style={{width: "100vw"}}>
            <div className={styles["header-first-horizontal-row"]} style={{justifyContent: "center"}}>
                <Logo/>
                <Searchbar categories={props.categories}/>
                {authOrUserProfileBtn}
            </div>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <NavMenu categories={props.categories}/>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        isAuth: state.user.isAuth
    }
};

const mapDispatchToProps = {
    logoutUser: logoutUser
};

export default Auth(connect(mapStateToProps, mapDispatchToProps)(Header), true)