import { Address, ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import { testContract } from './test-venom-contract'

export const SendExternalMessageDelayed = ({
  provider,
  networkId,
}: {
  provider: ProviderRpcClient
  networkId?: number | string
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [address, setAddress] = useState<Address | undefined>()
  const [message, setMessage] = useState<any | undefined>()
  const [callData, setCallData] = useState<any | undefined>()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setMessage(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    const _publicKey = providerState?.permissions.accountInteraction?.publicKey
    setAddress(_address)

    try {
      if (_publicKey) {
        const senderPublicKey = _publicKey

        setCallData({
          publicKey: senderPublicKey?.toString(),
          recipient: testContract.getTestContractAddress(networkId!),
          payload: {
            abi: JSON.stringify(testContract.testContractAbi),
            method: 'setState',
            params: {
              _state: Date.now(),
            },
          },
        })

        const { message: _message } = await provider.rawApi.sendExternalMessageDelayed({
          publicKey: senderPublicKey?.toString(),
          recipient: testContract.getTestContractAddress(networkId!),
          payload: {
            abi: JSON.stringify(testContract.testContractAbi),
            method: 'setState',
            params: {
              _state: Date.now(),
            },
          },
        })

        setMessage(_message)

        console.log(`message::`, _message)
      }
    } catch (error) {
      setMessage(error as any)
    } finally {
      setIsLoading(false)
    }
  }

  // eslint-disable-next-line eqeqeq
  if (!(networkId && testContract.getTestContractAddress(networkId)))
    return <strong>sendExternalMessageDelayed: Not available on this network</strong>

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>sendExternalMessageDelayed</Panel.Title>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>

      {callData && (
        <Panel.Input>
          <RJson src={callData} />
        </Panel.Input>
      )}

      <Panel.Output active={!!message}>
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={message} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
