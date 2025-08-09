import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from 'viem'

// Define Hedera networks
export const hederaTestnet = defineChain({
  id: 296,
  name: 'Hedera Testnet',
  network: 'hedera-testnet',
  nativeCurrency: {
    decimals: 8,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.hashio.io/api'],
    },
    public: {
      http: ['https://testnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/testnet',
    },
  },
  testnet: true,
})

export const hederaMainnet = defineChain({
  id: 295,
  name: 'Hedera Mainnet',
  network: 'hedera-mainnet',
  nativeCurrency: {
    decimals: 8,
    name: 'HBAR',
    symbol: 'HBAR',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.hashio.io/api'],
    },
    public: {
      http: ['https://mainnet.hashio.io/api'],
    },
  },
  blockExplorers: {
    default: {
      name: 'HashScan',
      url: 'https://hashscan.io/mainnet',
    },
  },
  testnet: false,
})

// Get projectId from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id'

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
  console.warn('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not found. Using demo project ID. Please get your project ID from https://cloud.reown.com')
}

// Set up the Wagmi Adapter (Config)
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [hederaTestnet, hederaMainnet],
  projectId
})

// Set up metadata
const metadata = {
  name: 'Negravis Oracle Platform',
  description: 'Enterprise-Grade Oracle Infrastructure Built on Hedera',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://negravis.com',
  icons: ['https://via.placeholder.com/192x192/3b82f6/ffffff?text=N']
}

// Initialize AppKit only on client side
let modal: ReturnType<typeof createAppKit> | null = null

export function getAppKit() {
  if (typeof window !== 'undefined' && !modal) {
    modal = createAppKit({
      adapters: [wagmiAdapter],
      networks: [hederaTestnet, hederaMainnet],
      defaultNetwork: hederaTestnet,
      metadata,
      projectId,
      features: {
        analytics: true,
        allWallets: true,
        onramp: false,
        swaps: false,
        email: false,
        socials: [],
      },
      themeMode: 'dark',
      themeVariables: {
        '--w3m-font-family': 'Inter, system-ui, sans-serif',
        '--w3m-border-radius-master': '12px',
        '--w3m-accent': '#3b82f6',
      }
    })
  }
  return modal
}

export { wagmiAdapter }
export const config = wagmiAdapter.wagmiConfig
