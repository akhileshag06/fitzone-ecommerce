// FIT ZONE E-Commerce - Comprehensive Test Suite
// This script tests all functionality across User, Admin, and Dealer panels

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let testResults = {
  passed: 0,
  failed: 0,
  errors: []
};

// Test credentials
const testUsers = {
  admin: { email: 'admin@fitzone.com', password: 'admin123' },
  dealer: { email: 'abhi@fitzone.com', password: 'dealer123' },
  user: { email: 'test@user.com', password: 'user123' }
};

let tokens = {};
let testData = {
  productId: null,
  orderId: null,
  dealerId: null
};

// Helper functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m'
  };
  console.log(`${colors[type]}${message}\x1b[0m`);
}

function pass(test) {
  testResults.passed++;
  log(`✅ PASS: ${test}`, 'success');
}

function fail(test, error) {
  testResults.failed++;
  testResults.errors.push({ test, error: error.message || error });
  log(`❌ FAIL: ${test}`, 'error');
  log(`   Error: ${error.message || error}`, 'error');
}

// ============ TEST SUITE ============

async function testAdminLogin() {
  log('\n📋 Testing Admin Login...', 'info');
  try {
    const res = await axios.post(`${API_URL}/admin/login`, testUsers.admin);
    if (res.data.success && res.data.token) {
      tokens.admin = res.data.token;
      pass('Admin login successful');
    } else {
      fail('Admin login', 'No token received');
    }
  } catch (error) {
    fail('Admin login', error.response?.data?.message || error.message);
  }
}

async function testDealerLogin() {
  log('\n📋 Testing Dealer Login...', 'info');
  try {
    const res = await axios.post(`${API_URL}/dealer/login`, testUsers.dealer);
    if (res.data.success && res.data.token) {
      tokens.dealer = res.data.token;
      testData.dealerId = res.data.user._id;
      pass('Dealer login successful');
    } else {
      fail('Dealer login', 'No token received');
    }
  } catch (error) {
    fail('Dealer login', error.response?.data?.message || error.message);
  }
}

async function testUserRegistration() {
  log('\n📋 Testing User Registration...', 'info');
  try {
    const userData = {
      name: 'Test User',
      email: testUsers.user.email,
      password: testUsers.user.password,
      phoneNumber: '9876543210'
    };
    const res = await axios.post(`${API_URL}/users/register`, userData);
    if (res.data.success) {
      pass('User registration successful');
    } else {
      fail('User registration', 'Registration failed');
    }
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      pass('User registration (user already exists)');
    } else {
      fail('User registration', error.response?.data?.message || error.message);
    }
  }
}

async function testUserLogin() {
  log('\n📋 Testing User Login...', 'info');
  try {
    const res = await axios.post(`${API_URL}/users/login`, testUsers.user);
    if (res.data.success && res.data.token) {
      tokens.user = res.data.token;
      pass('User login successful');
    } else {
      fail('User login', 'No token received');
    }
  } catch (error) {
    fail('User login', error.response?.data?.message || error.message);
  }
}

