import { useQuery, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import ErrorMessage from './ErrorMessage'
import { USER_RESERVES, USER_RESERVES_SUBSCRIPTION } from '../graphql/queries'

import { Container, Row, Col } from 'react-bootstrap'
import { useEffect } from 'react'
import { useStateValue } from '../State/globalState'
import { User, UserReserveType } from '../types'
import { themeGradient } from '../theme'

function convertFromPower(amount: string, power: number) {
  return (Number(amount) / Math.pow(10, power))
}

const aaveRateDecimals = 27




export default function UserReserve() {

  const [{ userReserves, reservePools, highestAPY, globalWeb3, currentAccount, selectedIn }, dispatch]:
    [{ userReserves: any, reservePools: any, highestAPY: any, globalWeb3: any, currentAccount: any, selectedIn: UserReserveType }, (type) => void] = useStateValue()

  const { called, loading, error, data, } = useQuery(
    USER_RESERVES,
    {
      variables: {
        id: currentAccount ? currentAccount.toLowerCase() : undefined
      },
      // Setting this value to true will make the component rerender when
      // the "networkStatus" changes, so we are able to know if it is fetching
      // more data
      //  onSubscriptionData: (data) => {
      //    console.log('data:', data)
      //  },
      notifyOnNetworkStatusChange: true,
    }
  )


  /*
  useEffect(() => {
    if (currentAccount) {
      loadReserves()
    }
  }, [currentAccount])
  */

  useEffect(() => {

    if (!userReserves && data) {
      dispatch({
        type: 'updateUserReserves',
        userReserves: data.user
      })
    }

    if (data && data.user && !highestAPY) {

      const userObject: User = data.user

      const max = userObject.reserves.reduce(function (prev, current) {
        return (prev.reserve.liquidityRate > current.reserve.liquidityRate) ? prev : current
      }) //

      console.log('max:', max)

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


        <h2 style={{ textAlign: 'center', background: themeGradient, color: 'white' }}>Select Input aToken</h2>

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

          {data && data.user.reserves && data.user.reserves.map((reserve, index) => {

            const name = reserve.reserve.name
            const amount = (Number(reserve.principalATokenBalance) / Math.pow(10, reserve.reserve.decimals))
            const amountInEth = convertFromPower(reserve.reserve.price.priceInEth, 18) * amount


            return (

              <button
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
                  <div style={{ textAlign: 'left' }}>{name}</div>
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
  if (called && loading) return _box()

  //  const { user } = data

  //  if (user === null) return <div>User not found!</div>

  // const userObject: User = user

  return _box()
}
