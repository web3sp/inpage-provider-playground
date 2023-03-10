import { ProviderRpcClient } from 'everscale-inpage-provider'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'

import { testContract } from './test-venom-contract'

export const EncodeInternalInput = ({
  provider,
  networkId,
}: {
  provider: ProviderRpcClient
  networkId?: number | string
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  const [encodedInternalInput, setEncodedInternalInput] = useState<any | undefined>()
  const [decodedInput, setDecodedInput] = useState<any | undefined>()
  const [decodedEvent, setDecodedEvent] = useState<any | undefined>()

  const encodeInternalInput = async () => {
    setActive(true)
    setIsLoading(true)

    setEncodedInternalInput(undefined)
    setDecodedInput(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address) return

    const { boc: _encodedInternalInput } = await provider.rawApi.encodeInternalInput({
      abi: JSON.stringify(testContract.testContractAbi),
      method: 'setState',
      params: {
        _state: Date.now(),
      },
    })

    console.log(`_encodedInternalInput::`, _encodedInternalInput)

    setEncodedInternalInput(_encodedInternalInput)

    setIsLoading(false)
  }

  const decodeInputInternal = async () => {
    setActive(true)
    setIsLoading(true)

    setDecodedInput(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address) return

    const _decodedInput = await provider.rawApi.decodeInput({
      abi: JSON.stringify(testContract.testContractAbi),
      body: encodedInternalInput,
      method: 'setState',
      internal: true,
    })

    setDecodedInput(_decodedInput)
    console.log(`_decodedInput::`, _decodedInput)

    setIsLoading(false)
  }

  const decodeInputNotInternal = async () => {
    setActive(true)
    setIsLoading(true)

    setDecodedInput(undefined)

    await provider.ensureInitialized()

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address) return

    const _decodedInput = await provider.rawApi.decodeInput({
      abi: JSON.stringify(testContract.testContractAbi),
      body: 'te6ccgEBAgEAlgAB4Z8CyQZrz9SVfeCC1sdkMlC2Z0LcYSXMKsGgzsYmpvpQa/kFXPnWiCIBBjAG91clp/UZceSzn4EYSDxvv13UQYJbAgTqSsomV2lbyxZHuv1ZLcPbKHT6t/5XyJZz138QZMAAAGFKVCHVGOgFNkumE3ggAQBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGU=',
      method: 'setState',
      internal: false,
    })

    setDecodedInput(_decodedInput)
    console.log(`_decodedInput::`, _decodedInput)

    setIsLoading(false)
  }

  // const decodeOutput = async () => {
  //   setIsLoading(true);

  //   setDecodedInput(undefined);

  //   await provider.ensureInitialized();

  //   const providerState = await provider.getProviderState();
  //   const _address = providerState?.permissions.accountInteraction?.address;

  //   if (!_address) return;

  //   const _decodedOutput = await provider.rawApi.decodeOutput({
  //     abi: JSON.stringify(testContract.testContractAbi),
  //     body: '',
  //     method: "setState",
  //   });

  //   // setDecodedInput(_decodedOutput);
  //   console.log(`decodedOutput::`, _decodedOutput);

  //   setIsLoading(false);
  // };

  const decodeEvent = async () => {
    setActive(true)
    setIsLoading(true)

    setDecodedEvent(undefined)

    await provider.ensureInitialized()

    const encodedInternalEvent = 'te6ccgEBAQEAJgAASGM7MagAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFLx63Ww=='

    const providerState = await provider.getProviderState()
    const _address = providerState?.permissions.accountInteraction?.address

    if (!_address) return

    const _decodedEvent = await provider.rawApi.decodeEvent({
      abi: JSON.stringify(testContract.testContractAbi),
      body: encodedInternalEvent,
      event: 'StateChange',
    })

    setDecodedEvent(_decodedEvent)
    console.log(`_decodedEvent::`, _decodedEvent)

    setIsLoading(false)
  }

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>encodeInternalInput, decodeInput, decodeEvent</Panel.Title>
      <Panel.Description>
        <ul className='flex flex-col space-y-2'>
          <li>
            <b>EncodeInternalInput</b>
            <br /> This method is used in blockchain development to encode the internal input parameters for a
            transaction. It takes input parameters and encodes them into a format that can be read by the blockchain.
          </li>
          <li>
            <b>decodeInput (internal)</b>
            <br /> This method is used to decode the internal input parameters of a transaction. It takes an encoded
            input string and decodes it into human-readable format for developers to review.
          </li>
          <li>
            <b>decodeInput (not internal)</b>
            <br /> This method is used to decode the input parameters of a transaction that are not internal. This can
            include input data that is sent from outside of the blockchain network, such as data submitted through a web
            form.
          </li>
          <li>
            <b>decodedEvent</b>
            <br /> This method is used to decode events that are emitted by smart contracts on the blockchain. It takes
            an encoded event string and decodes it into a human-readable format for developers to review.
          </li>
        </ul>
      </Panel.Description>

      <Panel.Buttons>
        <Button onClick={encodeInternalInput}>encodeInternalInput </Button>

        <Button onClick={decodeInputInternal} disabled={!encodedInternalInput}>
          decodeInput (internal)
        </Button>

        <Button onClick={decodeInputNotInternal}>decodeInput (not internal)</Button>

        <Button onClick={decodeEvent}>decodedEvent </Button>
      </Panel.Buttons>
      <Panel.Input>
        <div className='mt-2 text-gray-400'>Test contract address</div>
        <div className='break-all rounded-lg bg-white bg-opacity-5 p-6'>
          {testContract.getTestContractAddress(networkId!)}
        </div>
      </Panel.Input>

      <Panel.Output active={encodedInternalInput || decodedInput || decodedEvent}>
        {encodedInternalInput && (
          <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={encodedInternalInput} title='Encoded internal input' />
            {/* <div className='break-all font-mono'> */}
            {/*   {!!encodedInternalInput && JSON.stringify(encodedInternalInput)} */}
            {/* </div> */}
          </div>
        )}

        {/* <div className='mt-6 text-gray-400'>Decoded input:</div> */}
        {decodedInput && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={decodedInput} title='Decoded input' />
          </div>
        )}
        {/* <pre>{!!decodedInput && JSON.stringify(decodedInput)}</pre> */}
        {/* <div className='mt-6 text-gray-400'>Decoded event:</div> */}
        {decodedEvent && (
          <div className='mt-6 rounded-lg bg-white bg-opacity-5 p-6'>
            <RJson src={decodedEvent} title='Decoded event' />
          </div>
        )}
      </Panel.Output>
    </Panel>
  )
}
