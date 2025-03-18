/**
 * Student workflow script
 */
const fs = require('fs');
const path = require('path');
const puppeteerHelpers = require('../utils/puppeteer-helpers');
const mongodbHelpers = require('../utils/mongodb-helpers');
const credentials = require('../config/credentials');
const urls = require('../config/urls');

/**
 * Execute the Student workflow
 * @param {Browser} browser - Puppeteer Browser instance
 * @returns {Promise<void>}
 */
async function execute(browser) {
  console.log('Starting Student workflow for', credentials.student.name);
  
  // Create a new page
  const page = await puppeteerHelpers.createPage(browser);
  
  try {
    // Navigate to login page
    await puppeteerHelpers.goto(page, urls.login);
    console.log('Navigated to login page');
    
    // Login as Student
    await puppeteerHelpers.login(page, credentials.student.email, credentials.student.password);
    console.log('Logged in as Student');
    
    // Wait for dashboard to load
    await puppeteerHelpers.waitForElement(page, '#dashboard-content');
    console.log('Dashboard loaded');
    
    // Take screenshot of dashboard
    await puppeteerHelpers.takeScreenshot(page, 'student-dashboard.png');
    
    // Complete Student questionnaire
    await completeStudentQuestionnaire(page);
    
    console.log('Student workflow completed successfully');
  } catch (error) {
    console.error('Error in Student workflow:', error);
    throw error;
  }
}

/**
 * Complete Student questionnaire
 * @param {Page} page - Puppeteer Page instance
 * @returns {Promise<void>}
 */
