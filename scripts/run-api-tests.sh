#!/bin/bash

# API Testing Script for Microservice Platform
# This script runs comprehensive API tests using multiple tools

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_RESULTS_DIR="$PROJECT_ROOT/test-results"
POSTMAN_DIR="$PROJECT_ROOT/docs/postman"
LOAD_TEST_DIR="$PROJECT_ROOT/scripts/load-tests"

# Default values
ENVIRONMENT="development"
RUN_LOAD_TESTS=false
RUN_SECURITY_TESTS=false
PARALLEL_USERS=10
TEST_DURATION=60

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -e|--environment)
      ENVIRONMENT="$2"
      shift 2
      ;;
    -l|--load-tests)
      RUN_LOAD_TESTS=true
      shift
      ;;
    -s|--security-tests)
      RUN_SECURITY_TESTS=true
      shift
      ;;
    -u|--users)
      PARALLEL_USERS="$2"
      shift 2
      ;;
    -d|--duration)
      TEST_DURATION="$2"
      shift 2
      ;;
    -h|--help)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  -e, --environment    Environment to test (development|production)"
      echo "  -l, --load-tests     Run load tests"
      echo "  -s, --security-tests Run security tests"
      echo "  -u, --users         Number of parallel users for load tests"
      echo "  -d, --duration      Duration of load tests in seconds"
      echo "  -h, --help          Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Create test results directory
mkdir -p "$TEST_RESULTS_DIR"

echo -e "${BLUE}🚀 Starting API Tests for Microservice Platform${NC}"
echo -e "${BLUE}Environment: $ENVIRONMENT${NC}"
echo -e "${BLUE}Timestamp: $(date)${NC}"
echo ""

# Function to check if service is running
check_service() {
  local url=$1
  local service_name=$2
  
  echo -e "${YELLOW}Checking $service_name...${NC}"
  
  if curl -s --max-time 10 "$url/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ $service_name is running${NC}"
    return 0
  else
    echo -e "${RED}❌ $service_name is not responding${NC}"
    return 1
  fi
}

# Function to run Newman tests
run_newman_tests() {
  echo -e "${BLUE}📋 Running Postman Collection Tests...${NC}"
  
  local collection="$POSTMAN_DIR/microservice-platform.postman_collection.json"
  local environment_file
  
  if [[ "$ENVIRONMENT" == "production" ]]; then
    environment_file="$POSTMAN_DIR/microservice-platform-production.postman_environment.json"
  else
    environment_file="$POSTMAN_DIR/microservice-platform.postman_environment.json"
  fi
  
  if [[ ! -f "$collection" ]]; then
    echo -e "${RED}❌ Postman collection not found: $collection${NC}"
    return 1
  fi
  
  if [[ ! -f "$environment_file" ]]; then
    echo -e "${RED}❌ Environment file not found: $environment_file${NC}"
    return 1
  fi
  
  newman run "$collection" \
    -e "$environment_file" \
    --reporters cli,html,json \
    --reporter-html-export "$TEST_RESULTS_DIR/api-test-report-$(date +%Y%m%d-%H%M%S).html" \
    --reporter-json-export "$TEST_RESULTS_DIR/api-test-results-$(date +%Y%m%d-%H%M%S).json" \
    --timeout 30000 \
    --delay-request 1000 \
    --insecure
  
  local newman_exit_code=$?
  
  if [[ $newman_exit_code -eq 0 ]]; then
    echo -e "${GREEN}✅ Newman tests passed${NC}"
  else
    echo -e "${RED}❌ Newman tests failed${NC}"
    return 1
  fi
}

# Function to run load tests
run_load_tests() {
  echo -e "${BLUE}⚡ Running Load Tests...${NC}"
  
  if ! command -v artillery &> /dev/null; then
    echo -e "${YELLOW}Installing Artillery...${NC}"
    npm install -g artillery
  fi
  
  local config_file="$LOAD_TEST_DIR/artillery-config.yml"
  
  if [[ ! -f "$config_file" ]]; then
    echo -e "${RED}❌ Artillery config not found: $config_file${NC}"
    return 1
  fi
  
  # Update config for current environment
  local target_url
  if [[ "$ENVIRONMENT" == "production" ]]; then
    target_url="https://your-domain.com"
  else
    target_url="http://localhost:3000"
  fi
  
  # Run artillery test
  artillery run "$config_file" \
    --target "$target_url" \
    --output "$TEST_RESULTS_DIR/load-test-results-$(date +%Y%m%d-%H%M%S).json"
  
  local artillery_exit_code=$?
  
  if [[ $artillery_exit_code -eq 0 ]]; then
    echo -e "${GREEN}✅ Load tests completed${NC}"
  else
    echo -e "${RED}❌ Load tests failed${NC}"
    return 1
  fi
}

