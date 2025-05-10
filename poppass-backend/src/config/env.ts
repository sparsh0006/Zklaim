import dotenv from 'dotenv';
dotenv.config();

const getEnvVariable = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const config = {
  port: parseInt(process.env.PORT || '5001', 10),
  mongoUri: getEnvVariable('MONGO_URI'),
  heliusRpcUrl: getEnvVariable('HELIUS_RPC_URL'),
  backendWalletSecretKey: JSON.parse(getEnvVariable('BACKEND_WALLET_SECRET_KEY')) as number[],
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  serpApiKey: process.env.SERP_API_KEY || '',
};

if (config.backendWalletSecretKey.length !== 64) {
    throw new Error('BACKEND_WALLET_SECRET_KEY must be a byte array of length 64.');
}