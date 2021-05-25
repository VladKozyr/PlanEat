import React, {useEffect, useState, useRef, useLayoutEffect} from "react"
import {Card, Slider} from "antd";
import SliderTooltip from "../tooltip/SliderTooltip";
import withQueryParams from "../../../hoc/withQueryParams";
import {connect} from "react-redux";
import {fetchRecipes} from "../../../_actions/sort_actions";

function SliderFilter({
                          range,
                          optionName,
                          filter,
                          units,
                      }) {

    const [minValue, setMinValue] = useState(range.min);
    const [maxValue, setMaxValue] = useState(range.max);

    useEffect(() => {
        setMinValue(range.min);
        setMaxValue(range.max);
    }, [range]);


    function onChange(value) {
        if (value[0] !== Number.NEGATIVE_INFINITY && value[1] !== Number.POSITIVE_INFINITY) {
            setMinValue(value[0]);
            setMaxValue(value[1]);
        }
    }

    function onAfterChange(value) {
        filter(value[0], value[1]);
    }


    return (
        <Card>
            <div style={{display: "flex", alignItems: "center", width: "100%"}}>
                <span style={{display: "block", width: "25%"}}>
                    {optionName}
                </span>
                <Slider
                    range={true}
                    step={1}
                    value={[minValue, maxValue]}
                    min={range.min}
                    max={range.max}
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    tipFormatter={value => <SliderTooltip value={value + " " + units}/>}
                    style={{display: "block", width: "75%", height: "100%"}}
                />
            </div>
        </Card>
    )
}

const mapStateToProps = (state, props) => {
    const {getter} = props;
    return {
        range: getter(state)
    }
};

const mapDispatchToProps = (dispatch, state) => {
    return {
        fetchRecipes: (filter) => dispatch(fetchRecipes(filter), state)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withQueryParams(SliderFilter));