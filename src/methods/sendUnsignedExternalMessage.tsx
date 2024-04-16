import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

import { testContract } from './test-venom-contract'

export const SendUnsignedExternalMessage = ({
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
  const [data, setData] = useState<string>(testContract.getTestContractAddress(networkId!))

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

    if (_publicKey) {
      const { transaction: tr, output } = await provider.rawApi.sendUnsignedExternalMessage({
        // recipient: testContract.getTestContractAddress(networkId!),
        recipient: data,
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
    setIsLoading(false)
  }

  // eslint-disable-next-line eqeqeq
  if (!(networkId && testContract.getTestContractAddress(networkId)))
    return <strong>sendUnsignedExternalMessage: Not available on this network</strong>

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>sendUnsignedExternalMessage</Panel.Title>
      <Panel.Description>with decodeTransaction and decodeTransactionEvents</Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>Test contract address</span>
          <Input
            value={data}
            autoFocus={false}
            onChange={(e) => {
              setData(e.target.value)
              setTransaction(undefined)
              setDecodedTransaction(undefined)
              setDecodedTransactionEvents(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(testContract.getTestContractAddress(networkId!))
              setTransaction(undefined)
              setDecodedTransaction(undefined)
              setDecodedTransactionEvents(undefined)
              setIsLoading(false)
            }}
          />
        </div>
        {/* <div className='flex w-full flex-col lg:flex-row'> */}
        {/*   <span className='w-full text-gray-400 lg:w-1/5'>Address</span> */}
        {/*   <span className='ml-2 break-all text-white'>{address}</span> */}
        {/* </div> */}
        <div className='mt-4 flex text-gray-400'>
          <ExclamationCircleIcon className='mr-2 h-6 w-6 text-yellow-500' />{' '}
          <span className='mr-2 text-yellow-500'>Warning!</span>In case of not working method please check contract
          first and refill it's balance when needed.
        </div>
      </Panel.Input>

      <Panel.Output active={transaction || decodedTransaction || decodedTransactionEvents}>
        <div className='mt-2 text-gray-400'>Transaction</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transaction} />
        </div>

        <div className='mt-6 text-gray-400'>Decoded transaction</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          {/* <pre>{!!decodedTransaction && JSON.stringify(decodedTransaction, null, 2)}</pre> */}
          <RJson src={decodedTransaction} />
        </div>
        <div className='mt-6 text-gray-400'>Decoded transaction events</div>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          {/* <pre>{!!decodedTransactionEvents && JSON.stringify(decodedTransactionEvents, null, 2)}</pre> */}
          <RJson src={decodedTransactionEvents} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
