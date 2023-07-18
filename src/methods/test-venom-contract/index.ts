import testContractAbi from '../../abi/test.abi.json'

const testContractAddress = {
  '1000': '0:52195e5fd2d90b996c2a5e0f1825b84014a3962a5e31a544fb63bae13fec5727',
  '1337' : '0:89545efc197c3d9f9ac6ebe94e1f2b141ffa0c6bc77f09f26f105fcc99eb4965',
  '1': '0:89545efc197c3d9f9ac6ebe94e1f2b141ffa0c6bc77f09f26f105fcc99eb4965',
}

export const testContract = {
  testContractAbi,
  getTestContractAddress: (networkId: number | string) =>
    // @ts-ignore
    testContractAddress[networkId] || testContractAddress['1000'],
}
