# 🧪 API Testing Documentation

This comprehensive guide covers testing all API endpoints in the Microservice Platform using **Postman**, **curl**, and automated testing scripts.

## 📋 Table of Contents

- [Overview](#-overview)
- [Postman Collection Setup](#-postman-collection-setup)
- [Environment Configuration](#-environment-configuration)
- [Authentication Testing](#-authentication-testing)
- [Order Management Testing](#-order-management-testing)
- [Payment Processing Testing](#-payment-processing-testing)
- [File Management Testing](#-file-management-testing)
- [Chat System Testing](#-chat-system-testing)
- [Admin Dashboard Testing](#-admin-dashboard-testing)
- [Health Check Testing](#-health-check-testing)
- [Automated Testing Scripts](#-automated-testing-scripts)
- [Load Testing](#-load-testing)
- [Error Scenarios](#-error-scenarios)
- [Best Practices](#-best-practices)

## 🎯 Overview

The Microservice Platform provides RESTful APIs for:
- **Authentication & Authorization**
- **Order Management**
- **Payment Processing**
- **File Management**
- **Real-time Chat**
- **Admin Operations**
- **Health Monitoring**

### **Base URLs**
- **Development**: \`http://localhost:3000/api\`
- **Production**: \`https://your-domain.com/api\`

### **Authentication**
All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## 📦 Postman Collection Setup

### **1. Import Collection**

Download and import the Postman collection:

\`\`\`bash
# Download the collection file
curl -o microservice-platform.postman_collection.json \
  https://raw.githubusercontent.com/your-repo/microservice-platform/main/docs/postman/microservice-platform.postman_collection.json
\`\`\`

### **2. Import Environment**

Import the environment variables:

\`\`\`bash
# Download environment file
curl -o microservice-platform.postman_environment.json \
  https://raw.githubusercontent.com/your-repo/microservice-platform/main/docs/postman/microservice-platform.postman_environment.json
\`\`\`

### **3. Collection Structure**

\`\`\`
📁 Microservice Platform API
├── 📁 Authentication
│   ├── Register User
│   ├── Verify OTP
│   ├── Login User
│   ├── Verify Token
│   └── Refresh Token
├── 📁 Order Management
│   ├── Get Orders
│   ├── Create Order
│   ├── Get Order by ID
│   ├── Update Order Status
│   └── Cancel Order
├── 📁 Payment Processing
│   ├── Get Payments
│   ├── Process Payment
│   ├── Get Payment Methods
│   ├── Add Payment Method
│   └── Refund Payment
├── 📁 File Management
│   ├── Get Files
│   ├── Upload File
│   ├── Download File
│   ├── Delete File
│   └── Share File
├── 📁 Chat System
│   ├── Get Chat Rooms
│   ├── Create Chat Room
│   ├── Get Messages
│   ├── Send Message
│   └── Start Call
├── 📁 Admin Dashboard
│   ├── Get Dashboard Stats
│   ├── Get Service Health
│   ├── Get System Metrics
│   └── Get API Metrics
└── 📁 Health Checks
    ├── Database Health
    ├── Service Health
    └── System Health
\`\`\`

## 🌍 Environment Configuration

### **Environment Variables**

Set up these variables in Postman:

| Variable | Development Value | Production Value | Description |
|----------|------------------|------------------|-------------|
| \`baseUrl\` | \`http://localhost:3000/api\` | \`https://your-domain.com/api\` | API base URL |
| \`authToken\` | \`{{jwt_token}}\` | \`{{jwt_token}}\` | JWT authentication token |
| \`userId\` | \`1\` | \`{{user_id}}\` | Current user ID |
| \`adminToken\` | \`{{admin_jwt_token}}\` | \`{{admin_jwt_token}}\` | Admin JWT token |
| \`testEmail\` | \`test@example.com\` | \`test@yourdomain.com\` | Test user email |
| \`testPhone\` | \`+1234567890\` | \`+1234567890\` | Test phone number |

### **Pre-request Scripts**

Add this script to automatically set auth tokens:

\`\`\`javascript
// Pre-request script for authenticated endpoints
if (pm.request.headers.has('Authorization')) {
    const token = pm.environment.get('authToken');
    if (token) {
        pm.request.headers.upsert({
            key: 'Authorization',
            value: 'Bearer ' + token
        });
    }
}
\`\`\`

### **Test Scripts**

Add this script to automatically save tokens:

\`\`\`javascript
// Test script for login endpoints
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    if (responseJson.token) {
        pm.environment.set('authToken', responseJson.token);
    }
    if (responseJson.user) {
        pm.environment.set('userId', responseJson.user.id);
        pm.environment.set('userRole', responseJson.user.role);
    }
}
\`\`\`

## 🔐 Authentication Testing

### **1. User Registration**

\`\`\`http
POST {{baseUrl}}/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "{{testEmail}}",
    "password": "password123",
    "phone": "{{testPhone}}"
}
\`\`\`

**Expected Response (200)**:
\`\`\`json
{
    "message": "Registration successful. OTP sent to phone.",
    "tempUserId": "temp_1234567890"
}
\`\`\`

**Test Script**:
\`\`\`javascript
pm.test("Registration successful", function () {
    pm.response.to.have.status(200);
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('tempUserId');
    pm.environment.set('tempUserId', responseJson.tempUserId);
});
\`\`\`

### **2. OTP Verification**

\`\`\`http
POST {{baseUrl}}/auth/verify-otp
Content-Type: application/json

{
    "phone": "{{testPhone}}",
    "otp": "123456",
    "tempUserId": "{{tempUserId}}"
}
\`\`\`

**Expected Response (200)**:
\`\`\`json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "1",
        "email": "test@example.com",
        "name": "John Doe",
        "role": "user"
    }
}
\`\`\`

### **3. User Login**

\`\`\`http
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
    "email": "{{testEmail}}",
    "password": "password123"
}
\`\`\`

**Test Script**:
\`\`\`javascript
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('token');
    pm.expect(responseJson).to.have.property('user');
    pm.environment.set('authToken', responseJson.token);
    pm.environment.set('userId', responseJson.user.id);
});
\`\`\`

### **4. Token Verification**

\`\`\`http
GET {{baseUrl}}/auth/verify
Authorization: Bearer {{authToken}}
\`\`\`

**Expected Response (200)**:
\`\`\`json
{
    "user": {
        "id": "1",
        "email": "test@example.com",
        "name": "John Doe",
        "role": "user"
    }
}
\`\`\`

## 📦 Order Management Testing

### **1. Get Orders**

\`\`\`http
GET {{baseUrl}}/orders
Authorization: Bearer {{authToken}}
\`\`\`

**Expected Response (200)**:
\`\`\`json
{
    "orders": [
        {
            "id": "1",
            "customer_name": "John Doe",
            "customer_email": "test@example.com",
            "items": [
                {
                    "name": "Product A",
                    "quantity": 2,
                    "price": 29.99
                }
            ],
            "total": 59.98,
            "status": "pending",
            "shipping_address": "123 Main St, City, State",
            "created_at": "2024-01-01T00:00:00Z"
        }
    ]
}
\`\`\`

### **2. Create Order**

\`\`\`http
POST {{baseUrl}}/orders
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "customerName": "John Doe",
    "customerEmail": "{{testEmail}}",
    "items": [
        {
            "name": "Test Product",
            "quantity": 1,
            "price": 99.99
        }
    ],
    "total": 99.99,
    "shippingAddress": "123 Test Street, Test City, TS 12345"
}
\`\`\`

**Test Script**:
\`\`\`javascript
pm.test("Order created successfully", function () {
    pm.response.to.have.status(201);
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('order');
    pm.expect(responseJson.order).to.have.property('id');
    pm.environment.set('orderId', responseJson.order.id);
});
\`\`\`

### **3. Update Order Status** (Admin only)

\`\`\`http
PATCH {{baseUrl}}/orders/{{orderId}}/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
    "status": "shipped"
}
\`\`\`

## 💳 Payment Processing Testing

### **1. Get Payments**

\`\`\`http
GET {{baseUrl}}/payments
Authorization: Bearer {{authToken}}
\`\`\`

### **2. Process Payment**

\`\`\`http
POST {{baseUrl}}/payments/process
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "orderId": "{{orderId}}",
    "amount": 99.99,
    "currency": "usd",
    "method": "stripe",
    "customerEmail": "{{testEmail}}"
}
\`\`\`

**Test Script**:
\`\`\`javascript
pm.test("Payment processed", function () {
    pm.response.to.have.status(201);
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('payment');
    pm.expect(responseJson.payment.status).to.be.oneOf(['completed', 'failed']);
    if (responseJson.payment.status === 'completed') {
        pm.environment.set('paymentId', responseJson.payment.id);
    }
});
\`\`\`

### **3. Add Payment Method**

\`\`\`http
POST {{baseUrl}}/payments/methods
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "type": "card",
    "cardNumber": "4242424242424242",
    "expiryMonth": "12",
    "expiryYear": "25",
    "cvc": "123"
}
\`\`\`

## 📁 File Management Testing

### **1. Get Files**

\`\`\`http
GET {{baseUrl}}/files
Authorization: Bearer {{authToken}}
\`\`\`

### **2. Upload File**

\`\`\`http
POST {{baseUrl}}/files/upload
Authorization: Bearer {{authToken}}
Content-Type: multipart/form-data

# In Postman, use the form-data body type and add:
# Key: file, Type: File, Value: [select a test file]
\`\`\`

**Test Script**:
\`\`\`javascript
pm.test("File uploaded successfully", function () {
    pm.response.to.have.status(201);
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('file');
    pm.environment.set('fileId', responseJson.file.id);
});
\`\`\`

### **3. Download File**

\`\`\`http
GET {{baseUrl}}/files/{{fileId}}/download
Authorization: Bearer {{authToken}}
\`\`\`

### **4. Delete File**

\`\`\`http
DELETE {{baseUrl}}/files/{{fileId}}
Authorization: Bearer {{authToken}}
\`\`\`

## 💬 Chat System Testing

### **1. Get Chat Rooms**

\`\`\`http
GET {{baseUrl}}/chat/rooms
Authorization: Bearer {{authToken}}
\`\`\`

### **2. Create Chat Room**

\`\`\`http
POST {{baseUrl}}/chat/rooms
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "name": "Test Chat Room",
    "type": "group",
    "participants": ["test@example.com", "admin@example.com"]
}
\`\`\`

### **3. Send Message**

\`\`\`http
POST {{baseUrl}}/chat/rooms/{{roomId}}/messages
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "content": "Hello, this is a test message!"
}
\`\`\`

## 👨‍💼 Admin Dashboard Testing

### **1. Get Dashboard Stats** (Admin only)

\`\`\`http
GET {{baseUrl}}/dashboard/stats
Authorization: Bearer {{adminToken}}
\`\`\`

### **2. Get Service Health** (Admin only)

\`\`\`http
GET {{baseUrl}}/admin/services
Authorization: Bearer {{adminToken}}
\`\`\`

### **3. Get System Metrics** (Admin only)

\`\`\`http
GET {{baseUrl}}/admin/metrics
Authorization: Bearer {{adminToken}}
\`\`\`

## 🏥 Health Check Testing

### **1. Database Health**

\`\`\`http
GET {{baseUrl}}/health/database
\`\`\`

**Expected Response (200)**:
\`\`\`json
{
    "database": {
        "status": "healthy",
        "type": "postgresql"
    },
    "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

### **2. Service Health**

\`\`\`http
GET {{baseUrl}}/health
\`\`\`

## 🤖 Automated Testing Scripts

### **Newman (Postman CLI) Testing**

Install Newman:
\`\`\`bash
npm install -g newman
\`\`\`

Run collection:
\`\`\`bash
# Run entire collection
newman run microservice-platform.postman_collection.json \
  -e microservice-platform.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export test-results.html

# Run specific folder
newman run microservice-platform.postman_collection.json \
  -e microservice-platform.postman_environment.json \
  --folder "Authentication"

# Run with data file
newman run microservice-platform.postman_collection.json \
  -e microservice-platform.postman_environment.json \
  -d test-data.json
\`\`\`

### **Test Data File (test-data.json)**

\`\`\`json
[
    {
        "testEmail": "user1@example.com",
        "testPhone": "+1234567890",
        "testName": "Test User 1"
    },
    {
        "testEmail": "user2@example.com", 
        "testPhone": "+1234567891",
        "testName": "Test User 2"
    }
]
\`\`\`

### **GitHub Actions Integration**

\`\`\`yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: microservice_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Setup test database
      run: npm run setup-db
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/microservice_test
    
    - name: Start application
      run: npm run dev &
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/microservice_test
    
    - name: Wait for application
      run: sleep 10
    
    - name: Install Newman
      run: npm install -g newman
    
    - name: Run API tests
      run: |
        newman run docs/postman/microservice-platform.postman_collection.json \
          -e docs/postman/microservice-platform.postman_environment.json \
          --reporters cli,junit \
          --reporter-junit-export test-results.xml
    
    - name: Publish test results
      uses: EnricoMi/publish-unit-test-result-action@v2
      if: always()
      with:
        files: test-results.xml
\`\`\`

## 🚀 Load Testing

### **Artillery.js Load Testing**

Install Artillery:
\`\`\`bash
npm install -g artillery
\`\`\`

Create load test configuration:

\`\`\`yaml
# load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 5
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: "Authentication Flow"
    weight: 30
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/auth/verify"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Order Management"
    weight: 40
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "authToken"
      - get:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{ authToken }}"
      - post:
          url: "/api/orders"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            customerName: "Load Test User"
            customerEmail: "loadtest@example.com"
            items:
              - name: "Test Product"
                quantity: 1
                price: 99.99
            total: 99.99
            shippingAddress: "123 Load Test St"

  - name: "Health Checks"
    weight: 30
    flow:
      - get:
          url: "/api/health/database"
      - get:
          url: "/api/health"
\`\`\`

Run load test:
\`\`\`bash
artillery run load-test.yml
\`\`\`

### **K6 Load Testing**

\`\`\`javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
};

const BASE_URL = 'http://localhost:3000/api';

export default function() {
  // Login
  let loginResponse = http.post(\`\${BASE_URL}/auth/login\`, JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => JSON.parse(r.body).token !== undefined,
  });

  if (loginResponse.status === 200) {
    let token = JSON.parse(loginResponse.body).token;
    
    // Get orders
    let ordersResponse = http.get(\`\${BASE_URL}/orders\`, {
      headers: { 'Authorization': \`Bearer \${token}\` },
    });

    check(ordersResponse, {
      'orders status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}
\`\`\`

Run K6 test:
\`\`\`bash
k6 run load-test.js
\`\`\`

## ❌ Error Scenarios Testing

### **1. Authentication Errors**

\`\`\`http
# Invalid credentials
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
    "email": "invalid@example.com",
    "password": "wrongpassword"
}

# Expected: 401 Unauthorized
\`\`\`

\`\`\`http
# Missing token
GET {{baseUrl}}/orders

# Expected: 401 Unauthorized
\`\`\`

\`\`\`http
# Invalid token
GET {{baseUrl}}/orders
Authorization: Bearer invalid_token

# Expected: 401 Unauthorized
\`\`\`

### **2. Validation Errors**

\`\`\`http
# Missing required fields
POST {{baseUrl}}/orders
Authorization: Bearer {{authToken}}
Content-Type: application/json

{
    "customerName": "John Doe"
    # Missing required fields
}

# Expected: 400 Bad Request
\`\`\`

### **3. Permission Errors**

\`\`\`http
# Non-admin trying to access admin endpoint
GET {{baseUrl}}/admin/services
Authorization: Bearer {{authToken}}

# Expected: 403 Forbidden
\`\`\`

### **4. Resource Not Found**

\`\`\`http
# Non-existent order
GET {{baseUrl}}/orders/999999
Authorization: Bearer {{authToken}}

# Expected: 404 Not Found
\`\`\`

### **5. Rate Limiting**

\`\`\`javascript
// Test script to trigger rate limiting
for (let i = 0; i < 100; i++) {
    pm.sendRequest({
        url: pm.environment.get('baseUrl') + '/auth/login',
        method: 'POST',
        header: {
            'Content-Type': 'application/json'
        },
        body: {
            mode: 'raw',
            raw: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        }
    });
}

# Expected: 429 Too Many Requests (after rate limit exceeded)
\`\`\`

## 📊 Best Practices

### **1. Test Organization**

- **Group related tests** in folders
- **Use descriptive names** for requests
- **Add documentation** for each endpoint
- **Include example responses**

### **2. Environment Management**

- **Separate environments** for dev/staging/prod
- **Use variables** for dynamic values
- **Store sensitive data** securely
- **Version control** collection files

### **3. Test Scripts**

- **Validate response status** codes
- **Check response structure** and data types
- **Assert business logic** requirements
- **Handle error scenarios**

### **4. Data Management**

- **Use test data files** for multiple scenarios
- **Clean up test data** after tests
- **Avoid hardcoded values**
- **Use realistic test data**

### **5. Continuous Integration**

- **Automate test execution** in CI/CD
- **Generate test reports**
- **Set up notifications** for failures
- **Monitor test performance**

### **6. Documentation**

- **Keep tests updated** with API changes
- **Document test scenarios**
- **Include setup instructions**
- **Provide troubleshooting guides**

## 🔍 Monitoring & Reporting

### **Test Results Dashboard**

Create a simple dashboard to monitor test results:

\`\`\`javascript
// Generate test report
const testResults = {
    totalTests: pm.info.iteration.count,
    passedTests: pm.test.passed,
    failedTests: pm.test.failed,
    timestamp: new Date().toISOString(),
    environment: pm.environment.name
};

console.log('Test Results:', JSON.stringify(testResults, null, 2));
\`\`\`

### **Slack Integration**

Send test results to Slack:

\`\`\`javascript
// Post-request script for critical tests
if (pm.test.failed > 0) {
    const slackWebhook = pm.environment.get('slackWebhook');
    if (slackWebhook) {
        pm.sendRequest({
            url: slackWebhook,
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: {
                mode: 'raw',
                raw: JSON.stringify({
                    text: \`🚨 API Test Failed: \${pm.info.requestName}\`,
                    attachments: [{
                        color: 'danger',
                        fields: [{
                            title: 'Environment',
                            value: pm.environment.name,
                            short: true
                        }, {
                            title: 'Failed Tests',
                            value: pm.test.failed.toString(),
                            short: true
                        }]
                    }]
                })
            }
        });
    }
}
\`\`\`

---

This comprehensive API testing documentation provides everything needed to thoroughly test the Microservice Platform APIs using Postman and automated testing tools. The collection includes all endpoints, error scenarios, load testing, and CI/CD integration examples.
\`\`\`

Now let's create the actual Postman collection file:
