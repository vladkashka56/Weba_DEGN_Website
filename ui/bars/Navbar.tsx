'use client';

import Image from 'next/image';

import React, { useContext, useEffect, useState } from 'react';
import { ethers } from "ethers";
import Web3Modal from "web3modal";

import { Button } from '@webaverse-studios/uikit';

import character from '@/public/images/icon/character_image.png';
import logo from '@/public/images/logo/webaverse_logo.png';

import {AppContext} from '@/ui/hooks/AccountProvider';
import {chainId} from '@/ui/hooks/constant/address';
import {epsAbi} from '@/ui/hooks/constant/epsAbi';
import {pfpAbi} from '@/ui/hooks/constant/pfpAbi';
import {epsAddress, passAddress, pfpAddress} from '@/ui/hooks/constant/address';

const NavBar = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { account, setAccount, setLibrary, setProvider, setColdwallets} = useContext(AppContext);
  
  useEffect(() => {
    setWalletAddress(account)
  }, [account])

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        network: "goerli",
        theme: "light",
        cacheProvider: false,
        providerOptions: {
        },
      });

      const web3Provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(web3Provider);
      const web3Accounts = await library.listAccounts();
      const network = await library.getNetwork();

      if (parseInt(window.ethereum.networkVersion) !== parseInt(chainId, 16)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainId }], // 0x4 is rinkeby. Ox1 is ethereum mainnet. 0x89 polygon mainnet  0x5: // Goerli testnet
          })
        } catch (err) {
          return false
        }
      }
      setAccount(web3Accounts[0]);
      setProvider(web3Provider);
      setLibrary(library);
      // get cold wallets a
      const ethersProvider = new ethers.providers.Web3Provider(web3Provider);
      const epsContract = new ethers.Contract(epsAddress, epsAbi, ethersProvider);
      const epsAddresses = await epsContract.getAddresses(web3Accounts[0], passAddress, 1, true, true);
      setColdwallets(epsAddresses);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <nav className="container relative z-[999] mx-auto mt-4 flex h-12 justify-between md:mt-[var(--header-margin-desktop)]">
      <a
        rel="noopener noreferrer"
        href="#"
        aria-label="Back to homepage"
        className="flex items-center p-2"
      >
        <Image
          priority
          src={logo}
          width={40}
          height={50}
          alt="webaverse_logo"
          className="hover-opacity"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
      </a>

      <div className="parallelogram shadow-black-700/25 flex w-60 items-center justify-center gap-4 border-2 border-solid border-slate-500/[.25] shadow-lg">
        <Image width={50} height={50} src={character} alt="webaverse_character" />
      </div>
    </nav>
  );
};

export default NavBar;
