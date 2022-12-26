const axios = require("axios");

const findPinCodeDataController = async (req, res, next) => {
  const { pinCode } = req.body;

  const options = {
    method: "GET",
    url: `https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/${pinCode}`,
    headers: {
      "X-RapidAPI-Key": "0de8430adamsh383777093d30631p182040jsn26cf6110ca4d",
      "X-RapidAPI-Host":
        "india-pincode-with-latitude-and-longitude.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    res.json({
      city: response?.data?.[0]?.district,
      state: response?.data?.[0]?.state,
      pinCode: pinCode,
    });
    return 1;
  } catch (error) {
    next(error);
    return 0;
  }
};

module.exports = findPinCodeDataController;
