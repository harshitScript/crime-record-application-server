const { createHmac } = require("crypto");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const generateExpiryInMilSeconds = ({ hours = 1 }) => {
  const currentDate = new Date();

  currentDate.setHours(currentDate.getHours() + hours);

  return currentDate.getTime();
};

const generateHash = ({ algorithm = "sha512", string = "", secret = "" }) => {
  return createHmac(algorithm, secret).update(string).digest("hex");
};

const pdfUtils = {
  generate: async ({ path = "", htmlString = "" }) => {
    //* PDF GENERATION CODE. ----------------------------------------------------
    try {
      //? launches puppeteer in the browser.
      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disabled-setupid-sandbox"],
      });
      //? Opens a new page.
      const page = await browser.newPage();
      //? Sets content for the page
      await page.setContent(htmlString);
      //? Creates a pdf document
      await page.pdf({
        path: path,
        format: "A4",
        printBackground: true,
      });
      //? closes the puppeteer in the browser
      await browser.close();

      return 1;
    } catch (error) {
      console.log("The pdf generation error => ", error);
      return 0;
    }

    //* ---------------------------------------------------------------------------------
  },
  delete: async ({ path = "" }) => {
    try {
      await fs.unlink(path);
      return 1;
    } catch (error) {
      return 0;
    }
  },
};

module.exports = {
  generateExpiryInMilSeconds,
  generateHash,
  pdfUtils,
};
