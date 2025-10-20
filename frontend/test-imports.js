// Test PayHere utility imports
console.log('Testing PayHere utility imports...');

try {
    // Test if we can import the functions
    const { payHereConfig, submitPayHerePayment, waitForPayHere, loadPayHereScript } = require('./src/utils/payhere.util.js');
    
    console.log('✅ All imports successful!');
    console.log('payHereConfig:', typeof payHereConfig);
    console.log('submitPayHerePayment:', typeof submitPayHerePayment);
    console.log('waitForPayHere:', typeof waitForPayHere);
    console.log('loadPayHereScript:', typeof loadPayHereScript);
    
} catch (error) {
    console.error('❌ Import error:', error.message);
}
