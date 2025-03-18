/**
 * MongoDB helper functions for database operations
 */
const { getDb } = require('../config/mongodb');

/**
 * Get a user by email
 * @param {string} email - User email
 * @returns {Promise<Object>} User object
 */
async function getUserByEmail(email) {
  const db = getDb();
  return await db.collection('users').findOne({ email });
}

/**
 * Get a questionnaire by role
 * @param {string} role - Role (caseManager, mathTeacher, parent, student)
 * @returns {Promise<Object>} Questionnaire object
 */
async function getQuestionnaireByRole(role) {
  const db = getDb();
  return await db.collection('questionnaires').findOne({ role });
}

/**
 * Save questionnaire responses
 * @param {string} userId - User ID
 * @param {string} role - Role (caseManager, mathTeacher, parent, student)
 * @param {Object} responses - Questionnaire responses
 * @returns {Promise<Object>} Inserted document
 */
async function saveResponses(userId, role, responses) {
  const db = getDb();
  const result = await db.collection('responses').insertOne({
    userId,
    role,
    responses,
    createdAt: new Date()
  });
  return result;
}

/**
 * Get all responses for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of response objects
 */
async function getResponsesForStudent(studentId) {
  const db = getDb();
  return await db.collection('responses')
    .find({ studentId })
    .toArray();
}

/**
 * Check if all questionnaires are completed for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<boolean>} Whether all questionnaires are completed
 */
async function areAllQuestionnairesCompleted(studentId) {
  const db = getDb();
  const roles = ['caseManager', 'mathTeacher', 'parent', 'student'];
  
  const responses = await db.collection('responses')
    .find({ studentId })
    .toArray();
    
  const completedRoles = responses.map(response => response.role);
  
  return roles.every(role => completedRoles.includes(role));
}

/**
 * Save generated IEP
 * @param {string} studentId - Student ID
 * @param {Object} iepData - IEP data
 * @returns {Promise<Object>} Inserted document
 */
async function saveIEP(studentId, iepData) {
  const db = getDb();
  const result = await db.collection('ieps').insertOne({
    studentId,
    iepData,
    createdAt: new Date()
  });
  return result;
}

/**
 * Get IEP for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} IEP object
 */
async function getIEP(studentId) {
  const db = getDb();
  return await db.collection('ieps').findOne({ studentId });
}

/**
 * Save assessment file metadata
 * @param {string} studentId - Student ID
 * @param {string} fileName - File name
 * @param {string} fileType - File type
 * @param {string} filePath - File path
 * @returns {Promise<Object>} Inserted document
 */
async function saveAssessment(studentId, fileName, fileType, filePath) {
  const db = getDb();
  const result = await db.collection('assessments').insertOne({
    studentId,
    fileName,
    fileType,
    filePath,
    uploadedAt: new Date()
  });
  return result;
}

/**
 * Get assessments for a student
 * @param {string} studentId - Student ID
 * @returns {Promise<Array>} Array of assessment objects
 */
async function getAssessments(studentId) {
  const db = getDb();
  return await db.collection('assessments')
    .find({ studentId })
    .toArray();
}

module.exports = {
  getUserByEmail,
  getQuestionnaireByRole,
  saveResponses,
  getResponsesForStudent,
  areAllQuestionnairesCompleted,
  saveIEP,
  getIEP,
  saveAssessment,
  getAssessments
};