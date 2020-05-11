import gql from 'graphql-tag'

export const USER_RESERVES = gql`
  
    query getUser($id:String!) {
      user(id:$id) {
        reserves {
          id
          borrowRate
          principalBorrows
          principalATokenBalance
          reserve {
            id
            liquidityRate
            symbol
            name
            decimals
            price {
              id
              priceInEth
            }
            aToken{
              id
            }
          }
        }
    }
 
  }
`

export const ALL_RESERVES = gql`
{
  reserves {
    id
    symbol
    variableBorrowRate
    stableBorrowRate
    liquidityRate
    price {
      id
      priceInEth
    }
    aToken {
      id
    }
    utilizationRate
    availableLiquidity
    name
    decimals
  }
}
`


export const USER_RESERVES_INTEREST = gql`
  
    query getUser($id:String!) {
      user(id:$id) {
        reserves {
          id
          borrowRate
          principalBorrows
          principalATokenBalance
          interestRedirectionAddress
          redirectedBalance
          reserve {
            id
            liquidityRate
            symbol
            name
            decimals
            price {
              id
              priceInEth
            }
            aToken{
              id
            }
          }
        }
    }
 
  }
`

export const USERS_BY_REDIRECT_BALANCE = gql`
{
  userReserves(orderBy:principalATokenBalance, orderDirection:desc, where: {
      interestRedirectionAddress_not:"0x0000000000000000000000000000000000000000"
  }) {
    id
    user{
      id
    }
    redirectedBalance
    principalATokenBalance
    interestRedirectionAddress

    reserve {
      id
      decimals
      symbol
      price {
        id
        priceInEth
      }
    }
  }
}
`

export const RECIPIENT_REDIRECTS = gql`
{userReserves(where:{interestRedirectionAddress_in: ["0xc3c2e1cf099bc6e1fa94ce358562bcbd5cc59fe5","0x94cb5c277fcc64c274bd30847f0821077b231022","0x51208e5cc9215c6360210c48f81c8270637a5218"]}) {
  user{
    id
  }
  reserve {
    id
    symbol
    price {
      id
      priceInEth
    }
    decimals
  }
  interestRedirectionAddress
  principalATokenBalance
}}
`