const isDev = process.env.NODE_ENV === 'development';
export const explorerThePowerUrl = 'https://explorer.thepower.io';
export const walletThePowerUrl = isDev ? 'http://localhost:3001' : 'https://wallet.thepower.io';
export const hubThePowerUrl = 'https://hub.thepower.io';
export const faucetThePowerUrl = 'https://faucet.thepower.io';
