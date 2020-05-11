import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'

export default function createApolloClient(initialState, ctx) {


  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-kovan',
      //uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-raw',
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  })
}