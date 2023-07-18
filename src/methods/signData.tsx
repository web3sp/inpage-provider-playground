import { ProviderRpcClient } from 'everscale-inpage-provider'
import { Base64 } from 'js-base64'
import { useState } from 'react'
import Button from '../components/Button'
import Panel from '../components/Panel'
import { RJson } from '../components/RJson'
import TextArea from '../components/TextArea'

const defaultData = 'sign-test'

export const SignData = ({
  provider,
  address,
  publicKey,
}: {
  provider: ProviderRpcClient
  address?: string
  publicKey?: string
}) => {
  const [active, setActive] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean | undefined>()
  // const [address, setAddress] = useState<Address | undefined>()
  // const [publicKey, setPublicKey] = useState<string | undefined>()
  const [signed, setSigned] = useState<any | undefined>()
  const [data, setData] = useState<string>(defaultData)
  const [signatureId, setSignatureId] = useState<boolean | number | undefined>(true)

  const [isValid, setIsValid] = useState<boolean | undefined>()

  // const [networkId, setNetworkId] = useState<number | undefined>();

  const signData = async () => {
    setActive(true)
    setIsLoading(true)

    setSigned(undefined)
    setIsValid(undefined)

    await provider.ensureInitialized()
    const providerState = await provider.getProviderState()
    // const _networkId = providerState?.networkId;
    const _address = providerState?.permissions.accountInteraction?.address
    const _publicKey = providerState?.permissions.accountInteraction?.publicKey
    // setNetworkId(_networkId);
    // setAddress(_address)
    // setPublicKey(_publicKey)

    try {
      if (_address && _publicKey) {
        const signed = await provider.signData({
          publicKey: _publicKey,
          data: Base64.encode(data),
          withSignatureId: signatureId
        })

        setSigned(signed)
      }
    } catch (error) {
      setSigned(error as any)
    } finally {
      setIsLoading(false)
    }
  }

  const verifySignature = async () => {
    setActive(true)
    setIsLoading(true)

    setIsValid(undefined)

    await provider.ensureInitialized()

    if (!signed || !publicKey) return

    const data1 = {
      publicKey: publicKey,
      signature: signed.signature,
      dataHash: signed.dataHash,
      withSignatureId: signatureId
    }

    try {
      const { isValid: _isValid } = await provider.verifySignature(data1)
      setIsValid(_isValid)
    } catch (error) {
      setSigned(error as any)
    } finally {
      setIsLoading(false)
    }
  }

  // const test = async () => {
  //   await provider.ensureInitialized();

  //   const providerState = await provider.getProviderState();

  //   const _networkId = providerState?.networkId;
  //   const _address = providerState?.permissions.accountInteraction?.address;
  //   const _publicKey = providerState?.permissions.accountInteraction?.publicKey;

  //   if (!_networkId || !_address || !_publicKey) return;

  //   const _signed = await provider.signData({
  //     publicKey: _publicKey,
  //     data: Base64.encode(data),
  //     // withSignatureId: _networkId,
  //   });

  //   const data1 = {
  //     publicKey: _publicKey,
  //     signature: _signed.signature,
  //     dataHash: _signed.dataHash,
  //     // withSignatureId: _networkId,
  //   };

  //   console.log(`--->::`, await provider.verifySignature(data1));
  // };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Check the type of the input value
    let newValue: any

    if (inputValue === 'true' || inputValue === 'false') {
      // If the input value is 'true' or 'false', convert it to a Boolean
      newValue = inputValue === 'true';
    } else if (/^\d+$/.test(inputValue)) {
      // If the input value is a number (consists of digits), convert it to a Number
      newValue = Number(inputValue);
    } else {
      // Otherwise, set the value to undefined
      newValue = undefined;
    }

    // Call the onChange callback with the new value
    setSignatureId(newValue)
    setIsValid(undefined)
    setIsLoading(false)
  };

  return (
    <Panel open={active} onClick={() => setActive(!active)} isLoading={isLoading}>
      <Panel.Title>signData, verifySignature</Panel.Title>
      <Panel.Description>
        <p>
          The <strong>"signData"</strong> method in transaction context is used to digitally sign a piece of data, which
          can be a transaction or any other piece of information.{' '}
        </p>
        <p className='mt-2'>
          The <strong>"verifySignature"</strong> method, on the other hand, is used to verify the authenticity of a
          digital signature.
        </p>
      </Panel.Description>

      <Panel.Buttons>
        <Button onClick={signData}>signData</Button>
        <Button onClick={verifySignature} disabled={!signed || signed.code}>
          verifySignature
        </Button>
      </Panel.Buttons>

      <Panel.Input>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Address</span>
          <span className='ml-2 break-all text-white'> {address}</span>
        </div>

        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Public Key</span>
          <span className='ml-2 break-all text-white'> {publicKey}</span>
        </div>

        <div className='flex w-full flex-col align-middle lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Data for encryption:</span>
          <TextArea
            value={data}
            autoFocus={true}
            onChange={(e) => {
              setData(e.target.value)
              setSigned(undefined)
              setIsValid(undefined)
              setIsLoading(false)
            }}
            onClear={() => {
              setData(defaultData)
              setSigned(undefined)
              setIsValid(undefined)
              setIsLoading(false)
            }}
          />
        </div>

        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full shrink-0 text-gray-400 lg:w-1/5'>withSignatureId </span>
          <div className='mb-2 ml-2 flex w-full flex-col'>
            <input
              value={signatureId?.toString()}
              autoFocus={true}
              onChange={(e) => { handleInputChange(e) }}
              className='mb-2 w-full rounded bg-white bg-opacity-10 p-2 text-white'
            />
            <div className='text-xs text-gray-400'>Input number, true or false</div>
            <div className='text-xs text-gray-400'>withSignatureId now is: {String(signatureId)}</div>
          </div>
        </div>

        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Base64 data (before Encrypt):</span>
          <span className='ml-2 break-all text-white'>{Base64.encode(data)}</span>
        </div>
        <div className='flex w-full flex-col lg:flex-row'>
          <span className='w-full text-gray-400 lg:w-1/5 lg:shrink-0'>Initial data again:</span>
          <span className='ml-2 break-all text-white'>{Base64.decode(Base64.encode(data))}</span>
        </div>
      </Panel.Input>

      <Panel.Output active={isValid || signed}>
        <div className='mt-6 text-gray-400'>
          Is valid:{' '}
          {isValid !== undefined ? (
            <span
              className='ml-2 text-black'
              style={{
                backgroundColor: isValid ? 'lightgreen' : 'tomato',
                boxShadow: `0px 0px 10px 4px ${isValid ? 'lightgreen' : 'tomato'}`,
              }}
            >
              {isValid?.toString()}
            </span>
          ) : isLoading ? (
            ''
          ) : (
            <span className='ml-2 break-all text-white'>not yet known</span>
          )}
        </div>

        <div className='mt-2 rounded-lg bg-white bg-opacity-5 p-6'>
          <RJson src={signed} />
        </div>
      </Panel.Output>
    </Panel>
  )
}
