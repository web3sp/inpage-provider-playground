import { ProviderRpcClient } from 'everscale-inpage-provider'
import { AddAsset } from './addAsset'
import { Cell } from './cell'
import { ChangeAccount } from './changeAccount'
import { EncodeInternalInput } from './encodeInternalInput'
import { EncryptData } from './encryptData'
import { EstimateFees } from './estimateFees'
import { ExtractPublicKey } from './extractPublicKey'
import { GetAccountsByCodeHash } from './getAccountsByCodeHash'
import { GetFullContractState } from './getFullContractState'
import { GetProviderState } from './getProviderState'
import { GetTransaction } from './getTransaction'
import { GetTransactions } from './getTransactions'
import { RunLocal } from './runLocal'
import { Salt } from './salt'
import { SendExternalMessage } from './sendExternalMessage'
import { SendExternalMessageDelayed } from './sendExternalMessageDelayed'
import { SendMessage } from './sendMessage'
import { SendMessageDelayed } from './sendMessageDelayed'
import { SendTip3 } from './sendTip3'
import { SendUnsignedExternalMessage } from './sendUnsignedExternalMessage'
import { SignData } from './signData'
import { SignDataRaw } from './signDataRaw'
import { Subscribe } from './subscribe'
import { Tvc } from './tvc'
import {ChangeNetwork} from "./changeNetwork";
import {AddNetwork} from "./addNetwork";

type MethodObject = {
  name: string

  method: ({
             provider,
             networkId,
             address,
             publicKey,
           }: {
    provider: ProviderRpcClient
    networkId?: number | string
    address?: string
    publicKey?: string
  }) => JSX.Element | null
}

export const methods: MethodObject[] = [
  { name: 'changeAccount', method: ChangeAccount },
  {name: "changeNetwork", method: ChangeNetwork },
  {name: "addNetwork", method: AddNetwork },
  { name: 'getProviderState', method: GetProviderState },
  { name: 'getFullContractState', method: GetFullContractState },
  { name: 'getTransaction', method: GetTransaction },
  { name: 'getTransactions', method: GetTransactions },
  { name: 'getAccountsByCodeHash', method: GetAccountsByCodeHash },
  { name: 'packIntoCell, unpackFromCell, getBocHash', method: Cell },
  { name: 'setTvc, mergeTvc, splitTvc, getExpectedAddress', method: Tvc },
  { name: 'getCodeSalt, setCodeSalt', method: Salt },
  { name: 'encodeInternalInput, decodeInput, decodeEvent', method: EncodeInternalInput },
  { name: 'extractPublicKey', method: ExtractPublicKey },
  { name: 'subscribe, unsubscribe, unsubscribeAll, test transaction call', method: Subscribe },
  { name: 'encryptData', method: EncryptData },
  { name: 'signData, verifySignature', method: SignData },
  { name: 'signDataRaw, verifySignature', method: SignDataRaw },
  { name: 'estimateFees', method: EstimateFees },
  { name: 'runLocal', method: RunLocal },
  { name: 'sending 1 venom to yourself (via sendMessage)', method: SendMessage },
  { name: 'sending 1 venom to yourself (via sendMessageDelayed)', method: SendMessageDelayed },
  { name: 'sendUnsignedExternalMessage', method: SendUnsignedExternalMessage },
  { name: 'sendExternalMessage', method: SendExternalMessage },
  { name: 'sendExternalMessageDelayed', method: SendExternalMessageDelayed },
  { name: 'addAsset', method: AddAsset },
  { name: 'sendtip3 tokenroot', method: SendTip3 },
]
