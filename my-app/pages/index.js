import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Web3Modal from 'web3modal';
import { useCallback, useEffect, useState } from 'react';
import { ethers, Contract } from 'ethers';
import { NFT_Contract_Address, NFT_Contract_ABI } from '../constants/index'

let web3modal

if(typeof window !== "undefined"){
  web3modal = new Web3Modal({
    network: "goerli",
    providerOptions: {},
    disableInjectedProvider: false
  })
}

export default function Home() {

  const [walletConnected,setWalletConnected] = useState(false)
  const [provider,setProvider] = useState()
  const [chainId,setChainId] = useState()
  const [signer,setSigner] = useState()
  const [currentAddress,setCurrentAddress] = useState()
  const [presaleStarted,setPresaleStarted] = useState(false)
  const [isOwner,setIsOwner] = useState(false)
  const [presaleEnded,setPresaleEnded] = useState(false)
  const [loading,setLoading] = useState(false)
  const [tokenCount,setTokenCount] = useState("")

  const mintedTokens = async () => {
    try {
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,provider)
      const tokenIds = await NFTContract.tokenId()
      setTokenCount(tokenIds.toString())
    } catch (error) {
      console.log(error)
    }
  }

  const presaleMint = async () => {
    try {
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,signer)
      const txn = await NFTContract.presaleMint({value:ethers.utils.parseEther("0.005")})
      setLoading(true)
      await txn.wait()
      setLoading(false)
    } 
    catch (error) {
      console.log(error)
    }
  }
  const mint = async () => {
    try {
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,signer)
      const txn = await NFTContract.mint({value:ethers.utils.parseEther("0.01")})
      setLoading(true)
      await txn.wait()
      setLoading(false)
    } 
    catch (error) {
      console.log(error)
    }
  }

  const getOwner = async () => {
    try{
      console.log(walletConnected)
      console.log(provider)
      console.log(chainId)
      console.log(signer)
      console.log(currentAddress)
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,signer)
      const owner = await NFTContract.owner()
      console.log(owner)
      console.log(currentAddress)
      if(owner.toLowerCase() === currentAddress.toLowerCase()){
        setIsOwner(true)
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const startPresale = async () => {
    try{
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,signer)
      const txn = await NFTContract.startPresale()
      setLoading(true)
      await txn.wait()
      setLoading(false)
      setPresaleStarted(true)
    }
    catch(error){
      console.log(error)
    }
  }

  const isPresaleStarted = async () => {
    try{
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,provider)
      const presaleStarted = await NFTContract.presaleStarted()
      setPresaleStarted(presaleStarted)
      return presaleStarted
    }
    catch(error){
      console.log(error)
    }
  }

  const isPresaleEnded = async () => {
    try {
      const NFTContract = new Contract(NFT_Contract_Address,NFT_Contract_ABI,provider)
      const presaleEndTime = await NFTContract.presaleEnded() //big number as presaleEnded is uint256, returns time in seconds
      const currentTimeInSeconds = Date.now() / 1000
      const hasPresaleEnded = presaleEndTime.lt(Math.floor(currentTimeInSeconds))
      setPresaleEnded(hasPresaleEnded)
      return hasPresaleEnded
    } 
    catch (error) {
      console.log(error)
    }
  }

  const connectWallet = async () => {
    try{
      const instance = await web3modal.connect()
      const provider = new ethers.providers.Web3Provider(instance)
      const {chainId} = await provider.getNetwork()
      if(chainId !== 5 ){
        window.alert("connect with goerli network")
        throw new Error("inncorrect network")
      }
      const signer = provider.getSigner()
      const address = await signer.getAddress()
      setProvider(provider)
      setChainId(chainId)
      setSigner(setSigner)
      setCurrentAddress(address)
      setWalletConnected(true)
    }
    catch(error){
      console.log(error)
    }
  }

  const onPageLoad = async () => {
    await connectWallet()
    await getOwner()
    const presaleStarted = await isPresaleStarted()
    console.log("presale status",presaleStarted)
    if(presaleStarted) {
      await isPresaleEnded()
    }
    await mintedTokens()
    // setInterval(async()=>{
    //   await mintedTokens()
    // },5*1000)
    // setInterval(async()=>{
    //   const presaleStarted = await isPresaleStarted()
    //   if(presaleStarted) {
    //     await isPresaleEnded()
    //   }
    // },5*1000)
  }

  useEffect(()=>{
    if(!walletConnected){
      connectWallet()
    }
    onPageLoad()
  },[])


  function renderButton () {
    if(!walletConnected){
      return (
        <button onClick={connectWallet} className={styles.button}>Connect Wallet</button>
      )
    }
    if(isOwner && !presaleStarted){
      return (
        <button onClick={startPresale} className={styles.button}>Start Presale</button>
      )
    }
    if(!presaleStarted){
      return (
        <div>
          <span className={styles.description}>Presale has not started yet. Come back later!</span>
        </div>
      )
    }
    if(presaleStarted && !presaleEnded){
      return (
        <div>
          <span className={styles.description}>
            Presale has started! If your address is whitelisted you can mint a Web3Dev!
          </span>
          <button onClick={presaleMint} className={styles.button}>Presale Mint 🚀</button>
        </div>
      )
    }
    if(presaleEnded){
      return (
        <div>
          <span className={styles.description}>
            Presale has ended! You can mint a Web3Dev in public sale, if any remain.
          </span>
          <button onClick={mint} className={styles.button}>Mint 🚀</button>
        </div>
      )
    }
    if(loading){
      return (
        <div>
          <span className={styles.description}>Loading...</span>
        </div>
      )
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Collection</title>
        <meta name="description" content="NFT Collection for Web3 Devs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1>Welcome to Web3 Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Web3.
          </div>
          <div>
            {tokenCount}/20 have been minted
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./cryptodevs/0.svg" />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Web3 Devs
      </footer>
    </div>
  )
}
