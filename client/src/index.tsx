import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import gql from "graphql-tag";
import { ApolloProvider, useQuery } from '@apollo/react-hooks';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';
import { resolvers, typeDefs } from './resolvers';
import Login from './pages'

const cache = new InMemoryCache();
const link = new HttpLink({
    uri: 'http://localhost:4000/',
    headers: {
        authorization: localStorage.getItem('token'),
    },
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: [],
    },
});

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link,
    typeDefs,
    resolvers
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}

injectStyles();
ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
);