# Negravis Oracle Frontend 🚀

Modern Next.js frontend for the **Negravis Oracle System** - Real-time Oracle data visualization with interactive 3D components and TypeScript.

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black?logo=next.js) ![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)

## 🌟 Features

- **Real-time Oracle Data** - Live price feeds, weather data, and custom queries
- **3D Interactive Components** - Three.js powered data visualizations  
- **Multi-Source Consensus** - Aggregates data from multiple oracle providers
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **TypeScript Integration** - Full type safety throughout the application
- **Modern Next.js 15** - App Router, Server Components, and Turbopack

## 🔗 Backend Integration

This frontend connects to the **Negravis Oracle Backend**:
- **Production**: https://negravis-app.vercel.app
- **Repository**: https://github.com/oguzhaangumuss/Negravis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/oguzhaangumuss/Negravis-Frontend.git
cd Negravis-Frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Environment setup:**
```bash
cp .env.example .env.local
```

4. **Start development server:**
```bash
npm run dev
# or  
yarn dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## ⚙️ Environment Variables

Create `.env.local` file in the root directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://negravis-app.vercel.app

# For local development:
# NEXT_PUBLIC_API_URL=http://localhost:4001
```

## 📡 API Integration

The frontend communicates with the Oracle backend through REST APIs:

```typescript
// Oracle Query
const response = await oracleApi.query("bitcoin price", {
  sources: ["chainlink", "coingecko"],
  method: "median"
});

// Weather Data
const weather = await oracleApi.getWeather("Istanbul");

// System Status
const status = await oracleApi.getSystemStatus();
```

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Static type checking

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Class Variance Authority** - Component variants

### 3D Graphics
- **Three.js** - 3D library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F

### Development
- **ESLint** - Code linting
- **Turbopack** - Fast bundler for development

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dapp/           # DApp interface
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── OracleAssistant.tsx
│   └── features-4.tsx
├── hooks/             # Custom React hooks
│   └── useOracleApi.ts
├── lib/               # Utility functions
│   └── utils.ts
├── services/          # API services
│   └── oracleApi.ts
└── utils/             # Helper utilities
    └── testApi.ts
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your backend URL
3. **Deploy automatically** on every push to main

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint

## 🌐 Oracle Providers

The system integrates with multiple oracle providers:

- **Chainlink** - Decentralized price feeds
- **CoinGecko** - Cryptocurrency market data
- **Weather APIs** - Real-time weather information
- **Web Scraping** - Custom data sources with Brave Search API
- **Custom APIs** - Configurable external data sources

## 📊 Features Showcase

### Oracle Query Interface
```typescript
// Real-time price queries
const btcPrice = await oracleApi.getPrice("BTC");

// Weather data with consensus
const weather = await oracleApi.getWeather("London");

// Custom oracle queries
const result = await oracleApi.query("news about ethereum");
```

### Provider Status Monitoring
- Real-time health checks
- Provider reliability metrics  
- Response time tracking
- Consensus algorithm insights

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- **Backend API**: [Negravis](https://github.com/oguzhaangumuss/Negravis)
- **Oracle Documentation**: Check backend repository for detailed Oracle system docs

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/oguzhaangumuss/Negravis-Frontend/issues)
- **Email**: oguzhan@example.com
- **Backend Issues**: [Negravis Issues](https://github.com/oguzhaangumuss/Negravis/issues)

---

**Built with ❤️ using Next.js, React, and TypeScript**