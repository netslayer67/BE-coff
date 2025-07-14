import dotenv from 'dotenv';
import { Secret, SignOptions } from 'jsonwebtoken'; // <-- Import 'Secret' and 'SignOptions'

dotenv.config();

const getEnvVariable = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        console.error(`FATAL ERROR: Environment variable ${key} is not defined.`);
        process.exit(1);
    }
    return value;
};

// Define an interface for our JWT configuration
interface IJwtConfig {
    expiresIn: 604800
    secret: Secret; // <-- Use the official 'Secret' type
    options: SignOptions; // <-- Use the official 'SignOptions' type
}

const config = {
  port: process.env.PORT || 5000,
  mongoURI: getEnvVariable('MONGO_URI'),
  
  // This structure now perfectly matches what jwt.sign() expects
  jwt: {
    secret: getEnvVariable('JWT_SECRET'),
    options: {
      expiresIn: getEnvVariable('JWT_EXPIRES_IN'),
    },
  } as IJwtConfig,

  imagekit: {
    publicKey: getEnvVariable('IMAGEKIT_PUBLIC_KEY'),
    privateKey: getEnvVariable('IMAGEKIT_PRIVATE_KEY'),
    urlEndpoint: getEnvVariable('IMAGEKIT_URL_ENDPOINT'),
  },

  midtrans: {
    isProduction: false, // Set 'true' saat di production
    serverKey: getEnvVariable('MIDTRANS_SERVER_KEY'),
    clientKey: getEnvVariable('MIDTRANS_CLIENT_KEY'),
  },
};

export default config;