async function testAdminStats() {
  log('\n📋 Testing Admin Stats...', 'info');
  try {
    const res = await axios.get(`${API_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    if (res.data.success && res.data.stats) {
      pass('Admin stats fetched successfully');
    } else {
      fail('Admin stats', 'No stats data');
    }
  } catch (error) {
    fail('Admin stats', error.response?.data?.message || error.message);
  }
}

async function testFetchProducts() {
  log('\n📋 Testing Fetch Products...', 'info');
  try {
    const res = await axios.get(`${API_URL}/products`);
    if (res.data.success && Array.isArray(res.data.products)) {
      if (res.data.products.length > 0) {
        testData.productId = res.data.products[0]._id;
        pass(`Fetch products successful (${res.data.products.length} products)`);
      } else {
        fail('Fetch products', 'No products found');
      }
    } else {
      fail('Fetch products', 'Invalid response');
    }
  } catch (error) {
    fail('Fetch products', error.response?.data?.message || error.message);
  }
}

async function testDealerAddProduct() {
  log('\n📋 Testing Dealer Add Product...', 'info');
  try {
    const productData = {
      name: 'Test Protein Powder',
      description: 'High quality whey protein for muscle building',
      price: 2999,
      originalPrice: 3999,
      category: 'protein',
      image: 'http://localhost:5000/images/whey-protein.png',
      rating: 4.5,
      reviews: 100,
      stock: 50
    };
    const res = await axios.post(`${API_URL}/dealer/products`, productData, {
      headers: { Authorization: `Bearer ${tokens.dealer}` }
    });
    if (res.data.success) {
      pass('Dealer add product successful');
    } else {
      fail('Dealer add product', 'Product creation failed');
    }
  } catch (error) {
    fail('Dealer add product', error.response?.data?.message || error.message);
  }
}

async function testAdminGetPendingProducts() {
  log('\n📋 Testing Admin Get Pending Products...', 'info');
  try {
    const res = await axios.get(`${API_URL}/admin/products/pending`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    if (res.data.success && Array.isArray(res.data.products)) {
      pass(`Admin get pending products (${res.data.products.length} pending)`);
      return res.data.products;
    } else {
      fail('Admin get pending products', 'Invalid response');
      return [];
    }
  } catch (error) {
    fail('Admin get pending products', error.response?.data?.message || error.message);
    return [];
  }
}

async function testAdminApproveProduct(productId) {
  log('\n📋 Testing Admin Approve Product...', 'info');
  try {
    const res = await axios.put(`${API_URL}/admin/products/${productId}/approve`, {}, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    if (res.data.success) {
      pass('Admin approve product successful');
    } else {
      fail('Admin approve product', 'Approval failed');
    }
  } catch (error) {
    fail('Admin approve product', error.response?.data?.message || error.message);
  }
}

async function testAddToCart() {
  log('\n📋 Testing Add to Cart...', 'info');
  try {
    const res = await axios.post(`${API_URL}/cart/add`, {
      productId: testData.productId,
      quantity: 2
    }, {
      headers: { Authorization: `Bearer ${tokens.user}` }
    });
    if (res.data.success) {
      pass('Add to cart successful');
    } else {
      fail('Add to cart', 'Failed to add to cart');
    }
  } catch (error) {
    fail('Add to cart', error.response?.data?.message || error.message);
  }
}

async function testGetCart() {
  log('\n📋 Testing Get Cart...', 'info');
  try {
    const res = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${tokens.user}` }
    });
    if (res.data.success && res.data.cart) {
      pass(`Get cart successful (${res.data.cart.items.length} items)`);
    } else {
      fail('Get cart', 'Invalid cart data');
    }
  } catch (error) {
    fail('Get cart', error.response?.data?.message || error.message);
  }
}

async function testCreateOrder() {
  log('\n📋 Testing Create Order...', 'info');
  try {
    const orderData = {
      shippingAddress: {
        fullName: 'Test User',
        address: '123 Test Street',
        city: 'Mumbai',
        zipCode: '400001',
        phone: '9876543210'
      },
      paymentMethod: 'COD'
    };
    const res = await axios.post(`${API_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${tokens.user}` }
    });
    if (res.data.success && res.data.order) {
      testData.orderId = res.data.order._id;
      pass('Create order successful');
    } else {
      fail('Create order', 'Order creation failed');
    }
  } catch (error) {
    fail('Create order', error.response?.data?.message || error.message);
  }
}

