import nodemailer = require('nodemailer');
import { applicationPassword, host, port, user } from './mailer.constants';

export const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    secure: true, // true for 465, false for other ports
    auth: {
      user: user, // generated ethereal user
      pass: applicationPassword, // generated ethereal password
    },
  });
