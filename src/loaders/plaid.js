import plaid from "plaid";

import config from "../config/index";

const plaidConfig = config.plaid;

const plaidClient = new plaid.Client(
  plaidConfig.clientId,
  plaidConfig.secretKey,
  plaidConfig.publicKey,
  plaid.environments.development,
  {
    version: plaidConfig.version
  }
);

export const Plaid = () => {
  return plaidClient;
};
