/**
 * URL configuration for the InstantIEP application
 */

module.exports = {
  // Base URL for the application
  baseUrl: 'https://instantiep.com',
  
  // Login page
  login: 'https://instantiep.com/login',
  
  // Dashboard pages for different roles
  caseManagerDashboard: 'https://instantiep.com/dashboard/case-manager',
  mathTeacherDashboard: 'https://instantiep.com/dashboard/teacher',
  parentDashboard: 'https://instantiep.com/dashboard/parent',
  studentDashboard: 'https://instantiep.com/dashboard/student',
  
  // Questionnaire pages
  elaQuestionnaire: 'https://instantiep.com/questionnaire/ela',
  mathQuestionnaire: 'https://instantiep.com/questionnaire/math',
  parentQuestionnaire: 'https://instantiep.com/questionnaire/parent',
  studentQuestionnaire: 'https://instantiep.com/questionnaire/student',
  
  // Assessment upload page
  assessmentUpload: 'https://instantiep.com/assessments/upload',
  
  // IEP generation page
  iepGeneration: 'https://instantiep.com/iep/generate'
};