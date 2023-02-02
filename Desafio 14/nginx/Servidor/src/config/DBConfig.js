import { envConfig } from "./envConfig.js"

export const options = {
    fileSystem: {
        path: envConfig.DB_FILE_SYSTEM,
    },
    mongo:{
        path: envConfig.DB_MONGO,
    },
    firebase:{
        key: {
            "type": envConfig.DB_F_K_TYPE,
            "project_id": envConfig.DB_F_K_PROJECT_ID,
            "private_key_id": envConfig.DB_F_K_PRIVATE_KEY_ID,
            "private_key": envConfig.DB_F_K_PRIVATE_KEY,
            "client_email": envConfig.DB_F_K_CLIENT_EMAIL,
            "client_id": envConfig.DB_F_K_CLIENT_ID,
            "auth_uri": envConfig.DB_F_K_AUTH_URI,
            "token_uri": envConfig.DB_F_K_TOKEN_URI,
            "auth_provider_x509_cert_url": envConfig.DB_F_K_AUTH_PROVIDER,
            "client_x509_cert_url": envConfig.DB_F_K_CLIENT
        },
        databaseUrl: envConfig.DB_F_URL
    },
    mongoAtlasSessions:{
        url: envConfig.DB_MONGO_ATLAS_URL
    }
}