import {ApolloClient, InMemoryCache} from "@apollo/client";
import {BACKEND_URL} from "../config";


const Apollo = () => {
    return new ApolloClient({
        uri: BACKEND_URL + '/graphql',
        cache: new InMemoryCache()
    })
}

export default Apollo()