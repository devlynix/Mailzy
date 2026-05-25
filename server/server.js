require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const XLSX = require("xlsx");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/",
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post(
  "/api/send-emails",
  upload.single("file"),
  async (req, res) => {
    try {

      const workbook = XLSX.readFile(
        req.file.path
      );

      const sheetName =
        workbook.SheetNames[0];

      const users =
        XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );

      const { subject, message } =
        req.body;

      let sent = 0;

      for (const user of users) {

        const personalizedMessage =
          message.replace(
            "{{name}}",
            user.Name
          );

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.Email,
          subject,
          text: personalizedMessage,
        });

        sent++;
      }

      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        message: `${sent} emails sent successfully`
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});