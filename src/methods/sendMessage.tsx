import { Address, ProviderRpcClient, Transaction } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

export const SendMessage = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [address, setAddress] = useState<Address | undefined>()
  const [transaction, setTransaction] = useState<Transaction<Address> | undefined>()
  const [callData, setCallData] = useState<any | undefined>(undefined)

  const onButtonClick = async () => {
    setActive(true)
    setIsLoading(true)

    setTransaction(undefined)

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
        const { transaction: tr } = await provider.sendMessage({
          sender: senderAddress,
          recipient: recipientAddress,
          amount: String(Math.round(amount)),
          bounce: true,
        })
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
      <Panel.Description>(via sendMessage)</Panel.Description>
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

      <Panel.Output active={!!transaction}>
        <div className=' rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={transaction} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
