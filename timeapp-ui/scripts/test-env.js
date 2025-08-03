#!/usr/bin/env node

// Test script to verify environment variables are loaded correctly
console.log('Testing environment variables...');

const requiredVars = [
    'VITE_BACKEND_API_URL',
    'VITE_VPUBLIC_KEY'
];

const missingVars = [];

for (const varName of requiredVars) {
    if (!process.env[varName]) {
        missingVars.push(varName);
        console.log(`❌ Missing: ${varName}`);
    } else {
        console.log(`✅ Found: ${varName} = ${process.env[varName].substring(0, 20)}...`);
    }
}

if (missingVars.length > 0) {
    console.error(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
    process.exit(1);
} else {
    console.log('\n✅ All required environment variables are present!');
} 