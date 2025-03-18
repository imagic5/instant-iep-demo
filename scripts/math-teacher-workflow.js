/**
 * Math Teacher workflow script
 */
const fs = require('fs');
const path = require('path');
const puppeteerHelpers = require('../utils/puppeteer-helpers');
const mongodbHelpers = require('../utils/mongodb-helpers');
const credentials = require('../config/credentials');
const urls = require('../config/urls');

/**
 * Execute the Math Teacher workflow
 * @param {Browser} browser - Puppeteer Browser instance
 * @returns {Promise<void>}
 */
async function execute(browser) {
  console.log('Starting Math Teacher workflow for', credentials.mathTeacher.name);
  
  // Create a new page
  const page = await puppeteerHelpers.createPage(browser);
  
  try {
    // Navigate to login page
    await puppeteerHelpers.goto(page, urls.login);
    console.log('Navigated to login page');
    
    // Login as Math Teacher
    await puppeteerHelpers.login(page, credentials.mathTeacher.email, credentials.mathTeacher.password);
    console.log('Logged in as Math Teacher');
    
    // Wait for dashboard to load
    await puppeteerHelpers.waitForElement(page, '#dashboard-content');
    console.log('Dashboard loaded');
    
    // Take screenshot of dashboard
    await puppeteerHelpers.takeScreenshot(page, 'math-teacher-dashboard.png');
    
    // Complete Math questionnaire
    await completeMathQuestionnaire(page);
    
    console.log('Math Teacher workflow completed successfully');
  } catch (error) {
    console.error('Error in Math Teacher workflow:', error);
    throw error;
  }
}

/**
 * Complete Math questionnaire
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<void>}
 */
async function completeMathQuestionnaire(page) {
  console.log('Completing Math questionnaire');
  
  // Navigate to Math questionnaire page
  await puppeteerHelpers.goto(page, urls.mathQuestionnaire);
  
  // Wait for questionnaire form to be visible
  await puppeteerHelpers.waitForElement(page, '#math-questionnaire-form');
  
  // Load Math questionnaire data
  const questionnaireData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/math-questionnaire.json'), 'utf8')
  );
  
  // Fill out the form
  await puppeteerHelpers.fillField(page, '#studentName', questionnaireData.studentName);
  await puppeteerHelpers.fillField(page, '#grade', questionnaireData.grade);
  await puppeteerHelpers.fillField(page, '#mathLevel', questionnaireData.mathLevel);
  await puppeteerHelpers.fillField(page, '#currentClass', questionnaireData.currentClass);
  
  // Fill out math skills
  await puppeteerHelpers.selectOption(page, '#arithmeticOperations', questionnaireData.mathSkills.arithmeticOperations);
  await puppeteerHelpers.selectOption(page, '#algebraicConcepts', questionnaireData.mathSkills.algebraicConcepts);
  await puppeteerHelpers.selectOption(page, '#geometryUnderstanding', questionnaireData.mathSkills.geometryUnderstanding);
  await puppeteerHelpers.selectOption(page, '#dataAnalysis', questionnaireData.mathSkills.dataAnalysis);
  await puppeteerHelpers.selectOption(page, '#calculusReadiness', questionnaireData.mathSkills.calculusReadiness);
  
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
  await puppeteerHelpers.fillField(page, '#algebraAssessment', questionnaireData.assessmentResults.algebraAssessment.toString());
  await puppeteerHelpers.fillField(page, '#geometryAssessment', questionnaireData.assessmentResults.geometryAssessment.toString());
  await puppeteerHelpers.fillField(page, '#calculusReadinessAssessment', questionnaireData.assessmentResults.calculusReadinessAssessment.toString());
  
  // Fill out comments
  await puppeteerHelpers.fillField(page, '#comments', questionnaireData.comments);
  
  // Submit the form
  await puppeteerHelpers.click(page, '#submit-questionnaire-button');
  
  // Wait for success message
  await puppeteerHelpers.waitForElement(page, '.questionnaire-success-message');
  console.log('Math questionnaire completed successfully');
}

module.exports = {
  execute,
  completeMathQuestionnaire
};