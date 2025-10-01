import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import { Coins, TrendingUp, DollarSign, Lock, Unlock, Gift, Users, ArrowUpRight, ArrowDownRight, Wallet, Clock, Star, Shield, Zap, Target } from 'lucide-react'
import './App.css'

function App() {
  const [connectedWallet, setConnectedWallet] = useState('0x38EA...70DCa')
  const [vvtBalance, setVvtBalance] = useState(15750.50)
  const [stakedAmount, setStakedAmount] = useState(8500.00)
  const [pendingRewards, setPendingRewards] = useState(127.85)
  const [totalStaked, setTotalStaked] = useState(2847500)
  const [stakingAPY, setStakingAPY] = useState(12.5)
  const [stakeAmount, setStakeAmount] = useState('')
  const [unstakeAmount, setUnstakeAmount] = useState('')
  const [selectedStakingPeriod, setSelectedStakingPeriod] = useState('flexible')

  // Mock data for charts
  const stakingTiers = [
    { name: 'Flexible', apy: 8.5, minAmount: 100, lockPeriod: '0 days', multiplier: '1.0x', color: '#06b6d4' },
    { name: 'Short Term', apy: 10.0, minAmount: 500, lockPeriod: '30 days', multiplier: '1.1x', color: '#8b5cf6' },
    { name: 'Medium Term', apy: 12.5, minAmount: 1000, lockPeriod: '90 days', multiplier: '1.25x', color: '#10b981' },
    { name: 'Long Term', apy: 15.0, minAmount: 2500, lockPeriod: '180 days', multiplier: '1.5x', color: '#f59e0b' },
    { name: 'Diamond Hands', apy: 18.0, minAmount: 5000, lockPeriod: '365 days', multiplier: '2.0x', color: '#ef4444' }
  ]

  const rewardsHistory = [
    { date: 'Sep 25', rewards: 12.5, apy: 11.8, totalStaked: 8200 },
    { date: 'Sep 26', rewards: 15.2, apy: 12.1, totalStaked: 8350 },
    { date: 'Sep 27', rewards: 18.7, apy: 12.3, totalStaked: 8400 },
    { date: 'Sep 28', rewards: 22.1, apy: 12.4, totalStaked: 8450 },
    { date: 'Sep 29', rewards: 25.8, apy: 12.5, totalStaked: 8500 },
    { date: 'Sep 30', rewards: 28.9, apy: 12.6, totalStaked: 8500 },
    { date: 'Oct 01', rewards: 32.4, apy: 12.7, totalStaked: 8500 }
  ]

  const revenueDistribution = [
    { name: 'Staking Rewards', value: 45, amount: 12750, color: '#8b5cf6' },
    { name: 'Platform Revenue', value: 30, amount: 8500, color: '#06b6d4' },
    { name: 'Transaction Fees', value: 15, amount: 4250, color: '#10b981' },
    { name: 'Premium Features', value: 10, amount: 2833, color: '#f59e0b' }
  ]

  const stakingStats = [
    { metric: 'Total Value Locked', value: '$2,847,500', change: '+15.3%', icon: Lock },
    { metric: 'Active Stakers', value: '1,247', change: '+8.7%', icon: Users },
    { metric: 'Average Stake', value: '2,284 VVT', change: '+12.1%', icon: Target },
    { metric: 'Rewards Distributed', value: '$45,670', change: '+22.4%', icon: Gift }
  ]

  const withdrawalTiers = [
    { tier: 'Free User', fee: '3.0%', minStake: '0 VVT', features: ['Basic withdrawal', 'Weekly payouts'] },
    { tier: 'Bronze Staker', fee: '2.0%', minStake: '100+ VVT', features: ['Reduced fees', 'Bi-weekly payouts'] },
    { tier: 'Silver Staker', fee: '1.0%', minStake: '500+ VVT', features: ['Low fees', 'Weekly payouts'] },
    { tier: 'Gold Staker', fee: '0.5%', minStake: '1,000+ VVT', features: ['Minimal fees', 'Daily payouts'] },
    { tier: 'Diamond Staker', fee: '0.0%', minStake: '2,500+ VVT', features: ['Zero fees', 'Instant payouts', 'Priority support'] }
  ]

  const calculateRewards = (amount, period) => {
    const tier = stakingTiers.find(t => t.name.toLowerCase().includes(period.toLowerCase())) || stakingTiers[0]
    const dailyReward = (amount * tier.apy / 100) / 365
    return {
      daily: dailyReward,
      monthly: dailyReward * 30,
      yearly: amount * tier.apy / 100,
      apy: tier.apy
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-8 w-8 text-purple-600" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  VVT Staking Platform
                </h1>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Live on Ethereum
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Connected Wallet</div>
                <div className="font-mono text-sm">{connectedWallet}</div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">VVT Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{vvtBalance.toLocaleString()}</div>
                  <p className="text-xs opacity-80">≈ ${(vvtBalance * 0.10).toLocaleString()}</p>
                </div>
                <Coins className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Staked Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{stakedAmount.toLocaleString()}</div>
                  <div className="flex items-center text-xs opacity-80">
                    <Lock className="h-3 w-3 mr-1" />
                    {stakingAPY}% APY
                  </div>
                </div>
                <Lock className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Pending Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{pendingRewards.toFixed(2)}</div>
                  <div className="flex items-center text-xs opacity-80">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +2.3 VVT today
                  </div>
                </div>
                <Gift className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">$1,247.50</div>
                  <div className="flex items-center text-xs opacity-80">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    All-time rewards
                  </div>
                </div>
                <DollarSign className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Staking Interface */}
        <Tabs defaultValue="stake" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-fit">
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          {/* Staking Tab */}
          <TabsContent value="stake" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Staking Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Stake VVT Tokens
                  </CardTitle>
                  <CardDescription>
                    Lock your VVT tokens to earn rewards and unlock premium features
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="stake-amount">Amount to Stake</Label>
                      <div className="relative">
                        <Input
                          id="stake-amount"
                          type="number"
                          placeholder="0.00"
                          value={stakeAmount}
                          onChange={(e) => setStakeAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                          VVT
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Available: {vvtBalance.toLocaleString()} VVT</span>
                        <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setStakeAmount(vvtBalance.toString())}>
                          Max
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="staking-period">Staking Period</Label>
                      <Select value={selectedStakingPeriod} onValueChange={setSelectedStakingPeriod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staking period" />
                        </SelectTrigger>
                        <SelectContent>
                          {stakingTiers.map((tier) => (
                            <SelectItem key={tier.name.toLowerCase().replace(' ', '')} value={tier.name.toLowerCase().replace(' ', '')}>
                              {tier.name} - {tier.apy}% APY ({tier.lockPeriod})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {stakeAmount && (
                      <div className="p-4 bg-muted rounded-lg space-y-2">
                        <div className="text-sm font-medium">Estimated Rewards</div>
                        {(() => {
                          const rewards = calculateRewards(parseFloat(stakeAmount) || 0, selectedStakingPeriod)
                          return (
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Daily</div>
                                <div className="font-medium">{rewards.daily.toFixed(2)} VVT</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Monthly</div>
                                <div className="font-medium">{rewards.monthly.toFixed(2)} VVT</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Yearly</div>
                                <div className="font-medium">{rewards.yearly.toFixed(2)} VVT</div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600" size="lg">
                    <Lock className="h-4 w-4 mr-2" />
                    Stake VVT Tokens
                  </Button>
                </CardContent>
              </Card>

              {/* Unstaking Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Unlock className="h-5 w-5 mr-2" />
                    Unstake VVT Tokens
                  </CardTitle>
                  <CardDescription>
                    Withdraw your staked tokens and claim pending rewards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Pending Rewards</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Ready to Claim
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{pendingRewards.toFixed(2)} VVT</div>
                      <div className="text-sm text-muted-foreground">≈ ${(pendingRewards * 0.10).toFixed(2)}</div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unstake-amount">Amount to Unstake</Label>
                      <div className="relative">
                        <Input
                          id="unstake-amount"
                          type="number"
                          placeholder="0.00"
                          value={unstakeAmount}
                          onChange={(e) => setUnstakeAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                          VVT
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Staked: {stakedAmount.toLocaleString()} VVT</span>
                        <Button variant="link" className="h-auto p-0 text-xs" onClick={() => setUnstakeAmount(stakedAmount.toString())}>
                          Max
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="lg">
                      <Gift className="h-4 w-4 mr-2" />
                      Claim Rewards ({pendingRewards.toFixed(2)} VVT)
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Unlock className="h-4 w-4 mr-2" />
                      Unstake Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Staking Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stakingStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.metric}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <div className="flex items-center text-sm text-green-600">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {stat.change}
                        </div>
                      </div>
                      <stat.icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rewards History Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Rewards History</CardTitle>
                  <CardDescription>
                    Your daily staking rewards and APY performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rewardsHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="rewards" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Daily Rewards (VVT)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Sources</CardTitle>
                  <CardDescription>
                    How platform revenue is distributed to stakers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={revenueDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {revenueDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {revenueDistribution.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="text-sm">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-muted-foreground">${item.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staking Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staking Tiers & APY Rates</CardTitle>
                <CardDescription>
                  Choose your staking period to maximize rewards and unlock benefits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stakingTiers.map((tier, index) => (
                    <Card key={index} className={`relative overflow-hidden ${index === 2 ? 'ring-2 ring-purple-500' : ''}`}>
                      {index === 2 && (
                        <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-medium">
                          POPULAR
                        </div>
                      )}
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{tier.name}</CardTitle>
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: tier.color }}
                          />
                        </div>
                        <div className="text-3xl font-bold" style={{ color: tier.color }}>
                          {tier.apy}%
                          <span className="text-sm font-normal text-muted-foreground ml-1">APY</span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Min Amount:</span>
                            <span className="font-medium">{tier.minAmount} VVT</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Lock Period:</span>
                            <span className="font-medium">{tier.lockPeriod}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Reward Multiplier:</span>
                            <span className="font-medium">{tier.multiplier}</span>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          variant={index === 2 ? "default" : "outline"}
                          style={index === 2 ? { backgroundColor: tier.color } : {}}
                        >
                          Select {tier.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* APY Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>APY Performance</CardTitle>
                  <CardDescription>
                    Historical APY rates and staking performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={rewardsHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="apy" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="APY %" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Staking Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Staking Growth</CardTitle>
                  <CardDescription>
                    Your total staked amount over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={rewardsHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalStaked" fill="#8b5cf6" name="Total Staked (VVT)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>VVT Staker Benefits</CardTitle>
                <CardDescription>
                  Unlock premium features and reduced fees by staking VVT tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {withdrawalTiers.map((tier, index) => (
                    <div key={index} className={`p-6 rounded-lg border-2 ${
                      index === withdrawalTiers.length - 1 
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                        : 'border-border'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            index === withdrawalTiers.length - 1 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-muted'
                          }`}>
                            {index === withdrawalTiers.length - 1 ? (
                              <Star className="h-5 w-5" />
                            ) : (
                              <Shield className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{tier.tier}</h3>
                            <p className="text-sm text-muted-foreground">Requires {tier.minStake} staked</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{tier.fee}</div>
                          <div className="text-sm text-muted-foreground">Withdrawal Fee</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tier.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center space-x-2">
                            <Zap className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
