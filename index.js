/**
 * InstantIEP Demo Runner
 * 
 * This script orchestrates the complete InstantIEP workflow demonstration
 * by automating interactions for all user roles.
 */

const demoOrchestrator = require('./scripts/demo-orchestrator');

// Run the demo
async function runDemo() {
  try {
    console.log('Starting InstantIEP workflow demonstration...');
    await demoOrchestrator.start();
    console.log('Demo completed successfully!');
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

runDemo();