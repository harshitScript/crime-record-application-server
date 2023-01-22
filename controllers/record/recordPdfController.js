const Record = require("../../models/record");
const path = require("path");
const rootDir = require("../../utils/rootDir");
const prepareRecordPdfHTML = require("../../PDF-HTML/record-pdf");
const { pdfUtils } = require("../../utils/helper");
const fs = require("fs");

const recordPdfController = async (req, res, next) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record not found.");
      throw error;
    }

    //* PDF FUNCTIONALITY
    const pdfPath = path.join(
      rootDir,
      "assets",
      "pdf",
      `record_${record?._id}.pdf`
    );
    const pdfContent = prepareRecordPdfHTML(record);
    await pdfUtils.generate({ path: pdfPath, htmlString: pdfContent });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline:filename=record_${record?._id}.pdf`
    );
    const pdfStream = fs.createReadStream(pdfPath);
    pdfStream.pipe(res);
    pdfStream.on("end", () => {
      //? will delete the pdf in background.
      res.end();
      pdfUtils.delete({ path: pdfPath });
    });

    return 1;
  } catch (error) {
    next(error);
    return 1;
  }
};
module.exports = recordPdfController;
