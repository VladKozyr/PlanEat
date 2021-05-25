import React, {useState, useRef, useLayoutEffect, useEffect} from "react"
import {connect, useDispatch, useSelector} from "react-redux";
import {Card, Image} from "antd"
import Router from "next/router";
import OptionCard from "../card/OptionCard";
import ModalFilter from "./ModalFilter";
import {BACKEND_URL} from "../../../../config";
import PlusIcon from "../../../static/icons/plus.svg"
import Icon from '@ant-design/icons'
import queryString from "query-string"
import withQueryParams from "../../../hoc/withQueryParams";
import {fetchRecipes} from "../../../_actions/sort_actions";

const filterSize = 6;

const getOptionsFromQuery = (queryOptions, generalOptions) => {
    return queryOptions.map((option) => {
        return generalOptions.find((o) => o.name === option)
    })
};

export function getOptionIcon(option) {
    if (option !== undefined) {
        return (
            <Image src={BACKEND_URL + option.icon.url}
                   preview={false}
                   fallback={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="}/>
        )
    } else {
        return undefined;
    }
}

function SearchFilter({
                          selectedOptions,
                          options,
                          optionName,
                          optionCaption,
                          categories,
                          params,
                          selector,
                          getter,
                          router,
                          fetchRecipes
                      }) {

    const [isVisible, setVisible] = useState(false);
    const firstUpdate = useRef(true);

    useEffect(() => {
        let initialState;
        if (params === undefined) {
            initialState = [];
        } else {
            initialState = [options.find((option) => option.name === params)]
        }
        let additionalOptions;
        let additionalParams = router.query[optionName];
        if (additionalParams === undefined) additionalOptions = [];
        else if (!Array.isArray(additionalParams)) additionalOptions = [additionalParams];
        else additionalOptions = additionalParams;
        initialState = initialState.concat(getOptionsFromQuery(additionalOptions, options));
        selector(initialState);
    }, []);

    useLayoutEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        redirectToFilterLink();
    }, [selectedOptions]);

    function redirectToFilterLink() {
        let href = window.location.href;
        let routes = href.split("/");
        let params = routes[routes.length - 1].split("?")[0];
        let queryObject = queryString.parse(params);
        let optionsArray = selectedOptions.slice(1);
        let paramsObject = queryString.parse(routes[routes.length - 1].split("?")[1]);
        queryObject[optionName] = selectedOptions[0] ? selectedOptions[0].name : undefined;
        paramsObject[optionName] = optionsArray.map((item) => item.name);
        let queryStr = queryString.stringify(queryObject, {
            skipNull: true
        });
        Router.push({
            pathname: Router.pathname,
            query: {
                ...router.query,
                ...paramsObject,
                params: queryStr ? queryStr : "all"
            }
        }).then(fetchRecipes());
    }

    function handleItemUnselect(key) {
        selector(selectedOptions.filter((item, index) => parseInt(key) !== index));
    }

    function handleItemClick(key) {
        key = parseInt(key);
        if (key === filterSize - 1) {
            setVisible(true);
        } else {
            //TODO popover
            console.log("POPOVER")
        }
    }

    function handleModalCancelClick() {
        setVisible(false)
    }

    function handleModalSelectClick(option) {
        let isIncluded = selectedOptions.find((item) => {
            return item.name === option.name;
        });
        if (!isIncluded) {
            selector([...selectedOptions, option]);
        }
    }

    function getOptionCards() {
        let cards = [];
        for (let i = 0; i < filterSize - 1; i++) {
            cards.push(
                <div style={{display: "inline-block",width:"100%", margin:"5px"}}>
                    <OptionCard key={i}
                                index={i}
                                productIcon={getOptionIcon(selectedOptions[i])}
                                onItemDelete={handleItemUnselect}
                                onItemClick={handleItemClick}/>
                    <span style={{display:"inline-block", fontWeight: "500", fontSize: "10px", maxWidth:"40px", wordWrap:"break-word"}}>
                        {selectedOptions[i] !== undefined ? selectedOptions[i].caption : ""}
                    </span>
                </div>
            )
        }
        cards.push(
            <div style={{display: "inline-block", width:"100%", margin:"5px"}}>
                <OptionCard key={filterSize - 1}
                            index={filterSize - 1}
                            productIcon={<Icon component={PlusIcon} style={{fontSize: "24px"}}/>}
                            onItemClick={handleItemClick}
                            isEnabled={false}/>
                <span style={{fontWeight: "500", fontSize: "10px"}}>Додати</span>
            </div>);
        return cards;
    }

    return (
        <Card>
            <p>
                <span>
                    {optionCaption}
                </span>
            </p>
            <div style={{display: "flex", width: "100%", textAlign: "center"}}>
                {getOptionCards()}
            </div>
            <ModalFilter options={options}
                         categories={categories}
                         isVisible={isVisible}
                         onCancel={handleModalCancelClick}
                         onSelect={handleModalSelectClick}/>
        </Card>
    )
}

const mapStateToProps = (state, props) => {
    const {getter} = props;
    return {
        selectedOptions: getter(state)
    }
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        fetchRecipes: (filter) => dispatch(fetchRecipes(filter), state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(SearchFilter));