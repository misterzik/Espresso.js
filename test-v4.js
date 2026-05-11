/**
 * EspressoJS v4.0.0 - Quick Test Script
 * 
 * Tests all new v4.0.0 features locally
 * Run: node test-v4.js
 */

console.log('🧪 Testing Espresso.js v4.0.0...\n');

// Test 1: Load main module
console.log('1️⃣ Testing main module...');
try {
  const app = require('./index');
  console.log('   ✅ Main module loaded');
} catch (error) {
  console.log('   ❌ Error:', error.message);
  process.exit(1);
}

// Test 2: Check exports
console.log('\n2️⃣ Testing exports...');
try {
  const { apiManager, ssrManager, apiEnhancer, config } = require('./index');
  console.log('   ✅ apiManager:', apiManager ? 'Available' : 'Not available');
  console.log('   ✅ ssrManager:', ssrManager ? 'Available' : 'Not available');
  console.log('   ✅ apiEnhancer:', apiEnhancer ? 'Available' : 'Not available');
  console.log('   ✅ config:', config ? 'Loaded' : 'Not loaded');
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 3: Check middleware
console.log('\n3️⃣ Testing middleware...');
try {
  const { helmetConfig, sanitizeData, hppProtection } = require('./server/middleware/security');
  console.log('   ✅ Security middleware loaded');
  
  const { SSRManager } = require('./server/middleware/ssr');
  console.log('   ✅ SSR middleware loaded');
  
  const { APIEnhancer } = require('./server/middleware/apiEnhancer');
  console.log('   ✅ API enhancer loaded');
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 4: Check configuration
console.log('\n4️⃣ Testing configuration...');
try {
  const { readConfigFile } = require('./server/utils/config.utils');
  const config = readConfigFile();
  console.log('   ✅ Config loaded');
  console.log('   📍 Port:', config.port);
  console.log('   🌍 Environment:', config.instance);
  console.log('   🎨 SSR:', config.features?.ssr?.enabled ? 'Enabled' : 'Disabled');
  console.log('   📚 API Docs:', config.features?.apiEnhancer?.documentation ? 'Enabled' : 'Disabled');
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 5: Check package.json
console.log('\n5️⃣ Testing package.json...');
try {
  const pkg = require('./package.json');
  console.log('   ✅ Version:', pkg.version);
  console.log('   ✅ Node requirement:', pkg.engines.node);
  console.log('   ✅ Dependencies:', Object.keys(pkg.dependencies).length);
} catch (error) {
  console.log('   ❌ Error:', error.message);
}

// Test 6: Check new dependencies
console.log('\n6️⃣ Testing new v4.0.0 dependencies...');
const newDeps = ['ejs', 'handlebars', 'pug', 'express-mongo-sanitize', 'hpp', 'swagger-jsdoc', 'swagger-ui-express'];
newDeps.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`   ✅ ${dep}: Installed`);
  } catch (error) {
    console.log(`   ⚠️  ${dep}: Not installed (run npm install)`);
  }
});

console.log('\n✨ Test complete!\n');
console.log('🚀 To start the server:');
console.log('   npm start');
console.log('   OR');
console.log('   node demo/test-local.js');
console.log('\n📚 To view API docs:');
console.log('   http://localhost:8080/api/docs\n');
