import React from "react"
import {withRouter} from 'next/router';


function withQueryParams(Component) {

    return withRouter(({router, ...props}) => {
        const searchParams = new URLSearchParams(router.asPath.split(/\?/)[1]);
        const query = {};
        for (const [key, value] of searchParams) {
            if(query[key] !== undefined) {
                if (typeof query[key] === 'string')
                    query[key] = [query[key], value];
                else if (Array.isArray(query[key]))
                    query[key] = query[key].concat(value);
            } else {
                query[key] = value;
            }
        }

        Object.assign(router.query, query);

        return (<Component {...props} router={router}/>);
    });
}

export default withQueryParams;
