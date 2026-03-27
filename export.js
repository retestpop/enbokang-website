const { execSync } = require('child_process');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const htmlPath = 'E:\\DeskTop\\网站\\website\\brochure.html'.replace(/\\/g, '/');

// Front page - use body overflow hidden to show only front
const frontUrl = `file:///${htmlPath}#front`;
const backUrl = `file:///${htmlPath}#back`;

console.log('Using Chrome at:', chromePath);
console.log('HTML path:', htmlPath);
