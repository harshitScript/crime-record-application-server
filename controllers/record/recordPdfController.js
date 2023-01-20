const Record = require("../../models/record");
const PDFDocument = require("pdfkit");

const recordPdfController = async (req, res, next) => {
  const { recordId } = req.params;

  try {
    const record = await Record.findById(recordId);
    if (!record) {
      const error = new Error("Record not found.");
      throw error;
    }

    const pdfStream = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment;filename:${recordId}.pdf`);
    pdfStream.pipe(res);

    pdfStream.fontSize(30).text("Hajkhxdajlaskaksalsak");

    return 1;
  } catch (error) {
    next(error);
    return 1;
  }
};
module.exports = recordPdfController;
