import { XMarkIcon } from '@heroicons/react/24/outline'
import { ProviderRpcClient } from 'everscale-inpage-provider'
import { ConnectionProperties, EverscaleStandaloneClient } from 'everscale-standalone-client'
import { useEffect, useState } from 'react'

import { VenomConnect } from 'venom-connect'
import Button from './components/Button'
import Footer from './components/Footer'

import Header from './components/Header'
import { methods } from './methods'
import { testContract } from './methods/test-venom-contract'

const initTheme = 'light' as const

const getNetworkData = (checkNetworkId: number, field: keyof typeof NETWORKS.venom) => {
  switch (checkNetworkId) {
    case 1000:
      return NETWORKS.venomTestnet[field]

    case 1:
    default:
      return NETWORKS.venom[field]
  }
}

const standaloneFallback = (checkNetworkId: number = 1000) =>
  EverscaleStandaloneClient.create({
    connection: getNetworkData(checkNetworkId, 'connection') as ConnectionProperties,
  })

type ToggledNetworks = 1 | 1000 // | 1010;

const NETWORKS = {
  venom: {
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
  venomTestnet: {
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
}

const initVenomConnect = async (checkNetworkId: number = 1000) => {
  return new VenomConnect({
    theme: initTheme,
    checkNetworkId: checkNetworkId,
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
      // everwallet: {
      //   links: {
      //     qr: null,
      //   },
      //   walletWaysToConnect: [
      //     {
      //       // NPM package
      //       package: ProviderRpcClient,
      //       packageOptions: {
      //         fallback: VenomConnect.getPromise('everwallet', 'extension') || (() => Promise.reject()),
      //         forceUseFallback: true,
      //       },
      //       packageOptionsStandalone: {
      //         fallback: standaloneFallback,
      //         forceUseFallback: true,
      //       },
      //       id: 'extension',
      //       type: 'extension',
      //     },
      //   ],
      //   defaultWalletWaysToConnect: [
      //     // List of enabled options
      //     'mobile',
      //     'ios',
      //     'android',
      //   ],
      // },
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

  const [currentNetworkId, setCurrentNetworkId] = useState<ToggledNetworks>(
    1000,
    // Number.parseInt(window.location.pathname.split('/')[1]) || 1,
  )

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

  const checkAuth = async (_venomConnect: any) => {
    const auth = await _venomConnect?.checkAuth()
    if (auth) await getAddress(_venomConnect)
  }

  const onInitButtonClick = async () => {
    const initedVenomConnect = await initVenomConnect(currentNetworkId)
    setVenomConnect(initedVenomConnect)

    await checkAuth(initedVenomConnect)
  }

  useEffect(() => {
    onInitButtonClick()
  }, [currentNetworkId])

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

    check(provider)
  }

  useEffect(() => {
    const off = venomConnect?.on('connect', onConnect)

    return () => {
      off?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venomConnect])

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
      <h1 className='mx-auto  text-center text-3xl font-bold lg:text-5xl'>The&nbsp;Cow</h1>
      <h1 className='mx-auto  mt-2 text-center text-xl text-gray-500 lg:text-2xl'>Inpage Provider Playground</h1>
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

                {/* {currentNetworkId === 1000 && ( */}
                {/*   <> */}
                {/*     <h2>or</h2> */}
                {/*     <div> */}
                {/*       {venomConnect && ( */}
                {/*         <Button onClick={onStandaloneCall} icon={false}> */}
                {/*           Standalone test contract call */}
                {/*         </Button> */}
                {/*       )} */}
                {/*     </div> */}
                {/*   </> */}
                {/* )} */}
                {/* {currentNetworkId === 1000 && ( */}
                {/*   <div> */}
                {/*     <p> */}
                {/*       getMuldivmod({'{'} */}
                {/*       <br /> */}
                {/*       a: 4, */}
                {/*       <br /> */}
                {/*       b: 5, */}
                {/*       <br /> */}
                {/*       c: random 1-3, */}
                {/*       <br /> */}
                {/*       {'}'} */}
                {/*     </p> */}
                {/*     <pre> */}
                {/*       {(standaloneMethodsIsFetching ? <i>Standalone request in progress</i> : info) || ( */}
                {/*         <span>&nbsp;</span> */}
                {/*       )} */}
                {/*     </pre> */}
                {/*   </div> */}
                {/* )} */}
              </div>

              <div className='mt-16 text-sm lg:text-base'>
                <div className='flex w-full items-center'>
                  <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Venom Connect theme</span>
                  <span className='mr-4'>{theme}</span>
                  <Button onClick={onToggleThemeButtonClick} icon={false}>
                    Toggle theme
                  </Button>
                </div>

                <div className='mt-4 flex w-full items-center'>
                  <span className='mr-4 w-1/4 shrink-0 text-gray-400'>NetworkId</span>
                  <span className='mr-4'>{currentNetworkId}</span>
                  <Button
                    onClick={() => {
                      setCurrentNetworkId(currentNetworkId === 1 ? 1000 : 1)
                    }}
                    icon={false}
                  >
                    Toggle Network
                  </Button>
                </div>
                <div className='flex w-full items-center'>
                  <span className='mr-4 w-1/4 shrink-0 text-gray-400'>Network</span>
                  {getNetworkData(currentNetworkId, 'name') as string}
                </div>
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
                      className='m-0 block h-10 w-full cursor-text overflow-visible overflow-ellipsis rounded-lg border border-solid border-gray-700 bg-transparent py-0 pr-10 pl-3 text-sm font-normal leading-5 tracking-wide text-white hover:shadow-[0_0_5px_1px_#9297e2] focus:shadow-[0_0_5px_1px_#9297e2] focus:outline-none'
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
