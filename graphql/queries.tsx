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


export const USER_RESERVES_SUBSCRIPTION = gql`
  
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