async function completeStudentQuestionnaire(page) {
  console.log('Completing Student questionnaire');
  
  // Navigate to Student questionnaire page
  await puppeteerHelpers.goto(page, urls.studentQuestionnaire);
  
  // Wait for questionnaire form to be visible
  await puppeteerHelpers.waitForElement(page, '#student-questionnaire-form');
  
  // Load Student questionnaire data
  const questionnaireData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/student-questionnaire.json'), 'utf8')
  );
  
  // Fill out the basic information
  await puppeteerHelpers.fillField(page, '#studentName', questionnaireData.studentName);
  await puppeteerHelpers.fillField(page, '#grade', questionnaireData.grade);
  await puppeteerHelpers.fillField(page, '#age', questionnaireData.age);
  
  // Fill out academic strengths
  for (let i = 0; i < questionnaireData.selfAssessment.academicStrengths.length; i++) {
    const strength = questionnaireData.selfAssessment.academicStrengths[i];
    await puppeteerHelpers.fillField(page, `#academicStrength-${i + 1}`, strength);
    
    // Add more strength fields if needed
    if (i < questionnaireData.selfAssessment.academicStrengths.length - 1) {
      await puppeteerHelpers.click(page, '#add-academic-strength-button', false);
    }
  }
  
  // Fill out academic challenges
  for (let i = 0; i < questionnaireData.selfAssessment.academicChallenges.length; i++) {
    const challenge = questionnaireData.selfAssessment.academicChallenges[i];
    await puppeteerHelpers.fillField(page, `#academicChallenge-${i + 1}`, challenge);
    
    // Add more challenge fields if needed
    if (i < questionnaireData.selfAssessment.academicChallenges.length - 1) {
      await puppeteerHelpers.click(page, '#add-academic-challenge-button', false);
    }
  }
  
  // Fill out learning preferences
  for (let i = 0; i < questionnaireData.selfAssessment.learningPreferences.length; i++) {
    const preference = questionnaireData.selfAssessment.learningPreferences[i];
    await puppeteerHelpers.fillField(page, `#learningPreference-${i + 1}`, preference);
    
    // Add more preference fields if needed
    if (i < questionnaireData.selfAssessment.learningPreferences.length - 1) {
      await puppeteerHelpers.click(page, '#add-learning-preference-button', false);
    }
  }
  
  // Fill out favorite subjects
  for (let i = 0; i < questionnaireData.interestsAndGoals.favoriteSubjects.length; i++) {
    const subject = questionnaireData.interestsAndGoals.favoriteSubjects[i];
    await puppeteerHelpers.fillField(page, `#favoriteSubject-${i + 1}`, subject);
    
    // Add more subject fields if needed
    if (i < questionnaireData.interestsAndGoals.favoriteSubjects.length - 1) {
      await puppeteerHelpers.click(page, '#add-favorite-subject-button', false);
    }
  }
  
  // Fill out career interests
  for (let i = 0; i < questionnaireData.interestsAndGoals.careerInterests.length; i++) {
    const career = questionnaireData.interestsAndGoals.careerInterests[i];
    await puppeteerHelpers.fillField(page, `#careerInterest-${i + 1}`, career);
    
    // Add more career fields if needed
    if (i < questionnaireData.interestsAndGoals.careerInterests.length - 1) {
      await puppeteerHelpers.click(page, '#add-career-interest-button', false);
    }
  }
  
  // Fill out short-term goals
  for (let i = 0; i < questionnaireData.interestsAndGoals.shortTermGoals.length; i++) {
    const goal = questionnaireData.interestsAndGoals.shortTermGoals[i];
    await puppeteerHelpers.fillField(page, `#shortTermGoal-${i + 1}`, goal);
    
    // Add more goal fields if needed
    if (i < questionnaireData.interestsAndGoals.shortTermGoals.length - 1) {
      await puppeteerHelpers.click(page, '#add-short-term-goal-button', false);
    }
  }
  
  // Fill out long-term goals
  for (let i = 0; i < questionnaireData.interestsAndGoals.longTermGoals.length; i++) {
    const goal = questionnaireData.interestsAndGoals.longTermGoals[i];
    await puppeteerHelpers.fillField(page, `#longTermGoal-${i + 1}`, goal);
    
    // Add more goal fields if needed
    if (i < questionnaireData.interestsAndGoals.longTermGoals.length - 1) {
      await puppeteerHelpers.click(page, '#add-long-term-goal-button', false);
    }
  }
  
  // Fill out favorite class activities
  for (let i = 0; i < questionnaireData.schoolExperience.favoriteClassActivities.length; i++) {
    const activity = questionnaireData.schoolExperience.favoriteClassActivities[i];
    await puppeteerHelpers.fillField(page, `#favoriteActivity-${i + 1}`, activity);
    
    // Add more activity fields if needed
    if (i < questionnaireData.schoolExperience.favoriteClassActivities.length - 1) {
      await puppeteerHelpers.click(page, '#add-favorite-activity-button', false);
    }
  }
  
  // Fill out challenging class activities
  for (let i = 0; i < questionnaireData.schoolExperience.challengingClassActivities.length; i++) {
    const activity = questionnaireData.schoolExperience.challengingClassActivities[i];
    await puppeteerHelpers.fillField(page, `#challengingActivity-${i + 1}`, activity);
    
    // Add more activity fields if needed
    if (i < questionnaireData.schoolExperience.challengingClassActivities.length - 1) {
      await puppeteerHelpers.click(page, '#add-challenging-activity-button', false);
    }
  }
  
  // Fill out helpful accommodations
  for (let i = 0; i < questionnaireData.schoolExperience.helpfulAccommodations.length; i++) {
    const accommodation = questionnaireData.schoolExperience.helpfulAccommodations[i];
    await puppeteerHelpers.fillField(page, `#helpfulAccommodation-${i + 1}`, accommodation);
    
    // Add more accommodation fields if needed
    if (i < questionnaireData.schoolExperience.helpfulAccommodations.length - 1) {
      await puppeteerHelpers.click(page, '#add-helpful-accommodation-button', false);
    }
  }
  
  // Fill out academic support needs
  for (let i = 0; i < questionnaireData.supportNeeds.academicSupport.length; i++) {
    const support = questionnaireData.supportNeeds.academicSupport[i];
    await puppeteerHelpers.fillField(page, `#academicSupport-${i + 1}`, support);
    
    // Add more support fields if needed
    if (i < questionnaireData.supportNeeds.academicSupport.length - 1) {
      await puppeteerHelpers.click(page, '#add-academic-support-button', false);
    }
  }
  
  // Fill out environmental support needs
  for (let i = 0; i < questionnaireData.supportNeeds.environmentalSupport.length; i++) {
    const support = questionnaireData.supportNeeds.environmentalSupport[i];
    await puppeteerHelpers.fillField(page, `#environmentalSupport-${i + 1}`, support);
    
    // Add more support fields if needed
    if (i < questionnaireData.supportNeeds.environmentalSupport.length - 1) {
      await puppeteerHelpers.click(page, '#add-environmental-support-button', false);
    }
  }
  
  // Fill out social-emotional support needs
  for (let i = 0; i < questionnaireData.supportNeeds.socialEmotionalSupport.length; i++) {
    const support = questionnaireData.supportNeeds.socialEmotionalSupport[i];
    await puppeteerHelpers.fillField(page, `#socialEmotionalSupport-${i + 1}`, support);
    
    // Add more support fields if needed
    if (i < questionnaireData.supportNeeds.socialEmotionalSupport.length - 1) {
      await puppeteerHelpers.click(page, '#add-social-emotional-support-button', false);
    }
  }
  
  // Fill out additional comments
  await puppeteerHelpers.fillField(page, '#additionalComments', questionnaireData.additionalComments);
  
  // Submit the form
  await puppeteerHelpers.click(page, '#submit-questionnaire-button');
  
  // Wait for success message
  await puppeteerHelpers.waitForElement(page, '.questionnaire-success-message');
  console.log('Student questionnaire completed successfully');
}

module.exports = {
  execute,
  completeStudentQuestionnaire
};