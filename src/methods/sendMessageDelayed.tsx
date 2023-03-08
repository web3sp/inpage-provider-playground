import { Address, ProviderRpcClient, Transaction } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const SendMessageDelayed = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [address, setAddress] = useState<Address | undefined>()
  const [transaction, setTransaction] = useState<Transaction<Address> | undefined>()
  const [preTransaction, setPreTransaction] = useState<
    Omit<Awaited<ReturnType<(typeof provider)['sendMessageDelayed']>>, 'transaction'> | undefined
  >()
  const [callData, setCallData] = useState<any | undefined>(undefined)

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransaction(undefined)
    setPreTransaction(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address
    setAddress(_address)

    if (_address) {
      const amount = 1 * 10 ** 9

      const senderAddress = _address
      const recipientAddress = _address

      setCallData({
        sender: senderAddress,
        recipient: recipientAddress,
        amount: String(Math.round(amount)),
        bounce: true,
      })

      try {
        const { expireAt, messageHash, transaction } = await provider.sendMessageDelayed({
          sender: senderAddress,
          recipient: recipientAddress,
          amount: String(Math.round(amount)),
          bounce: true,
        })

        setPreTransaction({
          expireAt,
          messageHash,
        })

        const tr = await transaction

        setTransaction(tr)
        console.log(`transaction::`, tr)
      } catch (error) {
        setTransaction(error as any)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>sending 1 venom to yourself </Panel.Title>
      <Panel.Description>(via sendMessageDelayed)</Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>

      {!!callData && (
        <Panel.Input>
          <RJson src={callData} />
        </Panel.Input>
      )}

      <Panel.Output active={!!transaction || !!preTransaction}>
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={preTransaction} />
        </div>
        <div className='mt-6 text-gray-400'>Data: {!transaction && 'in progress'}</div>
        {/* <pre>{!!transaction && JSON.stringify(transaction, null, 2)}</pre> */}
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transaction} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
