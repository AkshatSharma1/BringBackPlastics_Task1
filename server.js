const axios = require('axios');
const cheerio = require('cheerio');
const otcsv = require('objects-to-csv');

// Base URL for scraping
const baseUrl = 'https://www.nobroker.in/flats-for-sale-in-koramangala_bangalore';
const infiniteUrl = 'https://www.nobroker.in/api/v3/multi/property/BUY/filter'

// Function to trim the extracted values
function trimValue(str) {
  const index = str.indexOf(' ');
  const extractedValue = str.substr(0, index).trim();
  return extractedValue;
}

// Function to extract data from the property URL
async function processData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let builtupArea = $('.nb__3ocPe:contains("Builtup Area") .nb__2xbus').text();
    builtupArea = trimValue(builtupArea);

    let ageOfBuilding = $('.nb__3ocPe:contains("Age of Building") .nb__2xbus').text();
    ageOfBuilding = trimValue(ageOfBuilding);

    let objData = {
      Url: url,
      Area_of_Property: builtupArea + ' ' + 'sq ft.',
      Age_of_Property: ageOfBuilding + ' ' + 'years'
    };

    return objData;
  } catch (err) {
    console.log(err);
  }
}

// Function to get property links from the current page
async function getPropertyLinks($, allProperties) {
  const propertyLinks = [];
  allProperties.each((idx, element) => {
    const eachArticle = $(element);
    const urlLink = eachArticle.find('h2 a').attr('href');
    propertyLinks.push('https://www.nobroker.in' + urlLink);
  });

  return propertyLinks;
}

// Function for infinite scrolling
async function scrapingScript() {
  try {
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    const allProperties = $("article");
    let propertyLinks = await getPropertyLinks($, allProperties);

    // const totalPages = Math.ceil(total_count / countPerPage);
    const totalPages = 4
    let currentPage = 2; // Start from the second page since the first page is already loaded

    while (currentPage <= totalPages) {
      const nextPageUrl = `${infiniteUrl}?pageNo=${currentPage}&searchParam=W3sibGF0IjoxMi45MzUxOTI5LCJsb24iOjc3LjYyNDQ4MDY5OTk5OTk5LCJwbGFjZUlkIjoiQ2hJSkxmeVkyRTRVcmpzUlZxNEFqSTd6Z1JZIiwicGxhY2VOYW1lIjoiS29yYW1hbmdhbGEiLCJzaG93TWFwIjpmYWxzZX1d&propType=AP&city=bangalore`;
      const infiniteScrollData = await axios.get(nextPageUrl);
      const customLink = 'https://www.nobroker.in'
      const infiniteScrollDataObj = infiniteScrollData['data']['data']
      const extractedValues = infiniteScrollDataObj.map(obj => customLink + obj['detailUrl']);

      propertyLinks = propertyLinks.concat(extractedValues);
      propertyLinks = [... new Set(propertyLinks)]
      
      currentPage++;
    }
    console.log(propertyLinks)
    console.log(propertyLinks.length)
    return propertyLinks;
  } catch (err) {
    console.log(err);
  }
}

// Main function
async function main() {
  try {
    const propLinks = await scrapingScript();
    const propertyPromises = propLinks.map(processData);
    const propertyObjects = await Promise.all(propertyPromises);

    const csv = new otcsv(propertyObjects);
    await csv.toDisk('./scrappedData.csv');
  } catch (err) {
    console.log(err);
  }
}

main();
