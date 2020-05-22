export const initialState = {
  authUser: undefined,

  userReserves: undefined,
  reservePools: undefined,
  currentPool: undefined,
  highestAPY: undefined,

  //web3
  currentAccount: undefined,
  currentNetwork: undefined,

  ensProvider: undefined,

  //Swap aTokens
  selectedIn: undefined,
  selectedOut: undefined,
  currentSwap: undefined,
  availableSwaps: undefined,

  //Header
  currentHeader: "Yield Hero",

  //Redirect Yield
  selectedToken: undefined,
  selectedCreator: undefined,
  selectedLeaderboard: undefined,

  //modals
  showAuthModal: false,
  showTweetModal: false

};
