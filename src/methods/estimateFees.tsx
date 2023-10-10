import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

const AMOUNT: number = 1

export const EstimateFees = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [fees, setFees] = useState<any | undefined>()
  const [label, setLabel] = useState('')
  const [callData, setCallData] = useState<any | undefined>(undefined)

  const [data, setData] = useState<number>(AMOUNT)

  const estimateFees = async () => {
    setActive(true)
    setIsLoading(true)

    setFees(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    const _label = 'VENOM'
    setLabel(_label)
    console.log(`_label::`, _label)

    if (!_address) return

    setCallData({
      sender: _address?.toString(),
      recipient: _address?.toString(),
      amount: String(data * 10 ** 9),
    })

    try {
      const { fees: _fees } = await provider.rawApi.estimateFees({
        sender: _address?.toString(),
        recipient: _address?.toString(),
        amount: String(data * 10 ** 9),
      })

      setFees(_fees)

      console.log(`_fees::`, _fees)
    } catch (error) {
      // @ts-ignore
      setFees(error?.message || 'Error')

      console.log(`_fees::`, error)
      console.error(error)
    }

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>estimateFees</Panel.Title>
      <Panel.Description>Estimate fees on transaction</Panel.Description>

      <Panel.Buttons>
        <Button onClick={estimateFees}>Run</Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col align-middle lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Amount</span>
          <Input
            type='number'
            step='0.1'
            onWheel={(e) => e.preventDefault()}
            value={data}
            onInvalid={() => {}}
            autoFocus={false}
            onChange={(e) => {
              setData(e.target.value ? Number(e.target.value) : 0)
              setFees(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(AMOUNT)
              setFees(undefined)
              setIsLoading(false)
            }}
          />
        </div>
        {callData && (
          <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={callData} />
          </div>
        )}
      </Panel.Input>

      <Panel.Output active={fees}>
        <div className='rounded-lg bg-white bg-opacity-5 p-6'>
          <div className='flex w-full flex-col lg:flex-row'>
            <span className='w-full text-gray-400 lg:w-1/3'>
              Estimate fees for {data} {label}:
            </span>
            <span className='ml-2 break-all text-white'>
              {`${+(fees || 0) / 10 ** 9} ${label}`}
              <br /> or {`${fees} nano${label}`}
            </span>
          </div>
        </div>
      </Panel.Output>
    </Panel>
  )
}
