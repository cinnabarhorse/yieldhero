import { useQuery, } from '@apollo/react-hooks'
import ErrorMessage from '../ErrorMessage'
import { USER_RESERVES } from '../../graphql/queries'

import { Container, Row, Col } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useStateValue } from '../../State/globalState'
import { User, UserReserveType } from '../../types'
import { swapGradient } from '../../theme'


function convertFromPower(amount: string, power: number) {
  return (Number(amount) / Math.pow(10, power))
}

const aaveRateDecimals = 27




export default function InputToken() {

  const [ens, setEns] = useState(undefined)

  const [{ userReserves, highestAPY, currentAccount, selectedIn, globalWeb3 }, dispatch]:
    [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedIn: UserReserveType }, (type) => void] = useStateValue()

  const { loading, error, data, refetch } = useQuery(
    USER_RESERVES,
    {
      variables: {
        id: currentAccount ? currentAccount.toLowerCase() : undefined
      },
      pollInterval: 1000
    }
  )

  useEffect(() => {

    if (!userReserves && data) {
      dispatch({
        type: 'updateUserReserves',
        userReserves: data.user
      })
    }

    if (data && data.user && data.user !== null && data.user.reserves !== null && !highestAPY) {

      const userObject: User = data.user

      const max = userObject.reserves.reduce(function (prev, current) {
        return (prev.reserve.liquidityRate > current.reserve.liquidityRate) ? prev : current
      }) //


      dispatch({
        type: "updateHighestAPY",
        highestAPY: (convertFromPower(max.reserve.liquidityRate, 27) * 100)
      })
    }


  }, [data])

  function _box() {

    // if (!data) return <div>Loading</div>
    return (
      <Col //xl={6} lg={6} md={12} sm={12} xs={12}
        style={{ boxShadow: '0 2px 4px 0 rgba(136,144,195,0.2), 0 5px 15px 0 rgba(37,44,97,0.15)', padding: 0, minHeight: 300 }}>


        <h2 style={{ textAlign: 'center', background: swapGradient, color: 'white' }}>Select Input aToken</h2>

        <div style={{ display: 'block', padding: 10 }}>

          <div style={{ display: 'flex' }}>

            <Col>
              <strong>
                Token Name
              </strong>
            </Col>


            <Col>
              <strong>
                Amount Held
              </strong>
            </Col>


            <Col>
              <strong>
                Current APY
          </strong>

            </Col>
          </div>

          {data && data.user !== null && data.user.reserves && data.user.reserves !== null && data.user.reserves.map((reserve: UserReserveType, index) => {

            const name = "a" + reserve.reserve.symbol
            const amount = (Number(reserve.principalATokenBalance) / Math.pow(10, reserve.reserve.decimals))
            const amountInEth = convertFromPower(reserve.reserve.price.priceInEth, 18) * amount

            const availableTokens = [
              "usdt", "dai", "susd", "usdc", "tusd", "busd"
            ]


            if (!availableTokens.includes(reserve.reserve.symbol.toLowerCase())) return null

            return (

              <button
                key={index}
                style={{ width: '100%' }}
                className={selectedIn && selectedIn.reserve.symbol === reserve.reserve.symbol ? "buttonSelected" : "buttonUnselected"}
                onClick={() => {

                  if (selectedIn && reserve.reserve.symbol === selectedIn.reserve.symbol) {
                    dispatch({
                      type: "updateSelectedIn",
                      selectedIn: undefined
                    })
                  }

                  else {
                    dispatch({
                      type: "updateSelectedIn",
                      selectedIn: reserve
                    })
                  }


                  dispatch({
                    type: "updateCurrentSwap",
                    currentSwap: undefined
                  })


                }}



              >




                <Col>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img style={{ height: 40, marginLeft: -10, marginRight: 8 }} src={`/coins/${reserve.reserve.symbol.toLowerCase()}.svg`} />
                    <div style={{ textAlign: 'left' }}>{name}</div>
                  </div>

                </Col>

                <Col>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>


                    {amount.toFixed(4)}
                    <div style={{ fontSize: '10px' }}>
                      ({amountInEth.toFixed(4)} ETH)
                    </div>
                  </div>
                </Col>

                <Col>
                  <div>
                    APY:   {(convertFromPower(reserve.reserve.liquidityRate, aaveRateDecimals) * 100).toFixed(4)}%
                </div>

                </Col>




              </button>

            )



          })}

          {data && data.user !== null && data.user.reserves.length <= 0 &&
            <div>You don't have any aTokens!</div>
          }



          <style jsx>{`
          section {
            padding-bottom: 20px;
          }
          li {
            display: block;
            margin-bottom: 10px;
          }
          div {
            align-items: center;
            display: flex;
          }
          a {
            font-size: 14px;
            margin-right: 10px;
            text-decoration: none;
            padding-bottom: 0;
            border: 0;
          }
          span {
            font-size: 14px;
            margin-right: 5px;
          }
          ul {
            margin: 0;
            padding: 0;
          }
  
          button {
            background:none;
            color:#303952;
            margin-top:10px;
            margin-bottom:10px;
            transition: box-shadow 0.2s;
          }
  
          button:hover {
            box-shadow:rgba(182, 80, 158, 0.5) 0px 2px 10px 0px !important
          }
  
          .buttonSelected {
            background:#303952;
            color:white;
          }
  
          .buttonUnselected {
  
          }
         
        `}</style>

        </div>
      </Col >
    )
  }



  if (error) return <ErrorMessage message="Error loading posts." />

  //  const { user } = data

  //  if (user === null) return <div>User not found!</div>

  // const userObject: User = user

  return _box()
}
