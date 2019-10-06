const getContractInstance = async (web3, contractDefinition) => {
  // get network ID and the deployed address
  const networkId = await web3.eth.net.getId()
  const deployedAddress = contractDefinition.networks[networkId].address
  // create the instance
  const instance = new web3.eth.Contract(
    contractDefinition.abi,
    deployedAddress
  )
  return instance
}

const resolveWeb3 = (resolve) => {
  let { web3, ethereum } = window
  const alreadyInjected = typeof web3 !== 'undefined' // i.e. Mist/Metamask
  const localProvider = `http://localhost:9545`

  if (alreadyInjected) {
    console.log(`Injected web3 detected.`)
    web3 = new Web3(web3.currentProvider)
  } else {
    console.log(`No web3 instance injected, using Local web3.`)
    const provider = new Web3.providers.HttpProvider(localProvider)
    web3 = new Web3(provider)
  }

  resolve(web3)
}

const getWeb3 = () =>
  new Promise((resolve) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener(`load`, () => {
      resolveWeb3(resolve)
    })
    // If document has loaded already, try to get Web3 immediately.
    if (document.readyState === `complete`) {
      resolveWeb3(resolve)
    }
  })

const getAccounts = async () => {
  const web3 = await getWeb3();
  return await web3.eth.getAccounts();
};

const getBalance = async(addr) => {
  const web3 = await getWeb3()
  return (await web3.eth.getBalance(addr)) / 1000000000000000000
};
