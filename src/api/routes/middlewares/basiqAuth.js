import fetch from "node-fetch"

import config from "../../../config/index.js"

const basiqConfig = config.basiq;

const basiqAuth = (req, res, next) => {
  const accessToken = basiqConfig.accessToken;
  const url = "https://au-api.basiq.io/token";
  const headers = {
    Authorization: `Basic ${accessToken}`,
    "Content-Type": `application/x-www-form-urlencoded`,
    "basiq-version": `2.0`
  };

  try {
    fetch(url, {
      method: "POST",
      headers: headers
    })
      .then(basiqResponse => {
        if (basiqResponse.status !== 200) {
          //LOGGER IT
          next();
        }
        return basiqResponse.json();
      })
      .then(basiqData => {
        req.basiq = {
          status: 200,
          accessToken: basiqData.access_token
        };
        next();
      })
      .catch(err => {
        //LOGGER IT
        console.log(err);
        next();
      });
  } catch (err) {
    console.log(err);
    const data = {
      status: {
        code: 401,
        error: err,
        msg: "Basiq error."
      }
    };
    res.status(401).json(data);
  }
};

export default basiqAuth;
