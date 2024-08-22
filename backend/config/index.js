const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file located in the parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const env = process.env.NODE_ENV || 'development';  // Default to 'development'

let config;
try {
    config = require(`./${env}.json`);
} catch (err) {
    console.error(`Failed to load configuration for environment: ${env}`);
    console.error(err);
    process.exit(1);
}

module.exports = config;