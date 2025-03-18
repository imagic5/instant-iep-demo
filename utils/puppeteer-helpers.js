/**
 * Puppeteer helper functions for browser automation
 */
const puppeteer = require('puppeteer');

/**
 * Launch a new browser instance
 * @param {boolean} headless - Whether to run browser in headless mode
 * @returns {Promise<Browser>} Puppeteer Browser instance
 */
async function launchBrowser(headless = false) {
  return await puppeteer.launch({
    headless: headless ? 'new' : false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
}

/**
 * Open a new page in the browser
 * @param {Browser} browser - Puppeteer Browser instance
 * @returns {Promise<Page>} Puppeteer Page instance
 */
async function createPage(browser) {
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(60000);
  return page;
}

/**
 * Navigate to a URL
 * @param {Page} page - Puppeteer Page instance
 * @param {string} url - URL to navigate to
 * @returns {Promise<void>}
 */
async function goto(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
}

/**
 * Login to the application
 * @param {Page} page - Puppeteer Page instance
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<void>}
 */
async function login(page, email, password) {
  await page.type('#email', email);
  await page.type('#password', password);
  await Promise.all([
    page.click('#login-button'),
    page.waitForNavigation({ waitUntil: 'networkidle2' })
  ]);
}

/**
 * Fill a form field
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the field
 * @param {string} value - Value to fill
 * @returns {Promise<void>}
 */
async function fillField(page, selector, value) {
  await page.waitForSelector(selector);
  await page.type(selector, value);
}

/**
 * Click a button or link
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the button or link
 * @returns {Promise<void>}
 */
async function click(page, selector, waitForNavigation = true) {
  await page.waitForSelector(selector);
  if (waitForNavigation) {
    await Promise.all([
      page.click(selector),
      page.waitForNavigation({ waitUntil: 'networkidle2' })
    ]);
  } else {
    await page.click(selector);
  }
}

/**
 * Select an option from a dropdown
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the dropdown
 * @param {string} value - Value to select
 * @returns {Promise<void>}
 */
async function selectOption(page, selector, value) {
  await page.waitForSelector(selector);
  await page.select(selector, value);
}

/**
 * Upload a file
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the file input
 * @param {string} filePath - Path to the file to upload
 * @returns {Promise<void>}
 */
async function uploadFile(page, selector, filePath) {
  const fileInput = await page.$(selector);
  await fileInput.uploadFile(filePath);
}

/**
 * Wait for an element to be visible
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the element
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<ElementHandle>} Element handle
 */
async function waitForElement(page, selector, timeout = 30000) {
  return await page.waitForSelector(selector, { visible: true, timeout });
}

/**
 * Check if an element exists
 * @param {Page} page - Puppeteer Page instance
 * @param {string} selector - CSS selector for the element
 * @returns {Promise<boolean>} Whether the element exists
 */
async function elementExists(page, selector) {
  return (await page.$(selector)) !== null;
}

/**
 * Take a screenshot
 * @param {Page} page - Puppeteer Page instance
 * @param {string} path - Path to save the screenshot
 * @returns {Promise<void>}
 */
async function takeScreenshot(page, path) {
  await page.screenshot({ path, fullPage: true });
}

module.exports = {
  launchBrowser,
  createPage,
  goto,
  login,
  fillField,
  click,
  selectOption,
  uploadFile,
  waitForElement,
  elementExists,
  takeScreenshot
};