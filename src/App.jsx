import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Alert, AlertDescription } from './components/ui/alert';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Lock, 
  Clock, 
  Shield, 
  ExternalLink,
  CheckCircle,
  Info,
  Eye,
  Coins,
  Globe,
  Plus
} from 'lucide-react';
import * as web3Utils from './utils/web3';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [vvtBalance, setVvtBalance] = useState('0');
  const [selectedTier, setSelectedTier] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);

  // REAL CONTRACT ADDRESS
  const VVT_CONTRACT_ADDRESS = web3Utils.VVT_CONTRACT_ADDRESS;

  // HONEST CURRENT STATE - Starting from zero
  const [platformStats, setPlatformStats] = useState({
    totalValueLocked: 0,
    totalStakers: 0,
    totalRewardsDistributed: 0,
    averageStake: 0,
    platformRevenue: 0
  });

  // REAL STAKING TIERS
  const stakingTiers = [
    {
      id: 'flexible',
      name: 'Flexible',
      apy: 8.5,
      minAmount: 100,
      lockPeriod: 0,
      multiplier: 1.0,
      withdrawalFee: 2.0,
      description: 'No lock period, withdraw anytime',
      benefits: ['Basic staking rewards', 'Reduced withdrawal fees', 'Instant liquidity'],
      color: 'from-purple-400 to-purple-500',
      icon: '⚡'
    },
    {
      id: 'short',
      name: 'Short Term',
      apy: 10.0,
      minAmount: 500,
      lockPeriod: 30,
      multiplier: 1.1,
      withdrawalFee: 1.5,
      description: '30-day commitment for higher rewards',
      benefits: ['10% APY', '1.1x reward multiplier', 'Lower fees', 'Priority support'],
      color: 'from-blue-400 to-blue-500',
      icon: '🚀'
    },
    {
      id: 'medium',
      name: 'Medium Term',
      apy: 12.5,
      minAmount: 1000,
      lockPeriod: 90,
      multiplier: 1.25,
      withdrawalFee: 1.0,
      description: '90-day commitment with premium benefits',
      benefits: ['12.5% APY', '1.25x multiplier', 'Priority support', 'Early feature access'],
      color: 'from-green-400 to-green-500',
      icon: '🌟'
    },
    {
      id: 'long',
      name: 'Long Term',
      apy: 15.0,
      minAmount: 2500,
      lockPeriod: 180,
      multiplier: 1.5,
      withdrawalFee: 0.5,
      description: '180-day commitment for serious stakers',
      benefits: ['15% APY', '1.5x multiplier', 'Premium features', 'Governance voting'],
      color: 'from-yellow-400 to-orange-500',
      icon: '👑'
    },
    {
      id: 'diamond',
      name: 'Diamond Hands',
      apy: 18.0,
      minAmount: 5000,
      lockPeriod: 365,
      multiplier: 2.0,
      withdrawalFee: 0.0,
      description: '1-year commitment for maximum rewards',
      benefits: ['18% APY', '2x multiplier', 'Zero fees', 'Governance rights', 'Exclusive perks'],
      color: 'from-purple-500 to-pink-500',
      icon: '💎'
    }
  ];

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  // Update balance when wallet is connected
  useEffect(() => {
    if (isConnected && walletAddress) {
      updateBalance();
    }
  }, [isConnected, walletAddress]);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          const network = await web3Utils.getNetworkInfo();
          setNetworkInfo(network);
        }
      } catch (error) {
        console.error('Failed to check connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
      updateBalance();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const updateBalance = async () => {
    try {
      const balance = await web3Utils.getVVTBalance(walletAddress);
      setVvtBalance(balance);
    } catch (error) {
      console.error('Failed to update balance:', error);
      setVvtBalance('0');
    }
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application.\n\nVisit: https://metamask.io');
      return;
    }

    setIsLoading(true);
    try {
      const address = await web3Utils.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      
      const network = await web3Utils.getNetworkInfo();
      setNetworkInfo(network);
      
      // Get VVT balance
      const balance = await web3Utils.getVVTBalance(address);
      setVvtBalance(balance);
      
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setVvtBalance('0');
    setNetworkInfo(null);
  };

  // Add VVT to MetaMask
  const handleAddToMetaMask = async () => {
    try {
      await web3Utils.addVVTToMetaMask();
      alert('VVT token has been added to your MetaMask wallet!');
    } catch (error) {
      console.error('Failed to add VVT to MetaMask:', error);
      alert('Failed to add VVT to MetaMask. Please try again.');
    }
  };

  // Handle staking (placeholder - needs staking contract)
  const handleStake = async () => {
    if (!selectedTier || !stakeAmount) {
      alert('Please select a tier and enter an amount to stake.');
      return;
    }

    if (parseFloat(stakeAmount) < selectedTier.minAmount) {
      alert(`Minimum stake for ${selectedTier.name} tier is ${selectedTier.minAmount} VVT`);
      return;
    }

    if (parseFloat(stakeAmount) > parseFloat(vvtBalance)) {
      alert(`Insufficient VVT balance. You have ${web3Utils.formatNumber(vvtBalance)} VVT`);
      return;
    }

    // Check network
    const isCorrect = await web3Utils.isCorrectNetwork(1); // Mainnet
    if (!isCorrect) {
      alert('Please switch to Ethereum Mainnet to stake VVT tokens.');
      return;
    }

    alert(`Staking functionality requires a staking smart contract to be deployed.\n\nContract Address: ${VVT_CONTRACT_ADDRESS}\nAmount: ${stakeAmount} VVT\nTier: ${selectedTier.name}\nAPY: ${selectedTier.apy}%\n\nThis will be activated once the staking contract is deployed and funded.`);
  };

  // Calculate potential rewards
  const calculateRewards = (amount, tier) => {
    if (!amount || !tier) return { daily: 0, monthly: 0, yearly: 0 };
    
    const principal = parseFloat(amount);
    const apy = tier.apy / 100;
    
    return {
      daily: (principal * apy) / 365,
      monthly: (principal * apy) / 12,
      yearly: principal * apy
    };
  };

  const rewards = calculateRewards(stakeAmount, selectedTier);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a0b2e 0%, #2d1b69 25%, #3730a3 50%, #2d1b69 75%, #1a0b2e 100%)',
      backgroundAttachment: 'fixed'
    }}>
      {/* Header - Exact match to ViewerValue.net */}
      <header className="border-b border-purple-500/20 bg-[#1a0b2e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* ViewerValue Logo - Exact match */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/viewervalue-3d-logo.webp" 
                  alt="ViewerValue Logo" 
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-xl font-bold text-white">ViewerValue</h1>
                  <p className="text-xs text-purple-300">Technologies LLC</p>
                </div>
              </div>
              <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/50 px-3 py-1">
                Prototype Stage - Seeking Deployment Funding
              </Badge>
            </div>
            
            {/* Navigation matching main site */}
            <div className="hidden md:flex items-center space-x-2">
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-white hover:bg-purple-500/20 px-4 py-2"
                onClick={() => window.open('https://viewervalue.net', '_blank')}
              >
                Overview
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-white hover:bg-purple-500/20 px-4 py-2"
                onClick={() => window.open('https://viewervalue.net#technology', '_blank')}
              >
                Technology
              </Button>
              <Button 
                variant="ghost" 
                className="text-purple-300 hover:text-white hover:bg-purple-500/20 px-4 py-2"
                onClick={() => window.open('https://viewervalue.net#investment', '_blank')}
              >
                Investment
              </Button>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-xs text-purple-300">Connected</p>
                    <p className="text-white font-mono text-sm">
                      {web3Utils.formatAddress(walletAddress)}
                    </p>
                  </div>
                  <div className="text-right bg-purple-600/20 px-3 py-2 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-300">VVT Balance</p>
                    <p className="text-white font-bold">{web3Utils.formatNumber(vvtBalance)}</p>
                  </div>
                  <Button 
                    onClick={handleAddToMetaMask} 
                    variant="outline" 
                    size="sm" 
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    title="Add VVT to MetaMask"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={disconnectWallet} 
                    variant="outline" 
                    size="sm" 
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={connectWallet} 
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        {/* Hero Section - Matching main site style exactly */}
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-2 bg-purple-600/20 rounded-full border border-purple-500/40 mb-6">
            <span className="text-purple-200 text-sm font-medium">Prototype Stage - Seeking Deployment Funding</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            Monetizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400">Attention Economy</span>
          </h1>
          <p className="text-xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            ViewerValue has developed working prototypes that track user attention on social media platforms and reward viewers with VVT tokens. 
            We're seeking investment to deploy and scale our proven concept.
          </p>
        </div>

        {/* Key Metrics - Exact match to main site cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">$0.10</div>
            <div className="text-purple-300 text-sm">Initial Token Value</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">5</div>
            <div className="text-purple-300 text-sm">Platforms Supported</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">Prototype</div>
            <div className="text-purple-300 text-sm">Development Status</div>
          </div>
          <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">$50M+</div>
            <div className="text-purple-300 text-sm">Market Cap Potential</div>
          </div>
        </div>

        {/* Transparency Notice */}
        <Alert className="mb-12 border-blue-500/30 bg-blue-900/20 backdrop-blur-sm">
          <Info className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200 text-base">
            <strong>Transparency Notice:</strong> This staking platform is in development. All statistics start from zero and will grow as real users begin staking. 
            The VVT token contract is ready for deployment on Ethereum mainnet, and full staking functionality will be activated upon funding completion.
          </AlertDescription>
        </Alert>

        {/* Current Development Status - Matching main site exactly */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Current Development Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Browser Extension Card */}
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Browser Extension</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Functional prototype ready for deployment</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Tracks attention on 5 platforms</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Token reward calculation</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Awaiting Chrome Web Store submission</span>
                </div>
              </div>
            </div>

            {/* Mobile App Card */}
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Mobile App</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">React Native framework completed</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">User authentication system</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Attention tracking service</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Awaiting app store submission</span>
                </div>
              </div>
            </div>

            {/* Smart Contracts Card */}
            <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Smart Contracts</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">VVT token system developed</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">ERC20 token contract</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Revenue distribution model</span>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-purple-200">Awaiting blockchain deployment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VVT Staking Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-4">VVT Token Staking</h2>
          <p className="text-xl text-purple-200 text-center max-w-3xl mx-auto mb-12">
            Stake your ViewerValue tokens to earn rewards, unlock premium features, and participate in platform governance.
          </p>

          {/* Platform Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">Total Value Locked</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${platformStats.totalValueLocked.toLocaleString()}</div>
                <p className="text-xs text-purple-400 mt-1">Starting from $0 - grows with real stakers</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">Active Stakers</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{platformStats.totalStakers}</div>
                <p className="text-xs text-purple-400 mt-1">Real users who have staked VVT</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">Rewards Distributed</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">${platformStats.totalRewardsDistributed.toLocaleString()}</div>
                <p className="text-xs text-purple-400 mt-1">Actual rewards paid to stakers</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">Platform Status</CardTitle>
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">READY</div>
                <p className="text-xs text-purple-400 mt-1">Awaiting deployment funding</p>
              </CardContent>
            </Card>
          </div>

          {/* Staking Tiers */}
          <Tabs defaultValue="tiers" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-purple-900/30 border border-purple-500/30 backdrop-blur-sm">
              <TabsTrigger 
                value="tiers" 
                className="text-purple-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Staking Tiers
              </TabsTrigger>
              <TabsTrigger 
                value="stake" 
                className="text-purple-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                Stake VVT
              </TabsTrigger>
            </TabsList>

            {/* Tiers Tab */}
            <TabsContent value="tiers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stakingTiers.map((tier) => (
                  <Card key={tier.id} className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm hover:border-purple-400/60 transition-all">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl">{tier.icon}</span>
                          <div>
                            <CardTitle className="text-white text-lg">{tier.name}</CardTitle>
                            <CardDescription className="text-purple-300 text-sm">{tier.description}</CardDescription>
                          </div>
                        </div>
                      </div>
                      <Badge className={`bg-gradient-to-r ${tier.color} text-white border-0 text-sm px-3 py-1 w-fit`}>
                        {tier.apy}% APY
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                            <p className="text-purple-300 text-xs mb-1">Min Stake</p>
                            <p className="text-white font-bold">{tier.minAmount.toLocaleString()}</p>
                          </div>
                          <div className="text-center p-3 bg-purple-600/20 rounded-lg border border-purple-500/30">
                            <p className="text-purple-300 text-xs mb-1">Lock Period</p>
                            <p className="text-white font-bold">{tier.lockPeriod}d</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                            <span className="text-purple-300 text-sm">Reward Multiplier:</span>
                            <span className="text-green-400 font-semibold">{tier.multiplier}x</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                            <span className="text-purple-300 text-sm">Withdrawal Fee:</span>
                            <span className="text-white font-semibold">{tier.withdrawalFee}%</span>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-purple-500/20">
                          <p className="text-purple-400 text-sm mb-3 font-medium">Benefits:</p>
                          <ul className="space-y-2">
                            {tier.benefits.map((benefit, index) => (
                              <li key={index} className="text-white text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-400 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Stake Tab */}
            <TabsContent value="stake">
              {!isConnected ? (
                <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
                  <CardContent className="pt-12">
                    <div className="text-center py-12">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <Wallet className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h3>
                      <p className="text-purple-300 mb-8 max-w-md mx-auto">
                        Connect your MetaMask wallet to start staking VVT tokens and earning rewards
                      </p>
                      <Button 
                        onClick={connectWallet} 
                        disabled={isLoading}
                        size="lg" 
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Staking Form */}
                  <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Stake Your VVT</CardTitle>
                      <CardDescription className="text-purple-300">
                        Select a tier and amount to start earning rewards
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-purple-300">Select Staking Tier</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {stakingTiers.slice(0, 4).map((tier) => (
                            <Button
                              key={tier.id}
                              variant={selectedTier?.id === tier.id ? "default" : "outline"}
                              className={`h-auto py-4 flex flex-col items-start ${
                                selectedTier?.id === tier.id 
                                  ? 'bg-purple-600 text-white border-purple-500' 
                                  : 'bg-purple-900/30 text-purple-300 border-purple-500/30 hover:bg-purple-600/20'
                              }`}
                              onClick={() => setSelectedTier(tier)}
                            >
                              <span className="text-lg font-bold">{tier.name}</span>
                              <span className="text-sm opacity-80">{tier.apy}% APY</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-purple-300">Amount to Stake</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="Enter VVT amount"
                            value={stakeAmount}
                            onChange={(e) => setStakeAmount(e.target.value)}
                            className="bg-purple-900/30 border-purple-500/30 text-white placeholder:text-purple-400 pr-16"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 font-semibold">
                            VVT
                          </span>
                        </div>
                        {selectedTier && (
                          <p className="text-sm text-purple-400">
                            Minimum: {selectedTier.minAmount.toLocaleString()} VVT | Available: {web3Utils.formatNumber(vvtBalance)} VVT
                          </p>
                        )}
                      </div>

                      {selectedTier && stakeAmount && parseFloat(stakeAmount) >= selectedTier.minAmount && (
                        <div className="p-4 bg-purple-600/20 rounded-lg border border-purple-500/30 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Lock Period:</span>
                            <span className="text-white font-semibold">{selectedTier.lockPeriod} days</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">APY:</span>
                            <span className="text-green-400 font-semibold">{selectedTier.apy}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-300">Withdrawal Fee:</span>
                            <span className="text-white font-semibold">{selectedTier.withdrawalFee}%</span>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={handleStake}
                        disabled={!selectedTier || !stakeAmount || parseFloat(stakeAmount) < (selectedTier?.minAmount || 0)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
                      >
                        <Lock className="w-5 h-5 mr-2" />
                        Stake VVT Tokens
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Rewards Calculator */}
                  <Card className="bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white text-xl">Estimated Rewards</CardTitle>
                      <CardDescription className="text-purple-300">
                        Calculate your potential earnings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedTier && stakeAmount && parseFloat(stakeAmount) >= selectedTier.minAmount ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                              <p className="text-purple-300 text-sm mb-2">Daily</p>
                              <p className="text-white font-bold text-lg">{rewards.daily.toFixed(2)}</p>
                              <p className="text-purple-400 text-xs">VVT</p>
                            </div>
                            <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                              <p className="text-purple-300 text-sm mb-2">Monthly</p>
                              <p className="text-white font-bold text-lg">{rewards.monthly.toFixed(2)}</p>
                              <p className="text-purple-400 text-xs">VVT</p>
                            </div>
                            <div className="text-center p-4 bg-purple-600/20 rounded-lg border border-purple-500/30">
                              <p className="text-purple-300 text-sm mb-2">Yearly</p>
                              <p className="text-white font-bold text-lg">{rewards.yearly.toFixed(2)}</p>
                              <p className="text-purple-400 text-xs">VVT</p>
                            </div>
                          </div>

                          <div className="space-y-3 p-4 bg-purple-600/10 rounded-lg border border-purple-500/20">
                            <h4 className="text-white font-semibold mb-3">Staking Summary</h4>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Stake Amount:</span>
                              <span className="text-white font-semibold">{parseFloat(stakeAmount).toLocaleString()} VVT</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Tier:</span>
                              <span className="text-white font-semibold">{selectedTier.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">APY:</span>
                              <span className="text-green-400 font-semibold">{selectedTier.apy}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Multiplier:</span>
                              <span className="text-green-400 font-semibold">{selectedTier.multiplier}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-300">Lock Period:</span>
                              <span className="text-white font-semibold">{selectedTier.lockPeriod} days</span>
                            </div>
                          </div>

                          <Alert className="border-green-500/30 bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <AlertDescription className="text-green-200 text-sm">
                              Your rewards will be calculated and distributed automatically based on your stake amount and selected tier.
                            </AlertDescription>
                          </Alert>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-purple-400">Select a tier and enter amount to see rewards</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Contract Information */}
        <Card className="mb-12 bg-purple-900/30 border-purple-500/30 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center text-xl">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              VVT Token Contract Information
            </CardTitle>
            <CardDescription className="text-purple-300 text-base">
              ViewerValue Token ready for deployment on Ethereum mainnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-purple-300 text-sm mb-2 block">Contract Address</Label>
                <div className="flex items-center space-x-2">
                  <code className="bg-purple-900/50 px-4 py-3 rounded-lg text-green-400 font-mono text-sm border border-purple-500/30 flex-1">
                    {VVT_CONTRACT_ADDRESS}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
                    onClick={() => window.open(`https://etherscan.io/address/${VVT_CONTRACT_ADDRESS}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-purple-300 text-sm mb-3 block">Token Details</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Coins className="w-4 h-4 text-yellow-400" />
                    <span className="text-white text-sm">Total Supply: 1,000,000 VVT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">Initial Value: $0.10 per VVT</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm">Security: OpenZeppelin Standards</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer - Matching main site */}
        <footer className="mt-16 border-t border-purple-500/20 pt-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img 
                src="/viewervalue-3d-logo.webp" 
                alt="ViewerValue Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-white font-semibold">ViewerValue Technologies LLC</span>
            </div>
            <p className="text-purple-400 text-sm mb-4">
              Powered by Ethereum • Secured by OpenZeppelin • Built with transparency
            </p>
            <div className="flex justify-center space-x-6 text-sm">
              <a 
                href="https://viewervalue.net" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white transition-colors"
              >
                Main Platform
              </a>
              <a 
                href={`https://etherscan.io/address/${VVT_CONTRACT_ADDRESS}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white transition-colors"
              >
                View Contract
              </a>
              <a 
                href="https://github.com/viewervalue" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
