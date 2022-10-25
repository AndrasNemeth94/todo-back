const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

function createJSON() {
    const cred = {
        "type": process.env.SA_TYPE,
        "project_id": process.env.SA_PROJECT_ID,
        "private_key_id": process.env.SA_PRIVATE_KEY_ID,
        "private_key": process.env.SA_PRIVATE_KEY.replace(/\\n/g, '\n'),
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT_URL,
        "client_x509_cert_url": process.env.AUTH_CLIENT_CERT_URL
    }
    const conv = JSON.stringify(cred);
    console.log('WriteCred::createJSON() cred: ', conv);
    fs.writeFileSync('./google-cloud-key-gen.json', conv,'utf-8');
}
createJSON();
