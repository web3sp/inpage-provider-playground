import { XMarkIcon } from '@heroicons/react/24/outline'
import {Address, ProviderRpcClient} from 'everscale-inpage-provider'
import { ConnectionProperties, EverscaleStandaloneClient } from 'everscale-standalone-client'
import { useEffect, useState } from 'react'

import { VenomConnect } from 'venom-connect'
import Button from './components/Button'
import Footer from './components/Footer'

import Header from './components/Header'
import Select from './components/Select'
import { methods } from './methods'
import { StandaloneCall } from './methods/standaloneCall'
import { testContract } from './methods/test-venom-contract'
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const initTheme = 'light' as const

const getNetworkData = (checkNetworkId: number) => {
  return NETWORKS.find((network) => network.checkNetworkId === checkNetworkId)
}

const standaloneFallback = (checkNetworkId: number = 1000) =>
    EverscaleStandaloneClient.create({
      connection: getNetworkData(checkNetworkId)?.connection as ConnectionProperties,
    })

const NETWORKS = [
  {
    name: 'Venom Mainnet',
    checkNetworkId: 1,
    connection: {
      id: 1,
      group: 'venom_mainnet',
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc.venom.foundation/rpc',
      },
    },
  },
  {
    name: 'Venom Testnet',
    checkNetworkId: 1000,
    connection: {
      id: 1000,
      group: 'venom_testnet',
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc-testnet.venom.foundation/rpc',
      },
    },
  },
  // {
  //   name: "Ever network",
  //   checkNetworkId: 8844,
  //   // networkId:14,
  //   // description: {
  //   //     globalId: 1,
  //   //     capabilities: "",
  //   //     signatureId: undefined
  //   // },
  //   connection: {
  //     id:1300,
  //     type: 'jrpc',
  //     data: {
  //       endpoint: 'https://jrpc.venom.rs',
  //     }},
  //   // config: {
  //   //   explorerBaseUrl: 'https://everscan.io',
  //   //   tokensManifestUrl: "TOKENS_MANIFEST_URL",
  //   // }
  // },
  {
    name: 'Venom Testnet 1337',
    checkNetworkId: 1337,
    connection: {
      id: 1337,
      group: 'venom_testnet',
      type: 'jrpc',
      data: {
        endpoint: 'https://jrpc-broxustestnet.everwallet.net/rpc',
      },
      config: {}
    },
  },
]

function getNetworkName(networkId: number) {
  for (const networkKey in NETWORKS) {
    if (NETWORKS.hasOwnProperty(networkKey)) {
      const network = NETWORKS[networkKey]
      if (network.checkNetworkId === networkId) {
        return network.name
      }
    }
  }
  return 'Unknown Network'
}

const initVenomConnect = async (checkNetworkId: number = 1000) => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: checkNetworkId,
    checkNetworkName: getNetworkName(checkNetworkId),
    providersOptions: {
      venomwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('venomwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          'mobile',
          'ios',
          'android',
        ],
      },
      everwallet: {
        links: {
          qr: null,
        },
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('everwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          'mobile',
          'ios',
          'android',
        ],
      },
      oneartwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('oneartwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          // 'mobile',
          'ios',
          'android',
        ],
      },
      oxychatwallet: {
        walletWaysToConnect: [
          {
            // NPM package
            package: ProviderRpcClient,
            packageOptions: {
              fallback: VenomConnect.getPromise('oxychatwallet', 'extension') || (() => Promise.reject()),
              forceUseFallback: true,
            },
            packageOptionsStandalone: {
              fallback: standaloneFallback,
              forceUseFallback: true,
            },

            // Setup
            id: 'extension',
            type: 'extension',
          },
        ],
        defaultWalletWaysToConnect: [
          // List of enabled options
          'mobile',
          'ios',
          'android',
        ],
      },
    },
  })
}

const themesList = ['light', 'dark', 'venom']

