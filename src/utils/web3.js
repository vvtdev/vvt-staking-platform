import { ethers } from 'ethers';

// VVT Token Contract Address (replace with actual deployed address)
export const VVT_CONTRACT_ADDRESS = "0x38EA6b550DD33c9Cf9aC65721F71BbFb37c70DCa";

// Simplified VVT Token ABI (ERC20 standard functions)
export const VVT_TOKEN_ABI = [
  // Read functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  
  // Write functions
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Staking Contract ABI (placeholder - will be implemented when staking contract is deployed)
export const STAKING_CONTRACT_ABI = [
  "function stake(uint256 amount, uint256 tierId) returns (bool)",
  "function unstake(uint256 stakeId) returns (bool)",
  "function claimRewards(uint256 stakeId) returns (bool)",
  "function getStakeInfo(address user, uint256 stakeId) view returns (tuple(uint256 amount, uint256 tier, uint256 startTime, uint256 lockPeriod, uint256 rewards))",
  "function getUserStakes(address user) view returns (uint256[])",
  "function calculateRewards(address user, uint256 stakeId) view returns (uint256)"
];

/**
 * Get the Web3 provider (MetaMask)
 */
export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask is not installed');
};

/**
 * Get the signer (current connected account)
 */
export const getSigner = async () => {
  const provider = getProvider();
  return await provider.getSigner();
};

/**
 * Connect to MetaMask wallet
 */
export const connectWallet = async () => {
  try {
    const provider = getProvider();
    const accounts = await provider.send("eth_requestAccounts", []);
    return accounts[0];
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
};

/**
 * Get VVT token contract instance
 */
export const getVVTContract = async (withSigner = false) => {
  const provider = getProvider();
  
  if (withSigner) {
    const signer = await getSigner();
    return new ethers.Contract(VVT_CONTRACT_ADDRESS, VVT_TOKEN_ABI, signer);
  }
  
  return new ethers.Contract(VVT_CONTRACT_ADDRESS, VVT_TOKEN_ABI, provider);
};

/**
 * Get VVT token balance for an address
 */
export const getVVTBalance = async (address) => {
  try {
    const contract = await getVVTContract();
    const balance = await contract.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Failed to get VVT balance:', error);
    return '0';
  }
};

/**
 * Get token information
 */
export const getTokenInfo = async () => {
  try {
    const contract = await getVVTContract();
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.totalSupply()
    ]);
    
    return {
      name,
      symbol,
      decimals: Number(decimals),
      totalSupply: ethers.formatEther(totalSupply)
    };
  } catch (error) {
    console.error('Failed to get token info:', error);
    return null;
  }
};

/**
 * Transfer VVT tokens
 */
export const transferVVT = async (to, amount) => {
  try {
    const contract = await getVVTContract(true);
    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await contract.transfer(to, amountInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Failed to transfer VVT:', error);
    throw error;
  }
};

/**
 * Approve VVT tokens for spending (needed for staking)
 */
export const approveVVT = async (spender, amount) => {
  try {
    const contract = await getVVTContract(true);
    const amountInWei = ethers.parseEther(amount.toString());
    const tx = await contract.approve(spender, amountInWei);
    await tx.wait();
    return tx;
  } catch (error) {
    console.error('Failed to approve VVT:', error);
    throw error;
  }
};

/**
 * Check if user has approved enough tokens for staking
 */
export const checkAllowance = async (owner, spender) => {
  try {
    const contract = await getVVTContract();
    const allowance = await contract.allowance(owner, spender);
    return ethers.formatEther(allowance);
  } catch (error) {
    console.error('Failed to check allowance:', error);
    return '0';
  }
};

/**
 * Get current network information
 */
export const getNetworkInfo = async () => {
  try {
    const provider = getProvider();
    const network = await provider.getNetwork();
    return {
      chainId: Number(network.chainId),
      name: network.name
    };
  } catch (error) {
    console.error('Failed to get network info:', error);
    return null;
  }
};

/**
 * Check if connected to the correct network (Ethereum Mainnet = 1, Sepolia = 11155111)
 */
export const isCorrectNetwork = async (expectedChainId = 1) => {
  try {
    const networkInfo = await getNetworkInfo();
    return networkInfo && networkInfo.chainId === expectedChainId;
  } catch (error) {
    console.error('Failed to check network:', error);
    return false;
  }
};

/**
 * Switch to Ethereum Mainnet
 */
export const switchToMainnet = async () => {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // Ethereum Mainnet
    });
    return true;
  } catch (error) {
    console.error('Failed to switch network:', error);
    throw error;
  }
};

/**
 * Add VVT token to MetaMask
 */
export const addVVTToMetaMask = async () => {
  try {
    const tokenInfo = await getTokenInfo();
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: VVT_CONTRACT_ADDRESS,
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals,
          image: 'https://viewervalue.net/viewervalue-3d-logo.webp',
        },
      },
    });
    return true;
  } catch (error) {
    console.error('Failed to add VVT to MetaMask:', error);
    throw error;
  }
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num) => {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

/**
 * Format address for display (0x1234...5678)
 */
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default {
  VVT_CONTRACT_ADDRESS,
  VVT_TOKEN_ABI,
  STAKING_CONTRACT_ABI,
  getProvider,
  getSigner,
  connectWallet,
  getVVTContract,
  getVVTBalance,
  getTokenInfo,
  transferVVT,
  approveVVT,
  checkAllowance,
  getNetworkInfo,
  isCorrectNetwork,
  switchToMainnet,
  addVVTToMetaMask,
  formatNumber,
  formatAddress
};
