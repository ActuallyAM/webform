const express = require('express');
const app = express();
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
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
      return res.send('Error uploading file');
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
        subject: process.env.MAIL_SUBJECT,
        text: `
        Ees- ja perekonnanimi: ${req.body.name} 
        E-post: ${req.body.email}
        Telefon: ${req.body.phone}
        Ametikoht: ${req.body.position}
        Ettepaneku/ kaebuse sisu (mis juhtus, millal juhtus) ja selgelt väljendatud nõue: ${req.body.message_1}
        Soovin jääda asutusesisese menetluse käigus anonüümseks: ${req.body.anonAnswer}
        `,
        attachments: [
          {
            path: req.file?.path,
          },
        ],
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.send('error');
        } else {
          res.send('success');
          // Delete file from the folder after sent
          fs.unlink(attachmentPath, function (err) {
            if (err) {
              return res.end(err);
            } else {
              console.log(attachmentPath + ' has been deleted');
              return res.redirect('/success.html');
            }
          });
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
