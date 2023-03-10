import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

import { testTvc } from './tvc-data'

export const Tvc = ({ provider }: { provider: ProviderRpcClient }) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [tvc, setTvc] = useState<any | undefined>()
  const [split, setSplit] = useState<any | undefined>()
  const [expectedAddress, setExpectedAddress] = useState<any | undefined>()

  const codeToTvc = async () => {
    setActive(true)
    setIsLoading(true)

    setTvc(undefined)
    setSplit(undefined)
    setExpectedAddress(undefined)

    await provider.ensureInitialized()

    const _tvc = await provider.codeToTvc(testTvc.TokenRootBase64)

    setTvc(_tvc)
    console.log(`codeToTvc/tvc::`, _tvc)

    setIsLoading(false)
  }

  const mergeTvc = async () => {
    setActive(true)
    setIsLoading(true)

    setTvc(undefined)
    setSplit(undefined)
    setExpectedAddress(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address) return

    const { boc } = await provider.packIntoCell({
      structure: testTvc.data,
      data: testTvc.getInitParams(_address) as never,
    })

    const { tvc: _tvc } = await provider.mergeTvc({
      code: testTvc.TokenRootBase64,
      data: boc,
    })

    setTvc(_tvc)
    console.log(`mergeTvc/tvc::`, _tvc)

    setIsLoading(false)
  }

  const splitTvc = async () => {
    setActive(true)
    setIsLoading(true)

    setSplit(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address || !tvc) return

    const splitted = await provider.splitTvc(tvc)

    setSplit(splitted)
    console.log(`split::`, split)

    setIsLoading(false)
  }

  const getExpectedAddress = async () => {
    setActive(true)
    setIsLoading(true)

    setExpectedAddress(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address || !tvc) return

    const _expectedAddress = await provider.getExpectedAddress<typeof testTvc.TokenRootAbi>(testTvc.TokenRootAbi, {
      tvc,
      initParams: testTvc.getInitParams(_address) as never,
    })

    setExpectedAddress(_expectedAddress?.toString())
    console.log(`expectedAddress::`, _expectedAddress?.toString())

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>setTvc, mergeTvc, splitTvc, getExpectedAddress</Panel.Title>

      <Panel.Description>
        <h3 className='font-semibold'>setTvc</h3>
        <p className='mb-2'>
          This method is used to set the TVC (Ton Virtual Computer) code of a smart contract on the TON Blockchain.
        </p>
        <h3 className='font-semibold'>mergeTvc</h3>
        <p className='mb-2'>This method is used to merge two TVC codes into a single TVC code.</p>
        <h3 className='font-semibold'>splitTvc</h3>
        <p className='mb-2'>This method is used to split a TVC code into two separate TVC codes.</p>
        <h3 className='font-semibold'>getExpectedAddress</h3>
        <p className='mb-2'>
          This method is used to calculate the expected address of a smart contract on the TON Blockchain based on the
          TVC code and the address of the contract owner.{' '}
        </p>
      </Panel.Description>
      <Panel.Buttons>
        <Button onClick={codeToTvc}>setTvc </Button>
        <Button onClick={mergeTvc}>mergeTvc </Button>
        <Button onClick={splitTvc} disabled={!tvc}>
          splitTvc
        </Button>
        <Button onClick={getExpectedAddress} disabled={!tvc}>
          getExpectedAddress
        </Button>
      </Panel.Buttons>

      <Panel.Output active={tvc || split || expectedAddress}>
        {tvc && (
          <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
            {/* <RJson src={tvc || {}} /> */}
            <RJson src={tvc} title='Tvc' />
            {/* <div className='break-all font-mono '>{JSON.stringify(tvc)}</div> */}
          </div>
        )}
        {/* <div className='mt-6 text-gray-400'>Split</div> */}
        {split && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={split} title='Split' />
          </div>
        )}
        {/* <pre>{JSON.stringify(split)}</pre> */}
        {expectedAddress && (
          <div className='mt-6 text-gray-400'>
            <div className=' rounded-lg bg-white bg-opacity-5 p-6 text-white'>
              <RJson src={expectedAddress} title='Expected address' />
            </div>
          </div>
        )}
      </Panel.Output>
    </Panel>
  )
}
