export const reducer = (state, action) => {

  switch (action.type) {
    case "updateUserReserves":
      return {
        ...state,
        userReserves: action.userReserves
      };

    case "updatePool":
      return {
        ...state,
        currentPool: action.currentPool
      };

    case "updateReservePools":
      return {
        ...state,
        reservePools: action.reservePools
      };

    case "updateHighestAPY":
      return {
        ...state,
        highestAPY: action.highestAPY
      }

    case "updateWeb3":
      return {
        ...state,
        globalWeb3: action.globalWeb3
      }

    case "updateCurrentAccount":
      return {
        ...state,
        currentAccount: action.currentAccount
      }

    case "updateCurrentNetwork":
      return {
        ...state,
        currentNetwork: action.currentNetwork
      }

    case "updateShowAuthModal":
      return {
        ...state,
        showAuthModal: action.showAuthModal
      }

    case "updateSelectedIn":
      return {
        ...state,
        selectedIn: action.selectedIn
      }

    case "updateSelectedOut":
      return {
        ...state,
        selectedOut: action.selectedOut
      }

    case "updateCurrentSwap":
      return {
        ...state,
        currentSwap: action.currentSwap
      }

    case "updateAvailableSwaps":
      return {
        ...state,
        availableSwaps: action.availableSwaps
      }

    default:
      return state;
  }
};
