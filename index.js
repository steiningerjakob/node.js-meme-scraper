// import modules:

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('node:fs');

// declare global variable:

const targetWebsite = 'https://memegen-link-examples-upleveled.netlify.app/';

// good practice: create folder for memes in the code using fs.mkdir

fs.mkdir('./memes', { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
});

// declare function to fetch image data and create a numbered file with a .jpg file extension in the memes folder:

async function download(img, i) {
  try {
    const response = await fetch(img);
    const buffer = await response.buffer();
    fs.writeFile(`./memes/image${i + 1}.jpg`, buffer, () =>
      console.log('finished downloading!'),
    );
  } catch (err) {
    console.log(err);
  }
}

// create array with image data:

async function getLinks() {
  try {
    // get html text from the website
    const response = await fetch(targetWebsite);
    // use await to ensure that the promise resolves
    const body = await response.text();
    // parse html using cheerio
    const $ = cheerio.load(body);
    // create array
    const imgList = [];
    // extract img URLs via <src> attribute and push into array
    $('img').each((i, url) => {
      if (i < 10) {
        imgList.push(url.attribs.src);
      }
    });
    // loop over the array and call download function
    for (let i = 0; i < imgList.length; i++) {
      download(imgList[i], i);
    }
  } catch (err) {
    console.log(err);
  }
}

getLinks();

// Sources:
// https://stackabuse.com/making-http-requests-in-node-js-with-node-fetch/
// https://www.scrapingbee.com/blog/node-fetch/
// https://dev.to/masbagal/saving-image-from-url-using-node-js-5an6
