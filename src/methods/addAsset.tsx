import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const rootContractInVenomTestnetNetwork = new Address(
  '0:22adbe0821ec0b6d9e3063ffeaae8f7478384bf666421a5678769ef2059d25ef',
)
const rootContractInVenomNewTestnetNetwork = new Address(
  '0:f8b9af7edf89b4a7b199a2f89b4798dbfbd0e50fa146b5f3fd24fefb6313927e',
)

const getRootContract = (networkId: number) => {
  switch (networkId) {
    case 1000:
      return rootContractInVenomTestnetNetwork

    case 1337:
      return rootContractInVenomNewTestnetNetwork

    default:
      return undefined
  }
}

export const AddAsset = ({ provider, networkId }: { provider: ProviderRpcClient; networkId?: string | number }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [address, setAddress] = useState<Address | undefined>()
  const [rootContractAddress, setRootContractAddress] = useState(getRootContract(+networkId!))
  const [isNewAsset, setIsNewAsset] = useState<any | undefined>()
  const [callData, setCallData] = useState<any | undefined>(undefined)

  const addAsset = async () => {
    setActive(true)
    setIsLoading(true)

    setAddress(undefined)
    setIsNewAsset(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    setAddress(_address)

    if (!_address) return

    setCallData({
      account: _address,
      type: 'tip3_token',
      params: {
        rootContract: rootContractAddress,
      },
    })
    try {
      const { newAsset } = await provider.addAsset({
        account: _address,
        type: 'tip3_token',
        params: {
          rootContract: rootContractAddress!,
        },
      })
      setIsNewAsset(newAsset)
    } catch (error) {
      setIsNewAsset(error as any)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>addAsset</Panel.Title>
      <Panel.Description>
        The addAsset method is used to create a new asset and add it to the account.
      </Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={addAsset}>
          Run
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='mb-2 flex w-full flex-col items-center align-middle lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Token Root Contract</span>
          <div className='mb-2 ml-2 flex w-full flex-col'>
            <input
              value={rootContractAddress?.toString()}
              autoFocus={false}
              onChange={(e) => {
                setRootContractAddress(new Address(e.target.value))
                setIsLoading(false)
              }}
              className='w-full rounded bg-white bg-opacity-10 p-2 text-white'
            />
          </div>
        </div>
        {callData && <RJson src={callData} />}
      </Panel.Input>

      <Panel.Output active={true}>
        <div className='mb-6 text-gray-400'>
          This is a new asset:
          {isNewAsset !== undefined ? (
            isNewAsset.message ? (
              <RJson src={isNewAsset} />
            ) : (
              <span className={isNewAsset ? 'ml-2 text-lightgreen' : 'ml-2 text-red-500'}>
                {isNewAsset?.toString()}
              </span>
            )
          ) : (
            ''
          )}
        </div>
      </Panel.Output>
    </Panel>
  )
}
