import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const rootContractInVenomTestnetNetwork = new Address(
  '0:9f7ea6114790635e102c9f808c9dc4969a86699b7574ab679087170b12edb768',
)

export const AddAsset = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [address, setAddress] = useState<Address | undefined>()
  const [rootContractAddress, setRootContractAddress] = useState<string | undefined>()
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

    let rootContract = null
    switch (providerState.networkId) {
      case 1:
      case 1000:
      default:
        rootContract = rootContractInVenomTestnetNetwork
        break
    }

    setRootContractAddress(rootContract?.toString())
    setCallData({
      account: _address,
      type: 'tip3_token',
      params: {
        rootContract,
      },
    })
    const { newAsset } = await provider.addAsset({
      account: _address,
      type: 'tip3_token',
      params: {
        rootContract,
      },
    })

    setIsNewAsset(newAsset)

    setIsLoading(false)
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

      {callData && (
        <Panel.Input>
          <RJson src={callData} />
        </Panel.Input>
      )}

      <Panel.Output active={true}>
        <div className='mb-6 text-gray-400'>
          This is a new asset:
          {isNewAsset !== undefined ? (
            <span className={isNewAsset ? 'ml-2 text-lightgreen' : 'ml-2 text-red-500'}>{isNewAsset?.toString()}</span>
          ) : (
            ''
          )}
        </div>
      </Panel.Output>
    </Panel>
  )
}
