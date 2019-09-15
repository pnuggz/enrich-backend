import EmailModel from "../models/emailModel";

const send = (req, emailData, templateId) => {
  EmailModel.send(req, emailData, templateId);
};

const EmailService = {
  send: send
};

export default EmailService;
