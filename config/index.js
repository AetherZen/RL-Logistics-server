const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env') });


dotenv.config({ path: path.join(process.cwd(), '.env') });

const envFile = {
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT),
  data_base_url: process.env.MONGO_URI
};


if (!envFile.data_base_url) {
  console.error('MONGO_URI is not defined in the .env file.');
  process.exit(1);
};


// ***********export default****************
module.exports = envFile