async function testGetUserOrders() {
  log('\n📋 Testing Get User Orders...', 'info');
  try {
    const res = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${tokens.user}` }
    });
    if (res.data.success && Array.isArray(res.data.orders)) {
      pass(`Get user orders successful (${res.data.orders.length} orders)`);
    } else {
      fail('Get user orders', 'Invalid response');
    }
  } catch (error) {
    fail('Get user orders', error.response?.data?.message || error.message);
  }
}

async function testDealerGetOrders() {
  log('\n📋 Testing Dealer Get Orders...', 'info');
  try {
    const res = await axios.get(`${API_URL}/dealer/orders`, {
      headers: { Authorization: `Bearer ${tokens.dealer}` }
    });
    if (res.data.success && Array.isArray(res.data.orders)) {
      pass(`Dealer get orders successful (${res.data.orders.length} orders)`);
    } else {
      fail('Dealer get orders', 'Invalid response');
    }
  } catch (error) {
    fail('Dealer get orders', error.response?.data?.message || error.message);
  }
}

async function testDealerStats() {
  log('\n📋 Testing Dealer Stats...', 'info');
  try {
    const res = await axios.get(`${API_URL}/dealer/stats`, {
      headers: { Authorization: `Bearer ${tokens.dealer}` }
    });
    if (res.data.success && res.data.stats) {
      pass('Dealer stats fetched successfully');
    } else {
      fail('Dealer stats', 'No stats data');
    }
  } catch (error) {
    fail('Dealer stats', error.response?.data?.message || error.message);
  }
}

async function testAdminGetAllOrders() {
  log('\n📋 Testing Admin Get All Orders...', 'info');
  try {
    const res = await axios.get(`${API_URL}/admin/orders`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    if (res.data.success && Array.isArray(res.data.orders)) {
      pass(`Admin get all orders successful (${res.data.orders.length} orders)`);
    } else {
      fail('Admin get all orders', 'Invalid response');
    }
  } catch (error) {
    fail('Admin get all orders', error.response?.data?.message || error.message);
  }
}

async function testAdminUpdateOrderStatus() {
  log('\n📋 Testing Admin Update Order Status...', 'info');
  if (!testData.orderId) {
    log('⚠️  Skipping: No order ID available', 'warning');
    return;
  }
  try {
    const res = await axios.put(`${API_URL}/admin/orders/${testData.orderId}/status`, 
      { status: 'Confirmed' },
      { headers: { Authorization: `Bearer ${tokens.admin}` } }
    );
    if (res.data.success) {
      pass('Admin update order status successful');
    } else {
      fail('Admin update order status', 'Update failed');
    }
  } catch (error) {
    fail('Admin update order status', error.response?.data?.message || error.message);
  }
}

async function testAdminGetPendingDealers() {
  log('\n📋 Testing Admin Get Pending Dealers...', 'info');
  try {
    const res = await axios.get(`${API_URL}/admin/dealers/pending`, {
      headers: { Authorization: `Bearer ${tokens.admin}` }
    });
    if (res.data.success && Array.isArray(res.data.dealers)) {
      pass(`Admin get pending dealers (${res.data.dealers.length} pending)`);
    } else {
      fail('Admin get pending dealers', 'Invalid response');
    }
  } catch (error) {
    fail('Admin get pending dealers', error.response?.data?.message || error.message);
  }
}

async function testDealerGetProducts() {
  log('\n📋 Testing Dealer Get Products...', 'info');
  try {
    const res = await axios.get(`${API_URL}/dealer/products`, {
      headers: { Authorization: `Bearer ${tokens.dealer}` }
    });
    if (res.data.success && Array.isArray(res.data.products)) {
      pass(`Dealer get products successful (${res.data.products.length} products)`);
    } else {
      fail('Dealer get products', 'Invalid response');
    }
  } catch (error) {
    fail('Dealer get products', error.response?.data?.message || error.message);
  }
}

async function testDealerGetCustomers() {
  log('\n📋 Testing Dealer Get Customers...', 'info');
  try {
    const res = await axios.get(`${API_URL}/dealer/customers`, {
      headers: { Authorization: `Bearer ${tokens.dealer}` }
    });
    if (res.data.success && Array.isArray(res.data.customers)) {
      pass(`Dealer get customers successful (${res.data.customers.length} customers)`);
    } else {
      fail('Dealer get customers', 'Invalid response');
    }
  } catch (error) {
    fail('Dealer get customers', error.response?.data?.message || error.message);
  }
}

// ============ RUN ALL TESTS ============

async function runAllTests() {
  log('\n🚀 Starting FIT ZONE Comprehensive Test Suite...', 'info');
  log('='.repeat(60), 'info');

  // Authentication Tests
  await testAdminLogin();
  await testDealerLogin();
  await testUserRegistration();
  await testUserLogin();

  // Admin Tests
  await testAdminStats();
  await testAdminGetPendingDealers();

  // Product Tests
  await testFetchProducts();
  await testDealerAddProduct();
  const pendingProducts = await testAdminGetPendingProducts();
  if (pendingProducts.length > 0) {
    await testAdminApproveProduct(pendingProducts[0]._id);
  }
  await testDealerGetProducts();

  // Cart & Order Tests
  await testAddToCart();
  await testGetCart();
  await testCreateOrder();
  await testGetUserOrders();

  // Dealer Order Tests
  await testDealerGetOrders();
  await testDealerStats();
  await testDealerGetCustomers();

  // Admin Order Tests
  await testAdminGetAllOrders();
  await testAdminUpdateOrderStatus();

  // Print Results
  log('\n' + '='.repeat(60), 'info');
  log('📊 TEST RESULTS', 'info');
  log('='.repeat(60), 'info');
  log(`✅ Passed: ${testResults.passed}`, 'success');
  log(`❌ Failed: ${testResults.failed}`, 'error');
  log(`📈 Total: ${testResults.passed + testResults.failed}`, 'info');
  log(`🎯 Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(2)}%`, 'info');

  if (testResults.errors.length > 0) {
    log('\n❌ FAILED TESTS:', 'error');
    testResults.errors.forEach((err, i) => {
      log(`${i + 1}. ${err.test}`, 'error');
      log(`   ${err.error}`, 'error');
    });
  }

  log('\n✨ Test suite completed!', 'info');
}

// Run tests
runAllTests().catch(error => {
  log(`\n💥 Fatal error: ${error.message}`, 'error');
  process.exit(1);
});
