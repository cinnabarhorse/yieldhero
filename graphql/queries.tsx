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
      interestRedirectionAddress_not_in: ["0x0000000000000000000000000000000000000000","0x5ae7e199ec6acfe1d7ee28401637a0ae897818c1"]
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

query getUserReserves(
  $addressArray:[String]!
  ) 

{userReserves(where:{interestRedirectionAddress_in: $addressArray}) {
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