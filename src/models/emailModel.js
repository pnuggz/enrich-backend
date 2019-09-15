import sgMail from "@sendgrid/mail";

import { Connection } from "../loaders/mysql";
import config from "../config/index";

const sendgridConfig = config.sendgrid;

const send = async (req, emailData, templateId) => {
  const sgTemplateQueryResult = await getSendgridTemplateId(templateId);
  const sgTemplateId = sgTemplateQueryResult.sendgrid_template_id;

  emailData.templateId = sgTemplateId;

  try {
    sgMail.setApiKey(sendgridConfig.apiKey);
    sgMail.send(emailData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(error);
  }
};

const getSendgridTemplateId = async templateId => {
  const queryString = `SELECT * FROM email_templates WHERE email_templates.id = ${templateId}`;

  try {
    const [rows, fields] = await Connection().query(queryString);
    return rows[0];
  } catch (err) {
    console.log(err);
    return;
  }
};

const EmailModel = {
  send: send
};

export default EmailModel;
