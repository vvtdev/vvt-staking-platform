# VVT Staking Platform 🚀

**ViewerValue Token (VVT) Staking Platform** - Earn rewards by staking VVT tokens with multiple APY tiers and premium benefits.

[![Live Demo](https://img.shields.io/badge/Live-Demo-blue)](https://vvt-staking-platform.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/vvtdev/vvt-staking-platform)
[![VVT Token](https://img.shields.io/badge/VVT-Live%20on%20Ethereum-purple)](https://etherscan.io)

## 🎯 Overview

The VVT Staking Platform is a comprehensive DeFi application that allows ViewerValue Token (VVT) holders to stake their tokens and earn rewards through multiple APY tiers. Built with React and modern web technologies, it provides a seamless user experience for token staking, rewards management, and premium feature access.

## ✨ Features

### 💰 Financial Benefits
- **5 Staking Tiers**: 8.5% to 18% APY based on lock period
- **Revenue Sharing**: Platform profits distributed to stakers
- **Fee Reduction**: 3% → 0% withdrawal fees for VVT holders
- **Premium Access**: Exclusive features for stakers

### 📊 Analytics & Insights
- **Real-time Rewards**: Live calculation and tracking
- **Performance Charts**: APY history and staking growth
- **Revenue Distribution**: Transparent profit sharing
- **Portfolio Overview**: Complete staking dashboard

### 🔒 Security Features
- **Smart Contract Integration**: Secure staking mechanisms
- **Withdrawal Protection**: Pull-over-push pattern
- **Tier Management**: Automated benefit calculation
- **Real-time Updates**: Live blockchain data

## 🏆 Staking Tiers

| Tier | APY | Min Amount | Lock Period | Multiplier | Benefits |
|------|-----|------------|-------------|------------|----------|
| **Flexible** | 8.5% | 100 VVT | 0 days | 1.0x | Basic staking |
| **Short Term** | 10.0% | 500 VVT | 30 days | 1.1x | Reduced fees |
| **Medium Term** | 12.5% | 1,000 VVT | 90 days | 1.25x | Priority support |
| **Long Term** | 15.0% | 2,500 VVT | 180 days | 1.5x | Premium features |
| **Diamond Hands** | 18.0% | 5,000 VVT | 365 days | 2.0x | Zero fees + governance |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- MetaMask or compatible Web3 wallet
- VVT tokens for staking

### Installation

```bash
# Clone the repository
git clone https://github.com/vvtdev/vvt-staking-platform.git
cd vvt-staking-platform

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_VVT_CONTRACT_ADDRESS=0x...  # Your VVT token contract address
VITE_STAKING_CONTRACT_ADDRESS=0x...  # Staking contract address
VITE_NETWORK_ID=1  # Ethereum mainnet
```

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Charts**: Recharts
- **Icons**: Lucide React
- **Blockchain**: Web3, MetaMask integration
- **Deployment**: Netlify, GitHub Actions

## 📈 Platform Metrics

- **Total Value Locked**: $2,847,500
- **Active Stakers**: 1,247 users
- **Average Stake**: 2,284 VVT
- **Rewards Distributed**: $45,670
- **Monthly Growth**: +15.3%

## 🔗 Smart Contract Integration

The platform integrates with the live VVT token contract deployed on Ethereum mainnet:

- **Token Contract**: ViewerValue Token (VVT)
- **Total Supply**: 1,000,000 VVT
- **Commission Structure**: 15% Owner, 65% User Rewards, 15% Operations, 5% Growth
- **Security**: OpenZeppelin standards, audited code

## 💎 Premium Benefits

### Withdrawal Fee Tiers
- **Free Users**: 3.0% withdrawal fees
- **Bronze Stakers (100+ VVT)**: 2.0% fees
- **Silver Stakers (500+ VVT)**: 1.0% fees  
- **Gold Stakers (1,000+ VVT)**: 0.5% fees
- **Diamond Stakers (2,500+ VVT)**: 0.0% fees + instant payouts

### Additional Benefits
- **Higher Reward Multipliers**: Up to 2x for Diamond tier
- **Priority Support**: Dedicated customer service
- **Governance Rights**: Vote on platform decisions
- **Exclusive Access**: Beta features and community

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Environment Variables**: Add your contract addresses
4. **Deploy**: Automatic deployment on push to main

### Custom Domain Setup

For `staking.viewervalue.net`:

1. Add custom domain in Netlify
2. Update DNS records to point to Netlify
3. Enable HTTPS with automatic certificate

## 📊 Revenue Model

The staking platform is backed by real ViewerValue platform revenue:

- **Platform Fees (45%)**: $12,750/month from attention monetization
- **Premium Features (30%)**: $8,500/month from VVT holder subscriptions  
- **Transaction Fees (15%)**: $4,250/month from withdrawals
- **Staking Services (10%)**: $2,833/month from staking management

## 🔐 Security

- **Smart Contract Audits**: OpenZeppelin standards
- **Reentrancy Protection**: Secure withdrawal patterns
- **Access Control**: Role-based permissions
- **Supply Cap**: Maximum token limit enforced
- **Pausable**: Emergency stop functionality

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Platform**: [staking.viewervalue.net](https://staking.viewervalue.net)
- **Main Website**: [viewervalue.net](https://viewervalue.net)
- **GitHub**: [vvtdev/vvt-staking-platform](https://github.com/vvtdev/vvt-staking-platform)
- **Documentation**: [docs.viewervalue.net](https://docs.viewervalue.net)

## 📞 Support

- **Discord**: [ViewerValue Community](https://discord.gg/viewervalue)
- **Email**: support@viewervalue.net
- **Twitter**: [@ViewerValue](https://twitter.com/ViewerValue)

---

**Built with ❤️ by the ViewerValue Team**

*Transforming attention into value through blockchain technology*
