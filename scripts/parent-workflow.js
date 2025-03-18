/**
 * Parent workflow script
 */
const fs = require('fs');
const path = require('path');
const puppeteerHelpers = require('../utils/puppeteer-helpers');
const mongodbHelpers = require('../utils/mongodb-helpers');
const credentials = require('../config/credentials');
const urls = require('../config/urls');

/**
 * Execute the Parent workflow
 * @param {Browser} browser - Puppeteer Browser instance
 * @returns {Promise<void>}
 */
async function execute(browser) {
  console.log('Starting Parent workflow for', credentials.parent.name);
  
  // Create a new page
  const page = await puppeteerHelpers.createPage(browser);
  
  try {
    // Navigate to login page
    await puppeteerHelpers.goto(page, urls.login);
    console.log('Navigated to login page');
    
    // Login as Parent
    await puppeteerHelpers.login(page, credentials.parent.email, credentials.parent.password);
    console.log('Logged in as Parent');
    
    // Wait for dashboard to load
    await puppeteerHelpers.waitForElement(page, '#dashboard-content');
    console.log('Dashboard loaded');
    
    // Take screenshot of dashboard
    await puppeteerHelpers.takeScreenshot(page, 'parent-dashboard.png');
    
    // Complete Parent questionnaire
    await completeParentQuestionnaire(page);
    
    console.log('Parent workflow completed successfully');
  } catch (error) {
    console.error('Error in Parent workflow:', error);
    throw error;
  }
}

/**
 * Complete Parent questionnaire
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<void>}
 */
async function completeParentQuestionnaire(page) {
  console.log('Completing Parent questionnaire');
  
  // Navigate to Parent questionnaire page
  await puppeteerHelpers.goto(page, urls.parentQuestionnaire);
  
  // Wait for questionnaire form to be visible
  await puppeteerHelpers.waitForElement(page, '#parent-questionnaire-form');
  
  // Load Parent questionnaire data
  const questionnaireData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/parent-questionnaire.json'), 'utf8')
  );
  
  // Fill out the basic information
  await puppeteerHelpers.fillField(page, '#studentName', questionnaireData.studentName);
  await puppeteerHelpers.fillField(page, '#parentName', questionnaireData.parentName);
  await puppeteerHelpers.fillField(page, '#relationship', questionnaireData.relationship);
  
  // Fill out home environment
  await puppeteerHelpers.fillField(page, '#studySpace', questionnaireData.homeEnvironment.studySpace);
  await puppeteerHelpers.fillField(page, '#accessToTechnology', questionnaireData.homeEnvironment.accessToTechnology);
  await puppeteerHelpers.fillField(page, '#supportSystem', questionnaireData.homeEnvironment.supportSystem);
  
  // Fill out observations
  await puppeteerHelpers.fillField(page, '#studyHabits', questionnaireData.observations.studyHabits);
  
  // Fill out interests
  for (let i = 0; i < questionnaireData.observations.interests.length; i++) {
    const interest = questionnaireData.observations.interests[i];
    await puppeteerHelpers.fillField(page, `#interest-${i + 1}`, interest);
    
    // Add more interest fields if needed
    if (i < questionnaireData.observations.interests.length - 1) {
      await puppeteerHelpers.click(page, '#add-interest-button', false);
    }
  }
  
  // Fill out strengths
  for (let i = 0; i < questionnaireData.observations.strengths.length; i++) {
    const strength = questionnaireData.observations.strengths[i];
    await puppeteerHelpers.fillField(page, `#strength-${i + 1}`, strength);
    
    // Add more strength fields if needed
    if (i < questionnaireData.observations.strengths.length - 1) {
      await puppeteerHelpers.click(page, '#add-strength-button', false);
    }
  }
  
  // Fill out challenges
  for (let i = 0; i < questionnaireData.observations.challenges.length; i++) {
    const challenge = questionnaireData.observations.challenges[i];
    await puppeteerHelpers.fillField(page, `#challenge-${i + 1}`, challenge);
    
    // Add more challenge fields if needed
    if (i < questionnaireData.observations.challenges.length - 1) {
      await puppeteerHelpers.click(page, '#add-challenge-button', false);
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
  
  // Fill out health considerations
  await puppeteerHelpers.fillField(page, '#medicalConditions', questionnaireData.healthConsiderations.medicalConditions);
  await puppeteerHelpers.fillField(page, '#medications', questionnaireData.healthConsiderations.medications);
  await puppeteerHelpers.fillField(page, '#allergies', questionnaireData.healthConsiderations.allergies);
  await puppeteerHelpers.fillField(page, '#dietaryRestrictions', questionnaireData.healthConsiderations.dietaryRestrictions);
  await puppeteerHelpers.fillField(page, '#physicalLimitations', questionnaireData.healthConsiderations.physicalLimitations);
  
  // Fill out socialization patterns
  await puppeteerHelpers.fillField(page, '#peerRelationships', questionnaireData.socializationPatterns.peerRelationships);
  await puppeteerHelpers.fillField(page, '#adultRelationships', questionnaireData.socializationPatterns.adultRelationships);
  await puppeteerHelpers.fillField(page, '#groupSettings', questionnaireData.socializationPatterns.groupSettings);
  await puppeteerHelpers.fillField(page, '#socializationConcerns', questionnaireData.socializationPatterns.concerns);
  
  // Fill out additional concerns
  await puppeteerHelpers.fillField(page, '#additionalConcerns', questionnaireData.additionalConcerns);
  
  // Fill out communication preferences
  await puppeteerHelpers.selectOption(page, '#preferredMethod', questionnaireData.communicationPreferences.preferredMethod);
  await puppeteerHelpers.fillField(page, '#availableTimes', questionnaireData.communicationPreferences.availableTimes);
  await puppeteerHelpers.fillField(page, '#languageNeeds', questionnaireData.communicationPreferences.languageNeeds);
  
  // Submit the form
  await puppeteerHelpers.click(page, '#submit-questionnaire-button');
  
  // Wait for success message
  await puppeteerHelpers.waitForElement(page, '.questionnaire-success-message');
  console.log('Parent questionnaire completed successfully');
}

module.exports = {
  execute,
  completeParentQuestionnaire
};