
export interface Price {
    priceInEth: string
}

export interface aToken {
    id: string
}

export interface ReserveType {
    id: string
    symbol: string
    price: Price
    name: string
    decimals: number
    isActive: boolean
    aToken: aToken
    liquidityRate: string
}

export interface UserReserveType {
    id: string
    principalBorrows: string
    principalATokenBalance: string
    reserve: ReserveType
    borrowRate: string
    interestRedirectionAddress?: string
    redirectedBalance?: string
    user?: UserType
}

export interface UserType {
    id: string
}

export interface User {
    reserves: UserReserveType[]
}

export type TradeState = "waitingConfirm" | "trading" | "approving"

export interface CreatorType {
    name: string
    bio: string
    wallet: string
    ens: string
    img: string
    twitter?: string
}