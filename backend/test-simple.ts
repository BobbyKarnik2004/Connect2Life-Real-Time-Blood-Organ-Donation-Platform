console.log('Test script is running!');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Test ES modules
const test = async () => {
  console.log('Async/await works!');
  return 'Success';
};

test().then(console.log).catch(console.error);
