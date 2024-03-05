import licenseValidationAbi from '@/artifacts/contracts/LicenseValidation.sol/LicenseValidation.json'
import address from '@/contracts/contractAddress.json'
import { NewLicense } from '@/lib/type.dt'
import { ethers } from 'ethers'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any

if (typeof window !== 'undefined') ethereum = (window as any).ethereum

async function getEthereumContracts() {
   // const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

   // if (accounts?.length > 0) {
   const provider = new ethers.BrowserProvider(ethereum)
   const signer = await provider.getSigner()
   const contracts = new ethers.Contract(address.contractAddress, licenseValidationAbi.abi, signer)

   return contracts
   // } else {
   //    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL)
   //    const wallet = ethers.Wallet.createRandom()
   //    const signer = wallet.connect(provider)
   //    const contracts = new ethers.Contract(address.contractAddress, licenseValidationAbi.abi, signer)

   //    return contracts
   // }
}


export async function addLicense(license: NewLicense) {
   if (!ethereum) {
      reportError('Please install a browser provider')
      return Promise.reject(new Error('Browser provider not installed'))
   }

   try {
      const contract = await getEthereumContracts()
      const result = await contract.addLicense(
         license.licenseNum,
         license.licenseName,
         license.expireDate,
         license.description
      )


      return result
   } catch (error) {
      reportError(error)
      return Promise.reject(error)
   }
}