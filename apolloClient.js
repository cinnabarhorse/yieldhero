import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import fetch from 'isomorphic-unfetch'

export default function createApolloClient(initialState, ctx) {


  return new ApolloClient({
    ssrMode: Boolean(ctx),
    link: new HttpLink({
      // uri: 'https://api.thegraph.com/subgraphs/name/nategeier/mint-factory',
      uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-kovan', //'', // Server URL (must be absolute)
      //credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
      fetch,
    }),
    cache: new InMemoryCache().restore(initialState),
  })
}