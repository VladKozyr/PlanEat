import React, {useState} from "react"
import {Menu, Drawer} from 'antd'
import {DishIcon, MoreIcon} from "./Icons"
import Link from "next/link"
import {useMediaQuery} from 'react-responsive'
import {MenuOutlined} from '@ant-design/icons'
import {getInitial, setCategory} from "../../../../_actions/sort_actions";
import {connect} from "react-redux";

function NavMenu({categories, setCategory, getInitial}) {
    const isTabletOrMobile = useMediaQuery({query: '(max-width: 1224px)'});
    const [current, setCurrent] = useState();
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuClick = e => {
        setCurrent(e.key);
        setCategory(e.key);
    };

    const showDrawer = () => {
        setMenuVisible(true);
    };

    const menu =
        <Menu onClick={handleMenuClick} selectedKeys={[current]} mode={isTabletOrMobile ? "vertical" : "horizontal"}
              style={{border: "none"}}>
            <Menu.Item key="all" icon={<MoreIcon/>}>
                <Link href={'/recipes/all/all'} onClick={() => getInitial()}>
                    Усі страви
                </Link>
            </Menu.Item>
            {
                categories.map((category) => (
                    <Menu.Item key={category.categoryName} icon={<DishIcon/>}
                               style={{alignItems: "center"}}
                               onClick={() => getInitial()}>
                        <Link href={'/recipes/' + category.categoryName + '/all'}>
                            {category.categoryDisplayNameUA}
                        </Link>
                    </Menu.Item>
                ))
            }
        </Menu>


    if (isTabletOrMobile) {
        return (
            <>
                <MenuOutlined onClick={showDrawer} style={{fontSize: '32px', marginLeft: "30px"}}/>
                <Drawer
                    placement={"right"}
                    closable={true}
                    onClose={() => setMenuVisible(false)}
                    visible={menuVisible}
                >
                    {menu}
                </Drawer>
            </>
        )
    } else {
        return (
            <>
                {menu}
            </>
        )
    }
}

const mapDispatchToProps = {
    setCategory,
    getInitial
};

export default connect(null, mapDispatchToProps)(NavMenu)