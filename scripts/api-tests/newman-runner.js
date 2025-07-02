#!/usr/bin/env node

const newman = require("newman")
const path = require("path")
const fs = require("fs")

// Configuration
const config = {
  collection: path.join(__dirname, "../../docs/postman/microservice-platform.postman_collection.json"),
  environment: path.join(__dirname, "../../docs/postman/microservice-platform.postman_environment.json"),
  reporters: ["cli", "html", "json"],
  reporterHtmlExport: path.join(__dirname, "../../test-results/api-test-report.html"),
  reporterJsonExport: path.join(__dirname, "../../test-results/api-test-results.json"),
  insecure: true,
  timeout: 30000,
  delayRequest: 1000,
}

// Ensure test results directory exists
const testResultsDir = path.dirname(config.reporterHtmlExport)
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true })
}

console.log("🚀 Starting API Tests...")
console.log(`Collection: ${config.collection}`)
console.log(`Environment: ${config.environment}`)

newman.run(config, (err, summary) => {
  if (err) {
    console.error("❌ Newman run failed:", err)
    process.exit(1)
  }

  console.log("\n📊 Test Summary:")
  console.log(`Total Requests: ${summary.run.stats.requests.total}`)
  console.log(`Passed Requests: ${summary.run.stats.requests.total - summary.run.stats.requests.failed}`)
  console.log(`Failed Requests: ${summary.run.stats.requests.failed}`)
  console.log(`Total Assertions: ${summary.run.stats.assertions.total}`)
  console.log(`Passed Assertions: ${summary.run.stats.assertions.total - summary.run.stats.assertions.failed}`)
  console.log(`Failed Assertions: ${summary.run.stats.assertions.failed}`)

  if (summary.run.failures.length > 0) {
    console.log("\n❌ Test Failures:")
    summary.run.failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure.source.name || "Unknown"}`)
      console.log(`   Error: ${failure.error.message}`)
      if (failure.error.test) {
        console.log(`   Test: ${failure.error.test}`)
      }
    })
    process.exit(1)
  }

  console.log("\n✅ All tests passed!")
  console.log(`📄 HTML Report: ${config.reporterHtmlExport}`)
  console.log(`📄 JSON Report: ${config.reporterJsonExport}`)
})
