from web3 import Web3


class OlympusWeb3Provider:
    w3 = Web3(Web3.HTTPProvider("https://beta-rpc.mainnet.computecoin.com/"))
    