import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
// import type { ContractInterface } from 'ethers'
import abi from './abi/Counter.json'

const contractAddress = '0x824075ab675b4af5b7781e8ea61f604ede073b5e'
const contractAbi = abi.abi

function App() {
  const [count, setCount] = useState<number>(0)
  const [account, setAccount] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const ethereum = window?.ethereum
  const checkIfWalletIsConnect = async () => {
    if (!ethereum) {
      console.log('please install metamask')
      return
    }
    try {
      const accounts = await ethereum.request({
        method: 'eth_accounts',
      })
      if (accounts.length) {
        const account = accounts[0]
        console.log('current account: ', account)
        setAccount(account)
      } else {
        setAccount(null)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (ethereum) {
      ethereum?.on('accountsChanged', async (d: any) => {
        console.log('accounts change: ', d)
        if (!d?.length) {
          setAccount(null)
        }
      })
    }
  }, [ethereum])

  useEffect(() => {
    checkIfWalletIsConnect()
    getCount()
  }, [])

  const connectWallet = async () => {
    if (!ethereum) {
      console.log('please install metamask')
      return
    }
    try {
      const accounts = await window.ethereum
        .request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {},
            },
          ],
        })
        .then(() =>
          ethereum.request({
            method: 'eth_requestAccounts',
          })
        )
      console.log(accounts)
      accounts.length && setAccount(accounts[0])
    } catch (e) {
      console.log(e)
    }
  }

  const disconnectWallet = async () => {
    const accounts = await window.ethereum
      .request({
        method: 'wallet_requestPermissions',
        params: [
          {
            eth_accounts: {},
          },
        ],
      })
      .then(() =>
        ethereum.request({
          method: 'eth_requestAccounts',
        })
      )
    console.log('disconnect=> ', accounts)
  }

  const sayHi = async () => {
    if (!ethereum || loading) return
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const CounterContract = new ethers.Contract(contractAddress, contractAbi, signer)
      const tx = await CounterContract.add()
      // 等到交易完成
      await tx.wait()
      await getCount()
    } catch (e) {
      console.log(e)
    }
    setLoading(false)
  }

  const getCount = async () => {
    if (!ethereum) return
    try {
      const provider = new ethers.providers.Web3Provider(ethereum)
      const signer = provider.getSigner()
      const CounterContract = new ethers.Contract(contractAddress, contractAbi, signer)
      // 返回的是bigNumber
      const counts = await CounterContract.getCounts()
      setCount(counts.toNumber())
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className='w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center'>
      <h1 className='text-8xl font-bold text-white text-shadow text-center'>hello web3</h1>
      {account ? (
        <>
          <h2 className='text-6xl text-center mt-24 text-yellow-300 font-bold'>👏🏻 {count}</h2>
          <h3 className='text-3xl text-center mt-12 text-white font-bold'>
            Logged in as {account.substring(0, 4)}...{account.substring(account.length - 4)}
          </h3>
          <button
            className='rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition'
            onClick={sayHi}
          >
            {loading ? (
              <svg
                role='status'
                className='w-8 h-8 mr-2 animate-spin dark:text-blue-600 fill-white'
                viewBox='0 0 100 101'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                  fill='currentColor'
                />
                <path
                  d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                  fill='currentFill'
                />
              </svg>
            ) : (
              'Say hi'
            )}
          </button>
          <a className='text-center mt-24 text-red-500 underline cursor-pointer' onClick={disconnectWallet}>
            Disconnect Wallet
          </a>
        </>
      ) : (
        <button
          className='rounded-full py-6 px-12 text-3xl mt-24 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition'
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default App
