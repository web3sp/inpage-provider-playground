import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

import { testContract } from './test-venom-contract'

export const SendExternalMessage = ({
  provider,
  networkId,
  address,
}: {
  provider: ProviderRpcClient
  networkId?: number | string
  address?: string
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  const [transaction, setTransaction] = useState<any | undefined>()
  const [decodedTransaction, setDecodedTransaction] = useState<any | undefined>()
  const [decodedTransactionEvents, setDecodedTransactionEvents] = useState<any | undefined>()

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransaction(undefined)
    setDecodedTransaction(undefined)
    setDecodedTransactionEvents(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    const _publicKey = providerState?.permissions.accountInteraction?.publicKey
    // setAddress(_address)

    try {
      if (_publicKey) {
        const senderPublicKey = _publicKey

        const { transaction: tr, output } = await provider.rawApi.sendExternalMessage({
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

        console.log(`output::`, output)

        setTransaction(tr)
        console.log(`transaction::`, tr)

        const _decodedTransaction = await provider.rawApi.decodeTransaction({
          abi: JSON.stringify(testContract.testContractAbi),
          transaction: tr,
          method: 'setState',
        })
        setDecodedTransaction(_decodedTransaction)
        console.log(`decodedTransaction::`, _decodedTransaction)

        const _decodedTransactionEvents = await provider.rawApi.decodeTransactionEvents({
          abi: JSON.stringify(testContract.testContractAbi),
          transaction: tr,
        })
        setDecodedTransactionEvents(_decodedTransactionEvents)
        console.log(`decodedTransactionEvents::`, _decodedTransactionEvents)
      }
    } catch (e) {
      setTransaction(e as any)
    } finally {
      setIsLoading(false)
    }
  }

  // eslint-disable-next-line eqeqeq
  if (!(networkId && testContract.getTestContractAddress(networkId)))
    return <strong>sendExternalMessage: Not available on this network</strong>

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>sendExternalMessage</Panel.Title>
      <Panel.Description>with decodeTransaction and decodeTransactionEvents</Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='mt-2 text-gray-400'>Address</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <div className='break-all font-mono '>{address}</div>
        </div>
      </Panel.Input>

      <Panel.Output active={transaction || decodedTransaction || decodedTransactionEvents}>
        <div className='mt-2 text-gray-400'>Transaction</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transaction} />
        </div>

        <div className='mt-6 text-gray-400'>Decoded transaction</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={decodedTransaction} />
        </div>
        <div className='mt-6 text-gray-400'>Decoded transaction events</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={decodedTransactionEvents} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
