import licenseValidationAbi from '@/artifacts/contracts/LicenseValidation.sol/LicenseValidation.json'
import address from '@/contracts/contractAddress.json'
import { License, NewLicense } from '@/lib/type'
import { ethers } from 'ethers'

const toWei = (num: number) => ethers.parseEther(num.toString())
const fromWei = (num: number) => ethers.formatEther(num)

let ethereum: any

if (typeof window !== 'undefined') ethereum = window.ethereum

async function getEthereumContracts() {
   const accounts = await ethereum?.request?.({ method: 'eth_accounts' })

   // if (accounts?.length > 0) {
   const provider = new ethers.BrowserProvider(ethereum)
   const signer = await provider.getSigner()
   const contracts = new ethers.Contract(address.contractAddress, licenseValidationAbi.abi, signer)

   return contracts

}


export async function addLicense(license: NewLicense): Promise<void> {
   if (!ethereum) {
      console.error("Ethereum provider not available.");
   }

   try {
      const contract = await getEthereumContracts()
      const result = await contract.addLicense(
         license.licenseNum,
         license.licenseName,
         license.expireDate,
         license.description
      )

      return Promise.resolve(result);
   } catch (error) {
      reportError(error)
      return Promise.reject(error)
   }
}


export async function getLicenses(): Promise<License[]> {
   if (!ethereum) {
      console.error("Ethereum provider not available.");
   }
   const contract = await getEthereumContracts()
   const result = await contract.getUserLicenses();
   return structuredLicenses(result);

}

const structuredLicenses = (licenses: License[]): License[] =>
   licenses
      .map((license) => ({
         id: Number(license.id),
         licenseNum: license.licenseNum,
         licenseName: license.licenseNum,
         issuedDate: Number(license.issuedDate),
         expireDate: Number(license.expireDate),
         description: license.description,
         licenseOwner: license.licenseOwner,
      }))
      .sort((a, b) => b.issuedDate - a.issuedDate)