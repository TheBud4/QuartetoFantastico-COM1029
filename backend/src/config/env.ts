import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
    PORT: number;
    DATABASE_URL: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
}

const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    DATABASE_URL: process.env.DATABASE_URL || '',
    POSTGRES_USER: process.env.POSTGRES_USER || '',
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || '',
    POSTGRES_DB: process.env.POSTGRES_DB || '',
};

const requiredKeys: (keyof EnvConfig)[] = ['DATABASE_URL', 'POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB'];

for (const key of requiredKeys) {
    if (!env[key]) {
        throw new Error(`${key} não está definida nas variáveis de ambiente.`);
    }
}

export default env;