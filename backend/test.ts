console.log('Test script is running!');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

try {
  const config = require('./config');
  console.log('Config loaded successfully:', Object.keys(config));
} catch (error) {
  console.error('Error loading config:', error.message);
}
