const Record = require("../../models/record");
const pdf = require("html-pdf");
const prepareRecordPdfHTML = require("../../PDF-HTML/record-pdf");
const path = require("path");
const rootDir = require("../../utils/rootDir");

const recordPdfController = async (req, res, next) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record not found.");
      throw error;
    }

    let options = {
      format: "A4",
      orientation: "portrait",
      phantomPath: path.join(
        rootDir,
        "node_modules",
        "phantomjs-prebuilt",
        "bin",
        "phantomjs"
      ),
      border: {
        top: "1cm", // default is 0, units: mm, cm, in, px
        right: "2cm",
        bottom: "1cm",
        left: "1cm",
      },
    };

    pdf
      .create(prepareRecordPdfHTML(record, options))
      .toStream(function (err, pdfStream) {
        if (err) {
          throw err;
        }
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline;filename=test.pdf");
        pdfStream.on("end", () => {
          res.end();
        });
        pdfStream.pipe(res);
      });

    return 1;
  } catch (error) {
    next(error);
    return 1;
  }
};
module.exports = recordPdfController;
