import { useState, useEffect } from 'react'
import { ethers, utils } from 'ethers'

function App() {
  const [count, setCount] = useState<number>(0)
  const [account, setAccount] = useState<any>(null)
  const { } = utils
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

  return (
    <div className='w-full min-h-screen bg-blue-900 flex flex-col justify-center items-center'>
      <h1 className='text-8xl font-bold text-white text-shadow text-center'>hello web3</h1>
      {account ? (
        <>
          <h2 className='text-6xl text-center mt-24 text-yellow-300 font-bold'>👏🏻 {count}</h2>
          <h3 className='text-3xl text-center mt-12 text-white font-bold'>
            Logged in as {account.substring(0, 4)}...{account.substring(account.length - 4)}
          </h3>
          <button className='rounded-full py-6 px-12 text-3xl mt-16 text-white bg-purple-700 hover:scale-105 hover:bg-purple-600 transition'>
            Say hi
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
