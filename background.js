const esprima = require('esprima');
const code = chrome.runtime.onInstalled.addListener(function() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "runScript") {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        function: () => {
          var data = {
            h1: document.querySelector('h1') ? document.querySelector('h1').innerText : null
          };
          return data;
        }
      }).then((results) => {
        console.log('First H1 content is: ' + results[0].result.h1);
        sendResponse(results[0].result); // Send the extracted data as a response
      }).catch((error) => {
        console.error('Error:', error);
      });
    }
    return true; // Keep the message channel open until sendResponse is called
  });
});;

const parsedCode = esprima.parseScript(code);

parsedCode.body.forEach(node => {
  if (node.type === 'ExpressionStatement') {
    console.log('Found an expression statement:');
    console.log(node.expression.callee.object.property.name);
  }
});

// Assuming you have a list of categories and each category has associated keywords
const categories = {
  "category1": ["keyword1", "keyword2", "keyword3"],
  "category2": ["keyword4", "keyword5", "keyword6"],
  // add more categories as needed
};

// Assuming 'keywords' is an array of keywords extracted from your code
const keywords = ["keyword1", "keyword4", "keyword7"];

// Create an object to hold the categorized keywords
let categorizedKeywords = {};

// Iterate over each keyword
keywords.forEach(keyword => {
  // Iterate over each category
  for (let category in categories) {
    // If the category's keywords include the current keyword, add it to the categorizedKeywords
    if (categories[category].includes(keyword)) {
      if (!categorizedKeywords[category]) {
        categorizedKeywords[category] = [];
      }
      categorizedKeywords[category].push(keyword);
    }
  }
});

console.log(categorizedKeywords);

const Papa = require('papaparse');
const fs = require('fs');

const csvFile = fs.readFileSync('producs.csv', 'utf8');

const results = Papa.parse(csvFile, { header: true });

results.data.forEach(row => {
  for (let category in categorizedKeywords) {
    if (categorizedKeywords[category].some(keyword => row.includes(keyword))) {
      console.log(`Row ${row} matches category ${category}`);
    }
  }
});
