/**
 * Case Manager (ELA Teacher) workflow script
 */
const fs = require('fs');
const path = require('path');
const puppeteerHelpers = require('../utils/puppeteer-helpers');
const mongodbHelpers = require('../utils/mongodb-helpers');
const credentials = require('../config/credentials');
const urls = require('../config/urls');

/**
 * Execute the Case Manager workflow
 * @param {Browser} browser - Puppeteer Browser instance
 * @returns {Promise<void>}
 */
async function execute(browser) {
  console.log('Starting Case Manager workflow for', credentials.caseManager.name);
  
  // Create a new page
  const page = await puppeteerHelpers.createPage(browser);
  
  try {
    // Navigate to login page
    await puppeteerHelpers.goto(page, urls.login);
    console.log('Navigated to login page');
    
    // Login as Case Manager
    await puppeteerHelpers.login(page, credentials.caseManager.email, credentials.caseManager.password);
    console.log('Logged in as Case Manager');
    
    // Wait for dashboard to load
    await puppeteerHelpers.waitForElement(page, '#dashboard-content');
    console.log('Dashboard loaded');
    
    // Take screenshot of dashboard
    await puppeteerHelpers.takeScreenshot(page, 'case-manager-dashboard.png');
    
    // Initiate IEP process
    await puppeteerHelpers.click(page, '#initiate-iep-button');
    console.log('Initiated IEP process');
    
    // Upload assessment files
    await uploadAssessments(page);
    
    // Complete ELA questionnaire
    await completeELAQuestionnaire(page);
    
    // Check for "Instant IEP" button
    await checkForInstantIEPButton(page);
    
    console.log('Case Manager workflow completed successfully');
  } catch (error) {
    console.error('Error in Case Manager workflow:', error);
    throw error;
  }
}

/**
 * Upload assessment files
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<void>}
 */
async function uploadAssessments(page) {
  console.log('Uploading assessment files');
  
  // Navigate to assessment upload page
  await puppeteerHelpers.goto(page, urls.assessmentUpload);
  
  // Wait for upload form to be visible
  await puppeteerHelpers.waitForElement(page, '#file-upload-form');
  
  // Upload files
  const filePath = path.join(__dirname, '../data/sample-assessment.pdf');
  await puppeteerHelpers.uploadFile(page, '#file-input', filePath);
  
  // Submit the form
  await puppeteerHelpers.click(page, '#upload-button');
  
  // Wait for success message
  await puppeteerHelpers.waitForElement(page, '.upload-success-message');
  console.log('Assessment files uploaded successfully');
}

/**
 * Complete ELA questionnaire
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<void>}
 */
async function completeELAQuestionnaire(page) {
  console.log('Completing ELA questionnaire');
  
  // Navigate to ELA questionnaire page
  await puppeteerHelpers.goto(page, urls.elaQuestionnaire);
  
  // Wait for questionnaire form to be visible
  await puppeteerHelpers.waitForElement(page, '#ela-questionnaire-form');
  
  // Load ELA questionnaire data
  const questionnaireData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/ela-questionnaire.json'), 'utf8')
  );
  
  // Fill out the form
  await puppeteerHelpers.fillField(page, '#studentName', questionnaireData.studentName);
  await puppeteerHelpers.fillField(page, '#grade', questionnaireData.grade);
  await puppeteerHelpers.fillField(page, '#readingLevel', questionnaireData.readingLevel);
  await puppeteerHelpers.fillField(page, '#writingLevel', questionnaireData.writingLevel);
  await puppeteerHelpers.selectOption(page, '#comprehensionSkills', questionnaireData.comprehensionSkills);
  
  // Fill out strengths
  for (let i = 0; i < questionnaireData.strengths.length; i++) {
    const strength = questionnaireData.strengths[i];
    await puppeteerHelpers.fillField(page, `#strength-${i + 1}`, strength);
    
    // Add more strength fields if needed
    if (i < questionnaireData.strengths.length - 1) {
      await puppeteerHelpers.click(page, '#add-strength-button', false);
    }
  }
  
  // Fill out challenges
  for (let i = 0; i < questionnaireData.challenges.length; i++) {
    const challenge = questionnaireData.challenges[i];
    await puppeteerHelpers.fillField(page, `#challenge-${i + 1}`, challenge);
    
    // Add more challenge fields if needed
    if (i < questionnaireData.challenges.length - 1) {
      await puppeteerHelpers.click(page, '#add-challenge-button', false);
    }
  }
  
  // Fill out accommodations
  for (let i = 0; i < questionnaireData.accommodations.length; i++) {
    const accommodation = questionnaireData.accommodations[i];
    await puppeteerHelpers.fillField(page, `#accommodation-${i + 1}`, accommodation);
    
    // Add more accommodation fields if needed
    if (i < questionnaireData.accommodations.length - 1) {
      await puppeteerHelpers.click(page, '#add-accommodation-button', false);
    }
  }
  
  // Fill out goals
  for (let i = 0; i < questionnaireData.goals.length; i++) {
    const goal = questionnaireData.goals[i];
    await puppeteerHelpers.fillField(page, `#goal-${i + 1}`, goal);
    
    // Add more goal fields if needed
    if (i < questionnaireData.goals.length - 1) {
      await puppeteerHelpers.click(page, '#add-goal-button', false);
    }
  }
  
  // Fill out assessment results
  await puppeteerHelpers.fillField(page, '#standardizedTestScore', questionnaireData.assessmentResults.standardizedTestScore.toString());
  await puppeteerHelpers.fillField(page, '#vocabularyAssessment', questionnaireData.assessmentResults.vocabularyAssessment.toString());
  await puppeteerHelpers.fillField(page, '#writingRubricScore', questionnaireData.assessmentResults.writingRubricScore.toString());
  await puppeteerHelpers.fillField(page, '#readingComprehension', questionnaireData.assessmentResults.readingComprehension.toString());
  
  // Fill out comments
  await puppeteerHelpers.fillField(page, '#comments', questionnaireData.comments);
  
  // Submit the form
  await puppeteerHelpers.click(page, '#submit-questionnaire-button');
  
  // Wait for success message
  await puppeteerHelpers.waitForElement(page, '.questionnaire-success-message');
  console.log('ELA questionnaire completed successfully');
}

/**
 * Check for "Instant IEP" button
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<boolean>} Whether the button exists
 */
async function checkForInstantIEPButton(page) {
  console.log('Checking for "Instant IEP" button');
  
  // Navigate to dashboard
  await puppeteerHelpers.goto(page, urls.caseManagerDashboard);
  
  // Wait for dashboard to load
  await puppeteerHelpers.waitForElement(page, '#dashboard-content');
  
  // Check if the button exists
  const buttonExists = await puppeteerHelpers.elementExists(page, '#instant-iep-button');
  
  if (buttonExists) {
    console.log('"Instant IEP" button is visible!');
    
    // Take screenshot
    await puppeteerHelpers.takeScreenshot(page, 'instant-iep-button-visible.png');
    
    // Click the button
    await puppeteerHelpers.click(page, '#instant-iep-button');
    
    // Wait for IEP generation confirmation
    await puppeteerHelpers.waitForElement(page, '.iep-generation-success');
    console.log('IEP generated successfully');
    
    // Take screenshot of generated IEP
    await puppeteerHelpers.takeScreenshot(page, 'generated-iep.png');
    
    return true;
  } else {
    console.log('"Instant IEP" button is not yet visible');
    return false;
  }
}

module.exports = {
  execute,
  uploadAssessments,
  completeELAQuestionnaire,
  checkForInstantIEPButton
};