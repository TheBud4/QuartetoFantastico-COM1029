import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    NODE_ENV: 'development' | 'production' | 'test';
    // Adicione outras variáveis conforme necessário no seu .env
}

const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    NODE_ENV: (process.env.NODE_ENV as EnvConfig['NODE_ENV']) || 'development',
    // Adicione outras variáveis aqui
};

// Validação básica
if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required');
}

if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
}

export default env;