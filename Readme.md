# Web Scraping with Node.js

This project demonstrates web scraping using Node.js, Axios, Cheerio, and Objects-to-CSV. It scrapes data from a real estate website and extracts information such as the area and age of properties in a specific area.

## Prerequisites

Before running the code, make sure you have the following dependencies installed:

- Node.js
- Axios
- Cheerio
- Objects-to-CSV

## Installation

1. Clone the repository: git clone https://github.com/AkshatSharma1/BringBackPlastics_Task1.git
2. Install the dependencies: npm install


## Usage

1. Modify the `baseUrl` variable in the `index.js` file to the desired website URL.
2. Run the script: node server.js

This will scrape the property data and save it as a CSV file named `scrappedData.csv`.

## Explanation

The code consists of the following parts:

- It uses Axios to make HTTP requests and retrieve the HTML content of the web pages.
- Cheerio is used to parse and traverse the HTML content.
- The `scrapingScript` function extracts the URLs of all the properties from the main page.
- The `processData` function extracts the area and age of each property from its unique URL.
- The `main` function orchestrates the scraping process by using `Promise.all` to handle multiple asynchronous requests efficiently.
- The extracted property data is stored as objects in the `propertyObjects` array.
- The `objects-to-csv` library is used to convert the array of objects into a CSV file.

## Acknowledgments

- [Axios](https://github.com/axios/axios)
- [Cheerio](https://github.com/cheeriojs/cheerio)
- [Objects-to-CSV](https://github.com/antonmedv/objects-to-csv)