# Function to run security tests
run_security_tests() {
  echo -e "${BLUE}🔒 Running Security Tests...${NC}"
  
  # Test for common security vulnerabilities
  local base_url
  if [[ "$ENVIRONMENT" == "production" ]]; then
    base_url="https://your-domain.com/api"
  else
    base_url="http://localhost:3000/api"
  fi
  
  echo -e "${YELLOW}Testing SQL Injection...${NC}"
  curl -s -X POST "$base_url/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com'\''OR 1=1--","password":"anything"}' \
    | grep -q "Invalid credentials" && echo -e "${GREEN}✅ SQL Injection protection working${NC}" || echo -e "${RED}❌ SQL Injection vulnerability detected${NC}"
  
  echo -e "${YELLOW}Testing XSS Protection...${NC}"
  curl -s -X POST "$base_url/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"name":"<script>alert(\"xss\")</script>","email":"test@example.com","password":"password123","phone":"+1234567890"}' \
    | grep -q "script" && echo -e "${RED}❌ XSS vulnerability detected${NC}" || echo -e "${GREEN}✅ XSS protection working${NC}"
  
  echo -e "${YELLOW}Testing Rate Limiting...${NC}"
  for i in {1..20}; do
    curl -s -X POST "$base_url/auth/login" \
      -H "Content-Type: application/json" \
      -d '{"email":"test@example.com","password":"wrongpassword"}' > /dev/null
  done
  
  # Check if rate limiting kicks in
  response=$(curl -s -w "%{http_code}" -X POST "$base_url/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpassword"}')
  
  if [[ "$response" == *"429"* ]]; then
    echo -e "${GREEN}✅ Rate limiting working${NC}"
  else
    echo -e "${YELLOW}⚠️  Rate limiting may not be configured${NC}"
  fi
}

# Function to generate test report
generate_report() {
  echo -e "${BLUE}📊 Generating Test Report...${NC}"
  
  local report_file="$TEST_RESULTS_DIR/test-summary-$(date +%Y%m%d-%H%M%S).md"
  
  cat > "$report_file" << EOF
# API Test Report

**Date:** $(date)
**Environment:** $ENVIRONMENT
**Test Duration:** $(date -d@$SECONDS -u +%H:%M:%S)

## Test Results Summary

### Functional Tests
- **Status:** $([ -f "$TEST_RESULTS_DIR"/api-test-results-*.json ] && echo "✅ PASSED" || echo "❌ FAILED")
- **Total Requests:** $([ -f "$TEST_RESULTS_DIR"/api-test-results-*.json ] && jq '.run.stats.requests.total' "$TEST_RESULTS_DIR"/api-test-results-*.json 2>/dev/null || echo "N/A")
- **Failed Requests:** $([ -f "$TEST_RESULTS_DIR"/api-test-results-*.json ] && jq '.run.stats.requests.failed' "$TEST_RESULTS_DIR"/api-test-results-*.json 2>/dev/null || echo "N/A")

### Load Tests
- **Status:** $([ "$RUN_LOAD_TESTS" = true ] && echo "✅ COMPLETED" || echo "⏭️ SKIPPED")
- **Concurrent Users:** $PARALLEL_USERS
- **Test Duration:** ${TEST_DURATION}s

### Security Tests
- **Status:** $([ "$RUN_SECURITY_TESTS" = true ] && echo "✅ COMPLETED" || echo "⏭️ SKIPPED")

## Files Generated
$(ls -la "$TEST_RESULTS_DIR"/ | grep "$(date +%Y%m%d)" | awk '{print "- " $9}')

## Recommendations
- Review failed test cases in the HTML report
- Monitor response times and error rates
- Implement additional security measures if vulnerabilities found
- Set up continuous monitoring for production environment

EOF

  echo -e "${GREEN}📄 Test report generated: $report_file${NC}"
}

# Main execution
main() {
  local start_time=$(date +%s)
  local overall_status=0
  
  # Check if service is running
  local base_url
  if [[ "$ENVIRONMENT" == "production" ]]; then
    base_url="https://your-domain.com/api"
  else
    base_url="http://localhost:3000/api"
  fi
  
  if ! check_service "$base_url" "Microservice Platform"; then
    echo -e "${RED}❌ Service is not running. Please start the service first.${NC}"
    exit 1
  fi
  
  # Run functional tests
  if ! run_newman_tests; then
    overall_status=1
  fi
  
  # Run load tests if requested
  if [[ "$RUN_LOAD_TESTS" = true ]]; then
    if ! run_load_tests; then
      overall_status=1
    fi
  fi
  
  # Run security tests if requested
  if [[ "$RUN_SECURITY_TESTS" = true ]]; then
    run_security_tests
  fi
  
  # Generate report
  generate_report
  
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  
  echo ""
  echo -e "${BLUE}📊 Test Execution Summary${NC}"
  echo -e "${BLUE}Total Duration: $(date -d@$duration -u +%H:%M:%S)${NC}"
  echo -e "${BLUE}Results Directory: $TEST_RESULTS_DIR${NC}"
  
  if [[ $overall_status -eq 0 ]]; then
    echo -e "${GREEN}✅ All tests completed successfully!${NC}"
  else
    echo -e "${RED}❌ Some tests failed. Check the reports for details.${NC}"
  fi
  
  exit $overall_status
}

# Run main function
main "$@"
