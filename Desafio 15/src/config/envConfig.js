import * as dotenv from "dotenv";
dotenv.config();

export const envConfig={
    MODO: process.env.MODO || "dev",
    IDIOMA: process.env.IDIOMA || "english",
    DB_FILE_SYSTEM: process.env.DB_FILE_SYSTEM,
    DB_MONGO: process.env.DB_MONGO,
    DB_F_K_TYPE: process.env.DB_F_K_TYPE,
    DB_F_K_PROJECT_ID: process.env.DB_F_K_PROJECT_ID,
    DB_F_K_PRIVATE_KEY_ID: process.env.DB_F_K_PRIVATE_KEY_ID,
    DB_F_K_PRIVATE_KEY: process.env.DB_F_K_PRIVATE_KEY,
    DB_F_K_CLIENT_EMAIL: process.env.DB_F_K_CLIENT_EMAIL,
    DB_F_K_CLIENT_ID: process.env.DB_F_K_CLIENT_ID,
    DB_F_K_AUTH_URI: process.env.DB_F_K_AUTH_URI,
    DB_F_K_TOKEN_URI: process.env.DB_F_K_TOKEN_URI,
    DB_F_K_AUTH_PROVIDER: process.env.DB_F_K_AUTH_PROVIDER,
    DB_F_K_CLIENT: process.env.DB_F_K_CLIENT,
    DB_F_URL: process.env.DB_F_URL,
    DB_MONGO_ATLAS_URL: process.env.DB_MONGO_ATLAS_URL,
    S_MONGO_URL: process.env.S_MONGO_URL,
    S_SESSION_SECRET: process.env.S_SESSION_SECRET,
    E_BCRYPT_SALT: process.env.E_BCRYPT_SALT,
};