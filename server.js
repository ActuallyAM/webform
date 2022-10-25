const express = require('express');
const app = express();

// Import multer
const multer = require('multer');

const nodemailer = require('nodemailer');
require('dotenv').config();
const PORT = process.env.PORT;

//  Middleware
app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// Multer file storage
const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './attachments');
  },
  filename: function (req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

// Middleware to get attachments
const attachmentUpload = multer({
  storage: Storage,
}).single('attachment');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/contactform.html');
});

app.post('/', (req, res) => {
  attachmentUpload(req, res, async function (error) {
    if (error) {
      console.log('Error uploading file');
    } else {
      console.log(req.body);
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      const mailOptions = {
        from: req.body.email,
        to: process.env.MAIL_TO,
        subject: req.body.subject,
        text: req.body.message,
        attachments: [
          {
            path: req.body.attachmentPath,
          },
        ],
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send('error');
        } else {
          console.log('Email sent: ' + info.response);
          res.send('success');
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
