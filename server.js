const axios = require('axios');
const cheerio = require('cheerio');
const otcsv = require('objects-to-csv' )

//Url from which we have to scrape data
const baseUrl = 'https://www.nobroker.in/flats-for-sale-in-koramangala_bangalore';

//An array(list) of objects which will contain Url, Area and Age
let propertyObjects = [];

function trimValue(str) {
  const index = str.indexOf(' ');
  const extractedValue = str.substr(0, index).trim();
  return extractedValue;
}

// Function which will extract age of property and area of property from the unique property link
async function processData(url) {
  try {

    //get the data 
    const { data } = await axios.get(url);

    //making a cheerio function
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

//Functiont to get links of all properties - 25 links
function getPropertyLinks($, allProperties) {
  const propertyLinks = [];
  allProperties.each((idx, element) => {
    const eachArticle = $(element);
    const urlLink = eachArticle.find('h2 a').attr('href');
    propertyLinks.push('https://www.nobroker.in' + urlLink);
  });

  return propertyLinks;
}

//Function to map a cheerio function to all article tags
async function scrapingScript() {
  try {
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    const allProperties = $("article");
    const links = getPropertyLinks($, allProperties);
    return links;
  } catch (err) {
    console.log(err);
  }
}

//Using normal await 

/*
async function main() {
  try {
    const propLinks = await scrapingScript();
    for (let i = 0; i < propLinks.length; i++) {
      const propertyData = await processData(propLinks[i]);
      propertyObjects.push(propertyData);
    }
    // console.log(propertyObjects);

    //converting list of objects to a csv file using Objects-to-csv library
    const csv = new otcsv(propertyObjects)
    await csv.toDisk('./scrappedData.csv')

  } catch (err) {
    console.log(err);
  }
}
*/

// Using Promise.All - optimised performance
async function main() {
    try {
      const propLinks = await scrapingScript();
      //propLinks.map(processData) creates an array of promises by mapping each propLinks element to the processData function. 
      const propertyPromises = propLinks.map(processData);
      //Promise.all takes an array of promises and returns a new promise
      const propertyObjects = await Promise.all(propertyPromises);
  
      //List of objects is converted into a csv file
      const csv = new otcsv(propertyObjects);
      await csv.toDisk('./scrappedData1.csv');
    } catch (err) {
      console.log(err);
    }
  }

main();

