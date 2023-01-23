const path = require("path");
const rootDir = require("../utils/rootDir");

const recordPDFTemplate = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CRIMINAL RECORD</title>
    <style>
      .crimes-table {
        width: 100%;
      }
      .crimes-table th {
        text-align: center;
        font-size: 12px;
        border-bottom: 1px solid black;
      }
      .crimes-table td {
        text-align: center;
        font-size: 10px;
        border-bottom: 0.5px solid grey;
      }
    </style>
  </head>
  <body>
    <h1
      style="
        text-align: center;
        text-decoration: underline;
        font-size: 30px;
        margin: unset;
        text-transform: uppercase;
      "
    >
    CRIMINAL RECORD
    </h1>
    <h3 style="text-align: center; font-size: 20px; margin: unset">
      %recordName%
    </h3>
    <p style="text-align: center; font-size: 10px; margin: unset">
      UID: %uid%
    </p>
    <table style="width: 100%">
      <tr>
        <td style="text-align: left; width: 50%; font-size: 12px">
          %mobile%
        </th>
        <td style="text-align: right; width: 50%; font-size: 12px">
          %cityAndState%
        </td>
      </tr>
      <tr>
        <td style="text-align: center; width: 50%">
          <img
            src="%front-image%"
            alt="front"
            width="150px"
            height="150px"
          />
        </td>
        <td style="text-align: center; width: 50%">
          <img
            src="%side-image%"
            alt="side"
            width="150px"
            height="150px"
          />
        </td>
      </tr>
    </table>
    <div>
      <h4
        style="
          text-align: center;
          text-decoration: underline;
          font-size: 35px;
          margin: 5px 0;
        "
      >
        Crimes
      </h4>
      <table class="crimes-table">
        <tr>
          <th>S.no.</th>
          <th>City</th>
          <th>State</th>
          <th>Date & Time</th>
          <th>Description</th>
        </tr>
        %crimes%
      </table>
    </div>
  </body>
</html>
`;

const prepareRecordPdfHTML = (record = {}) => {
  const resultHTML = recordPDFTemplate
    .replace("%recordName%", record?.name)
    .replace("%uid%", record?._id)
    .replace("%mobile%", record?.mobile)
    .replace("%cityAndState%", `${record?.city}, ${record?.state}`)
    .replace(
      "%front-image%",
      record?.imageData?.urls?.front ||
        path.join(rootDir, "assets", "utils", "record-generic-image.jpeg")
    )
    .replace(
      "%side-image%",
      record?.imageData?.urls?.front ||
        path.join(rootDir, "assets", "utils", "record-generic-image.jpeg")
    )
    .replace(
      "%crimes%",
      record?.crimes
        .map(
          (crime, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${crime?.place?.city}</td>
          <td>${crime?.place?.state}</td>
          <td>${crime?.dateAndTime}</td>
          <td>${crime?.description}</td>
        </tr>
    `
        )
        ?.join("")
    );
  return resultHTML;
};

module.exports = prepareRecordPdfHTML;
