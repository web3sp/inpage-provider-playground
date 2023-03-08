import { ProviderRpcClient } from 'everscale-inpage-provider'
import Button from '../components/Button'
import Panel from '../components/Panel'

export const ChangeAccount = ({ provider }: { provider: ProviderRpcClient }) => {
  const onButtonClick = async () => {
    await provider.ensureInitialized()
    provider.changeAccount()
  }

  return (
    <Panel open={false} onClick={onButtonClick} isLoading={false} chevron={false}>
      <Panel.Title>changeAccount</Panel.Title>
      <Panel.Description>changeAccount is a method that allows you to change the account</Panel.Description>
      <Panel.Buttons>
        <Button disabled={!provider} onClick={onButtonClick}>
          Run
        </Button>
      </Panel.Buttons>
    </Panel>
  )
}
