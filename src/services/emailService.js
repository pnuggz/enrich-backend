import EmailModel from "../models/emailModel";

const send = (req, emailData, templateId) => {
  return EmailModel.send(req, emailData, templateId);
};

const EmailService = {
  send: send
};

export default EmailService;
