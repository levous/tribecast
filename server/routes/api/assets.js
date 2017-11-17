const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const config = require('config');
const errors = require('../../../shared-modules/http-errors');
const assetController = require('../../controllers/assetController');
const log = require('../../modules/log')(module);

exports.setup = (basePath, app) => {
  const router = express.Router();

  const upload = multer({
    storage: multer.memoryStorage(),
    // file size limitation in bytes
    limits: { fileSize: 52428800 },
  });


  /**
   * Post an image to use as a member profile photo
   * @param String memberId - id of the Member record
   * @param File photo - photo file of the Member
   * @returns "200 Success" upon successful save
   */
  router.post('/publish-member-profile-photo', upload.single('profile-photo'), (req, res, next) => {

    assetController.publishMemberProfilePhoto('tryme', req.file)
    .then(result => {
      res.json({imageURL:result});
    })
    .catch(next);
  });

  app.use(basePath, router);
};
