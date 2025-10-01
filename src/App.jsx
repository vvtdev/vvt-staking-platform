import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Progress } from './components/ui/progress';
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
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [vvtBalance, setVvtBalance] = useState(0);
  const [selectedTier, setSelectedTier] = useState(null);
  const [stakeAmount, setStakeAmount] = useState('');

  // REAL CONTRACT ADDRESS - Your deployed VVT token
  const VVT_CONTRACT_ADDRESS = "0x2e4a...0092ab"; // Replace with your actual contract address from MetaMask transaction

  // HONEST CURRENT STATE - Starting from zero
  const [platformStats, setPlatformStats] = useState({
    totalValueLocked: 0,
    totalStakers: 0,
    totalRewardsDistributed: 0,
    averageStake: 0,
    platformRevenue: 0
  });

  // REAL STAKING TIERS - These are the actual rates we'll implement
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
      benefits: ['Basic staking rewards', 'Reduced withdrawal fees']
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
      benefits: ['10% APY', '1.1x reward multiplier', 'Lower fees']
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
      benefits: ['12.5% APY', '1.25x multiplier', 'Priority support']
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
      benefits: ['15% APY', '1.5x multiplier', 'Premium features']
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
      benefits: ['18% APY', '2x multiplier', 'Zero fees', 'Governance rights']
    }
  ];

  // Connect to MetaMask
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        
        // Get VVT balance (this would need actual contract integration)
        // For now, we'll show 0 until real integration
        setVvtBalance(0);
        
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please make sure MetaMask is installed.');
      }
    } else {
      alert('Please install MetaMask to use this application.');
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setVvtBalance(0);
  };

  // Handle staking (placeholder - needs real contract integration)
  const handleStake = async () => {
    if (!selectedTier || !stakeAmount) {
      alert('Please select a tier and enter an amount to stake.');
      return;
    }

    if (parseFloat(stakeAmount) < selectedTier.minAmount) {
      alert(`Minimum stake for ${selectedTier.name} tier is ${selectedTier.minAmount} VVT`);
      return;
    }

    // This would integrate with your actual smart contract
    alert(`Staking functionality will be connected to your VVT contract at ${VVT_CONTRACT_ADDRESS}. This requires smart contract integration.`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VVT</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">VVT Staking Platform</h1>
                <p className="text-gray-300 text-sm">ViewerValue Token Staking & Rewards</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-300">Connected Wallet</p>
                    <p className="text-white font-mono text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-300">VVT Balance</p>
                    <p className="text-white font-bold">{vvtBalance.toLocaleString()} VVT</p>
                  </div>
                  <Button onClick={disconnectWallet} variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Transparency Notice */}
        <Alert className="mb-8 border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-blue-100">
            <strong>Transparency Notice:</strong> This platform is newly launched. All statistics start from zero and will grow as real users begin staking. 
            The VVT token contract is live on Ethereum mainnet, and staking functionality requires MetaMask integration with the deployed contract.
          </AlertDescription>
        </Alert>

        {/* Platform Statistics - HONEST CURRENT STATE */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Value Locked</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${platformStats.totalValueLocked.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Starting from $0 - grows with real stakers</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Stakers</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{platformStats.totalStakers}</div>
              <p className="text-xs text-gray-400">Real users who have staked VVT</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Rewards Distributed</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${platformStats.totalRewardsDistributed.toLocaleString()}</div>
              <p className="text-xs text-gray-400">Actual rewards paid to stakers</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Platform Status</CardTitle>
              <Shield className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">LIVE</div>
              <p className="text-xs text-gray-400">VVT contract deployed on Ethereum</p>
            </CardContent>
          </Card>
        </div>

        {/* Contract Information */}
        <Card className="mb-8 bg-black/40 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-green-400" />
              Live VVT Token Contract
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your ViewerValue Token is deployed and verified on Ethereum mainnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">Contract Address</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="bg-gray-800 px-3 py-2 rounded text-green-400 font-mono text-sm">
                    {VVT_CONTRACT_ADDRESS}
                  </code>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(`https://etherscan.io/address/${VVT_CONTRACT_ADDRESS}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Token Details</Label>
                <div className="mt-1 space-y-1">
                  <p className="text-white text-sm">• Total Supply: 1,000,000 VVT</p>
                  <p className="text-white text-sm">• Commission: 15% Owner, 65% Users</p>
                  <p className="text-white text-sm">• Security: OpenZeppelin Standards</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="stake" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 border-white/10">
            <TabsTrigger value="stake" className="text-white data-[state=active]:bg-purple-600">
              Stake VVT
            </TabsTrigger>
            <TabsTrigger value="tiers" className="text-white data-[state=active]:bg-purple-600">
              Staking Tiers
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="text-white data-[state=active]:bg-purple-600">
              My Portfolio
            </TabsTrigger>
          </TabsList>

          {/* Staking Tab */}
          <TabsContent value="stake" className="space-y-6">
            {!isConnected ? (
              <Card className="bg-black/40 border-white/10">
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
                    <p className="text-gray-300 mb-6">Connect MetaMask to start staking your VVT tokens</p>
                    <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect MetaMask
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staking Form */}
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Stake VVT Tokens</CardTitle>
                    <CardDescription className="text-gray-300">
                      Choose your staking tier and amount to start earning rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Select Staking Tier</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {stakingTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              selectedTier?.id === tier.id
                                ? 'border-purple-500 bg-purple-500/20'
                                : 'border-white/10 bg-black/20 hover:border-white/20'
                            }`}
                            onClick={() => setSelectedTier(tier)}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">{tier.name}</p>
                                <p className="text-gray-400 text-sm">{tier.apy}% APY • {tier.lockPeriod} days</p>
                              </div>
                              <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                                {tier.minAmount}+ VVT
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-300">Stake Amount (VVT)</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount to stake"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className="bg-black/20 border-white/10 text-white"
                      />
                      {selectedTier && (
                        <p className="text-gray-400 text-sm mt-1">
                          Minimum: {selectedTier.minAmount} VVT
                        </p>
                      )}
                    </div>

                    <Alert className="border-yellow-500/50 bg-yellow-500/10">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-yellow-100">
                        <strong>Development Notice:</strong> Staking functionality requires smart contract integration. 
                        This will connect to your deployed VVT contract for real transactions.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      onClick={handleStake} 
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={!selectedTier || !stakeAmount}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Stake VVT Tokens
                    </Button>
                  </CardContent>
                </Card>

                {/* Rewards Calculator */}
                <Card className="bg-black/40 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Rewards Calculator</CardTitle>
                    <CardDescription className="text-gray-300">
                      Estimated rewards based on your staking amount and tier
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedTier && stakeAmount ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">Daily</p>
                            <p className="text-white font-bold">{rewards.daily.toFixed(2)} VVT</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">Monthly</p>
                            <p className="text-white font-bold">{rewards.monthly.toFixed(2)} VVT</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400 text-sm">Yearly</p>
                            <p className="text-white font-bold">{rewards.yearly.toFixed(2)} VVT</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Stake Amount:</span>
                            <span className="text-white">{parseFloat(stakeAmount).toLocaleString()} VVT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">APY:</span>
                            <span className="text-green-400">{selectedTier.apy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Lock Period:</span>
                            <span className="text-white">{selectedTier.lockPeriod} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Withdrawal Fee:</span>
                            <span className="text-white">{selectedTier.withdrawalFee}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-400">Select a tier and enter amount to see rewards</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stakingTiers.map((tier) => (
                <Card key={tier.id} className="bg-black/40 border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{tier.name}</CardTitle>
                        <CardDescription className="text-gray-300">{tier.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                        {tier.apy}% APY
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum Stake:</span>
                        <span className="text-white">{tier.minAmount.toLocaleString()} VVT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Lock Period:</span>
                        <span className="text-white">{tier.lockPeriod} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Reward Multiplier:</span>
                        <span className="text-green-400">{tier.multiplier}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Withdrawal Fee:</span>
                        <span className="text-white">{tier.withdrawalFee}%</span>
                      </div>
                      
                      <div className="pt-3 border-t border-white/10">
                        <p className="text-gray-400 text-sm mb-2">Benefits:</p>
                        <ul className="space-y-1">
                          {tier.benefits.map((benefit, index) => (
                            <li key={index} className="text-white text-sm flex items-center">
                              <CheckCircle className="w-3 h-3 mr-2 text-green-400" />
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

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="bg-black/40 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">My Staking Portfolio</CardTitle>
                <CardDescription className="text-gray-300">
                  Overview of your staked VVT tokens and rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center py-8">
                    <Wallet className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Connect Wallet</h3>
                    <p className="text-gray-300 mb-6">Connect your wallet to view your staking portfolio</p>
                    <Button onClick={connectWallet} className="bg-purple-600 hover:bg-purple-700">
                      Connect MetaMask
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Lock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Active Stakes</h3>
                    <p className="text-gray-300 mb-6">You haven't staked any VVT tokens yet. Start staking to earn rewards!</p>
                    <Button 
                      onClick={() => document.querySelector('[value="stake"]').click()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Start Staking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">ViewerValue</h3>
              <p className="text-gray-400 text-sm">
                Transforming attention into value through blockchain technology. 
                Stake VVT tokens to earn rewards and access premium features.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="https://viewervalue.net" className="text-gray-400 hover:text-white text-sm block">
                  Main Platform
                </a>
                <a href={`https://etherscan.io/address/${VVT_CONTRACT_ADDRESS}`} className="text-gray-400 hover:text-white text-sm block">
                  View Contract
                </a>
                <a href="https://github.com/vvtdev/vvt-staking-platform" className="text-gray-400 hover:text-white text-sm block">
                  GitHub Repository
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Email: support@viewervalue.net</p>
                <p className="text-gray-400 text-sm">Discord: ViewerValue Community</p>
                <p className="text-gray-400 text-sm">Twitter: @ViewerValue</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 ViewerValue Technologies LLC. Built with transparency and honesty.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