const App = () => {
  const [venomConnect, setVenomConnect] = useState<any>()
  const [venomProvider, setVenomProvider] = useState<any>()
  const [address, setAddress] = useState()
  const [balance, setBalance] = useState()
  const [publicKey, setPublicKey] = useState()
  const [theme, setTheme] = useState(initTheme)
  const [info, setInfo] = useState('')
  const [standaloneMethodsIsFetching, setStandaloneMethodsIsFetching] = useState(false)
  const [filter, setFilter] = useState<string>('')

  const [currentNetworkId, setCurrentNetworkId] = useState<number>(
      localStorage.getItem('selectedNetwork')
          ? Number(localStorage.getItem('selectedNetwork'))
          : NETWORKS[0].connection.id,
      // Number.parseInt(window.location.pathname.split('/')[1]) || 1,
  )
  useEffect(() => {
    if (currentNetworkId) localStorage.setItem('selectedNetwork', currentNetworkId.toString())
  }, [currentNetworkId])

  const getTheme = () => venomConnect?.getInfo()?.themeConfig?.name?.toString?.() || '...'

  const onToggleThemeButtonClick = async () => {
    const currentTheme = getTheme()

    const lastIndex = themesList.length - 1

    const currentThemeIndex = themesList.findIndex((item) => item === currentTheme)

    const theme =
        currentThemeIndex >= lastIndex || !~currentThemeIndex || !~lastIndex
            ? themesList[0]
            : themesList[currentThemeIndex + 1]

    await venomConnect?.updateTheme(theme)

    setTheme(getTheme())
  }

  const getAddress = async (provider: any) => {
    const providerState = await provider?.getProviderState?.()

    const address = providerState?.permissions.accountInteraction?.address.toString()

    return address
  }

  const getPublicKey = async (provider: any) => {
    const providerState = await provider?.getProviderState?.()

    const publicKey = providerState?.permissions.accountInteraction?.publicKey.toString()

    return publicKey
  }

  const getBalance = async (provider: any, _address: string) => {
    try {
      const providerBalance = await provider?.getBalance?.(_address)

      return providerBalance
    } catch (error) {
      return undefined
    }
  }
  const subscribeOnContract = async (address: string, _provider: ProviderRpcClient) => {
    if (!address || !_provider) {
      console.error('subscribeOnContract: no addr or provider')
      return
    }
    const _address  = new Address((address))

    const subscriber = new _provider.Subscriber()
    // @ts-ignore
    const networkChangeSubscription = await _provider.subscribe('networkChanged', { address: _address })
    networkChangeSubscription.on('data', async () => {
      await getBalance(_provider, address)
    })
    const statesStream = subscriber.states(_address)

    return new Promise((resolve) => {
      statesStream.makeProducer(
          async (evt: any) => {
            const bal = evt?.state?.balance || undefined
            setBalance(bal)

            return false
          },
          () => {
            resolve(balance)
            subscriber.unsubscribe()
          },
      )
    })


  }

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth()
    if (auth) {
     const _address=  await getAddress(_venomConnect)
      // await subscribeOnContract(_address,venomProvider)
    }
  }

  const onInitButtonClick = async () => {

    const initedVenomConnect = await initVenomConnect(currentNetworkId as number)
    setVenomConnect(initedVenomConnect)

    await checkAuth(initedVenomConnect)


  }

  useEffect(() => {
    onInitButtonClick()
  }, [currentNetworkId])

  const  onChangeNetwork = async (provider?:ProviderRpcClient) => {
    if(venomConnect && provider ) {
      // await venomProvider.ensureInitialized()
      const response = await provider.changeNetwork({networkId:currentNetworkId})
      if(response.network === null) {
        await provider.ensureInitialized()
        const newNetwork =  NETWORKS.find((item)=>item.checkNetworkId === currentNetworkId)
        if(newNetwork) {
          await provider.ensureInitialized()
          venomProvider.addNetwork({
            switchNetwork: true,
            network: {
              networkId: currentNetworkId,
              name: "Venom Testnet 1337",

              connection: {
                type: newNetwork.connection.type, data: {
                  endpoint: newNetwork.connection.data.endpoint
                }
              },
              config:{

              },
            },
          })
        }
      }
      //
    }
  }
  const onConnectButtonClick = async () => {
    venomConnect?.connect()

  }

  const onDisconnectButtonClick = async () => {
    venomProvider?.disconnect()
  }

  const check = async (_provider: any) => {
    const _address = _provider ? await getAddress(_provider) : undefined
    const _balance = _provider && _address ? await getBalance(_provider, _address) : undefined
    const _publicKey = _provider ? await getPublicKey(_provider) : undefined

    setAddress(_address)

    setBalance(_balance)
    setPublicKey(_publicKey)


    if (_provider && _address)
      setTimeout(() => {
        check(_provider)
      }, 100)
  }

  const onConnect = async (provider: any) => {
    setVenomProvider(provider)

    await check(provider)
    await onChangeNetwork(provider)
    setTimeout(() => {
      check(provider)
    }, 1000)
  }

  useEffect(() => {
    const off = venomConnect?.on('connect', onConnect)

    return () => {
      off?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect])
  // useEffect(() => {
  //   console.log("venomConnect.checkNetworkId::",venomConnect.checkNetworkId)
  //   console.log("currentNetworkId",currentNetworkId)
  //   if(venomProvider?.checkNetworkId && (venomConnect?.checkNetworkId !== currentNetworkId)) setCurrentNetworkId(venomConnect?.checkNetworkId)
  // }, [venomConnect?.checkNetworkId]);

  const onStandaloneCall = async () => {
    const standalone: ProviderRpcClient | undefined = await venomConnect?.getStandalone('venomwallet')

    if (standalone) {
      const contract = new standalone.Contract(
          testContract.testContractAbi,
          testContract.getTestContractAddress(currentNetworkId),
      )
      setStandaloneMethodsIsFetching(true)
      const outputs = await contract.methods
          .getMuldivmod({
            a: 4,
            b: 5,
            c: (Date.now() % 3 ^ 0) + 1,
          } as never)
          .call()

      setInfo(JSON.stringify(outputs, null, 2))
    } else {
      alert('Standalone is not available now')
    }

    setStandaloneMethodsIsFetching(false)
  }

  return (
      <div className='bg-image relative flex min-h-screen w-full flex-col bg-black text-white'>
        <Header />
        <h1 className='mx-auto  text-center text-3xl font-bold lg:text-5xl'>Inpage Provider Playground</h1>
        {/* <h1 className='mx-auto  mt-2 text-center text-xl text-gray-500 lg:text-2xl'></h1> */}
        <div className='mx-auto max-w-5xl px-5 lg:px-0'>
          <div>
            {/* {!venomConnect && ( */}
            {/*   <div> */}
            {/*     <Button onClick={onInitButtonClick}>Init lib</Button> */}
            {/*   </div> */}
            {/* )} */}
            {venomConnect && (
                <div>
                  <div className='my-6 flex w-full flex-col items-center justify-center'>
                    <div>
                      {venomConnect && !address && (
                          <Button onClick={onConnectButtonClick} icon={false}>
                            Connect via pop up
                            <br />
                            (requestPermissions method)
                          </Button>
                      )}
                      {venomConnect && !!address && (
                          <Button onClick={onDisconnectButtonClick} icon={false}>
                            Disconnect
                            <br />
                            (Disconnect method)
                          </Button>
                      )}
                    </div>
                  </div>

                  <div className='mt-16 text-sm lg:text-base'>
                    <div className='flex w-full items-center'>
                      <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Venom Connect theme</span>
                      <span className='mr-4 w-14'>{theme}</span>
                      <Button onClick={onToggleThemeButtonClick} icon={false} className='w-36'>
                        Toggle theme
                      </Button>
                    </div>

                    <div className='mb-2 mt-4 flex w-full flex-col items-center sm:flex-row'>
                      <span className='mr-0 w-full text-gray-400 sm:mr-4 sm:w-1/4 sm:shrink-0'>NetworkId</span>
                      {/* <span className='mr-4 w-14'>{currentNetworkId}</span> */}
                      {/* <Button */}
                      {/*   className='w-36' */}
                      {/*   onClick={() => { */}
                      {/*     setCurrentNetworkId(currentNetworkId === 1000 ? 1337 : 1000) */}
                      {/*   }} */}
                      {/*   icon={false} */}
                      {/* > */}
                      {/*   Toggle Network */}
                      {/* </Button> */}
                      <Select
                          className='w-full sm:w-96'
                          onChange={(e: any) => {
                            setCurrentNetworkId(e)
                          }}
                          networks={NETWORKS}
                          currentNetworkId={currentNetworkId}
                      />
                    </div>
                    {/* <div className='flex w-full items-center'> */}
                    {/*   <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Network</span> */}
                    {/*   {getNetworkData(currentNetworkId)?.name as string} */}
                    {/* </div> */}
                    <div className='flex w-full items-center break-all'>
                      <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Address</span>
                      {address}
                    </div>
                    <div className='flex w-full items-center'>
                      <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Balance</span>
                      {balance ? (balance / 10 ** 9).toFixed(10) : undefined}
                    </div>

                    <div className='mt-4 flex w-full '>
                      <span className='mr-4 w-1/4 shrink-0 text-gray-400'>User agent</span>
                      <span className='break-all'>{window.navigator.userAgent}</span>
                    </div>
                  </div>

                  {venomConnect && !!address && (
                      <div className='mt-16'>
                        <div className='group relative mt-1 rounded-md shadow-sm'>
                          <input
                              type='text'
                              className='m-0 block h-10 w-full cursor-text overflow-visible overflow-ellipsis rounded-lg border border-solid border-gray-700 bg-transparent py-0 pl-3 pr-10 text-sm font-normal leading-5 tracking-wide text-white hover:shadow-[0_0_5px_1px_#9297e2] focus:shadow-[0_0_5px_1px_#9297e2] focus:outline-none'
                              // box-shadow: 0 0 5px 1px var(--input-border-ring);
                              placeholder='Filter methods by name'
                              value={filter}
                              onChange={(e) => {
                                setFilter(e.target.value)
                              }}
                              // style='box-shadow: none; outline: none; transition: all 0.25s ease 0s;'
                          />
                          <div className='absolute inset-y-0 right-0 z-10 flex items-center pr-3'>
                            <XMarkIcon
                                className='h-5 w-5 text-gray-800 hover:cursor-pointer group-focus-within:text-[#9297e2] group-hover:text-[#9297e2]'
                                aria-hidden='true'
                                onClick={() => setFilter('')}
                            />
                          </div>
                        </div>

                        <div className='my-10 overflow-hidden bg-white bg-opacity-5 shadow sm:rounded-md'>
                          <ul role='list' className='divide-y divide-gray-200 divide-opacity-10'>
                            {currentNetworkId && (!filter || 'standalone call'.includes(filter.toLowerCase())) && (
                                <li key={'call'} className=''>
                                  <StandaloneCall venomConnect={venomConnect} currentNetworkId={currentNetworkId} />
                                </li>
                            )}
                            {methods?.map((element, i) => {
                              const Element = element.method
                              if (!filter || element.name.toLowerCase().includes(filter.toLowerCase())) {
                                return (
                                    <li key={i} className=''>
                                      <Element
                                          provider={venomProvider}
                                          networkId={currentNetworkId}
                                          address={address}
                                          publicKey={publicKey}
                                      />
                                    </li>
                                )
                              } else return null
                            })}
                          </ul>
                        </div>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
  )
}

export default App
