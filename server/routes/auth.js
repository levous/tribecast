
const validator = require('validator');
const passport = require('passport');
const express = require('express');
const errors = require('../../shared-modules/http-errors');
const userController = require('../controllers/userController');
const sendmail = require('../modules/sendmail');
const communityDefaults = require('../../config/community-defaults');
const log = require('../modules/log')(module);

//TODO: Convert all to promises
//TODO: Move logic out of routes.  I like routes to be clean and simple.  Create controllers that do not care about pathing.  AuthController should return a Promise and that is all that should be handled here

exports.setup = function (basePath, app) {
  /**
   * Validate the sign up form
   *
   * @param {object} payload - the HTTP body message
   * @returns {object} The result of validation. Object contains a boolean validation result,
   *                   errors tips, and a global message for the whole form.
   */
  function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
      isFormValid = false;
      errors.email = 'Please provide a valid email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
      isFormValid = false;
      errors.password = 'Password must have at least 8 characters.';
    }

    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
      isFormValid = false;
      errors.name = 'Please provide your name.';
    }

    if (!isFormValid) {
      message = 'Check the form for errors.';
    }

    return {
      success: isFormValid,
      message,
      errors
    };
  }

  /**
   * Validate the login form
   *
   * @param {object} payload - the HTTP body message
   * @returns {object} The result of validation. Object contains a boolean validation result,
   *                   errors tips, and a global message for the whole form.
   */
  function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';

    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
      isFormValid = false;
      errors.email = 'Please provide your email address.';
    }

    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
      isFormValid = false;
      errors.password = 'Please provide your password.';
    }

    if (!isFormValid) {
      message = 'Unable to login.  Please review problems.';
    }

    return {
      success: isFormValid,
      message,
      errors
    };
  }

  const router = express.Router();

  router.post('/signup', (req, res, next) => {
    const validationResult = validateSignupForm(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
        errors: validationResult.errors
      });
    }


    return passport.authenticate('local-signup', (err, token, userData) => {
      if (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
          // the 11000 Mongo code is for a duplication email error
          // the 409 HTTP status code is for conflict error
          return res.status(409).json({
            success: false,
            message: 'Provided email already registered',
            errors: {
              email: 'This email is already taken.'
            }
          });
        }

        return res.status(400).json({
          success: false,
          message: 'Could not process the form.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You have successfully signed up!',
        token,
        user: userData
      });

    })(req, res, next);
  });

  router.post('/login', (req, res, next) => {
    const validationResult = validateLoginForm(req.body);
    if (!validationResult.success) {
      const error = new errors.BadRequestError(validationResult.message);
      //TODO: not using this and not sure we should.  Either implement a serialization strategy to send this to the client or remove
      error.errorFields = validationResult.errorFields;
      return next(error);
    }

    return passport.authenticate('local-login', (err, token, userData) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: 'You have successfully logged in!',
        token,
        user: userData
      });

    })(req, res, next);
  });

  /**
   * ForgotPassword - POST
   * @param {string} email - email address of user
   * @returns TODO:add proper docs
   */
  router.post('/forgot-password', (request, res, next) => {
    const email = request.body.email;
    const urlRoot = `${request.protocol}://${request.hostname}`;
    let username;
    let emailMarkedUndeliverable = false;
    userController.forgotPassword(email)
    .then(json => {
      // successful response means email was found
      username = json.userName;
      emailMarkedUndeliverable = json.undeliverable;

      const emailHtml = '<div style="border: 1px solid rgb(255, 255, 255); border-radius: 10px; margin: 20px; padding: 20px;">' +
          `<p>Dear ${json.userName},</p>` +
          `<p>A password reset was requested for ${communityDefaults.name}!  Please follow the <a href="${urlRoot}/forgot-password/${json.resetToken}">Reset Password Link</a> to create a new password.</p>` +
          `<p style="font-size:0.8em">(If you did not initiate this reset, you may disregard)</p>` +
          '<p style="padding-left: 300px;">Warm regards,</p>' +
          `<p style="padding-left: 300px;">${communityDefaults.fromEmail.name}</p>` +
          '</div>';

      log.info(`FORGOTPASSWORD success email \n     to: ${email}\n     body:${emailHtml}`);

      return sendmail(
        communityDefaults.fromEmail.address,
        communityDefaults.fromEmail.name,
        email,
        username,
        `${communityDefaults.name} Password Reset`,
        emailHtml
      );
    })
    .then(mailResponse => {
      let message = 'Password reset email sent successfully';
      if(emailMarkedUndeliverable) {
        message += '.  WARNING: the email address has been marked undeliverable.  Please contact support to investigate problems encountered sending to this email address.';
        log.warn(`Forgot password email to "${email}" attempted but email was previously marked undeliverable.`);
      }
      return res.json({status: mailResponse.status, username: username, message: message});
    })
    .catch(next);

  });

  /**
   * magiclink - POST
   * @param {string} email - email address of user
   * @returns TODO:add proper docs
   */
  router.post('/magiclink', (request, res, next) => {
    const email = request.body.email;
    const urlRoot = `${request.protocol}://${request.hostname}`;
    let username;
    let emailMarkedUndeliverable = false;
    userController.generateMagicLink(email)
    .then(json => {
      // successful response means email was found
      username = json.userName;
      emailMarkedUndeliverable = json.undeliverable;

      const emailHtml = '<div style="border: 1px solid rgb(255, 255, 255); border-radius: 10px; margin: 20px; padding: 20px;">' +
          `<p>Hi ${json.userName},</p>` +
          `<p>Here is your magic link for ${communityDefaults.name}!  It is for YOU, alone.  Please don't share or forward this.  It will log you in, <i>just.like.magic!</i> </p>` +
          `<p style="font-size:1.2em;margin:5px;"><a href="${urlRoot}/magiclink/${json.magicLinkToken}">Magic Link</a></p>` +
          `<p style="font-size:0.8em">(If you did not initiate this, you can probably ignore it.  It was sent only yo your email address)</p>` +
          '<p style="padding-left: 300px;">Warm regards,</p>' +
          `<p style="padding-left: 300px;">${communityDefaults.fromEmail.name}</p>` +
          '</div>';

      log.info(`MAGICLINK success email \n     to: ${email}\n     body:${emailHtml}`);

      return sendmail(
        communityDefaults.fromEmail.address,
        communityDefaults.fromEmail.name,
        email,
        username,
        `${communityDefaults.name} Magic Link`,
        emailHtml
      );
    })
    .then(mailResponse => {
      let message = 'Magic Link email sent successfully';
      if(emailMarkedUndeliverable) {
        message += '.  WARNING: the email address has been marked undeliverable.  Please contact support to investigate problems encountered sending to this email address.';
        log.warn(`Forgot password email to "${email}" attempted but email was previously marked undeliverable.`);
      }
      return res.json({status: mailResponse.status, username: username, message: message});
    })
    .catch(next);

  });

  /**
   * Invite - GET
   * @param {string} passwordResetToken - reset token generated by system
   * @returns TODO:add proper docs
   */
  router.get('/invite/:passwordResetToken', function(req, res, next){
    const passwordResetToken = req.params.passwordResetToken;

    userController.findByPasswordResetToken(passwordResetToken)
      .then(user => {
        if(!user) return next(new errors.ResourceNotFoundError('User for provided key not found'));

        res.status(200);
        const responseBody = {message: 'password reset token is valid'};
        return res.json(responseBody);
      })
      .catch(next);
  });

  router.post('/reset/:passwordResetToken', (req, res, next) => {

    const passwordResetToken = req.params.passwordResetToken;
    const newPassword = req.body.newPassword;

    if(!passwordResetToken || !passwordResetToken.length) return next(new errors.MissingParameterError('Missing required parameter "passwordResetToken"'));
    if(!newPassword || !newPassword.length) return next(new errors.MissingParameterError('Missing required parameter "newPassword"'));

    userController.updatePasswordUsingResetToken(passwordResetToken, newPassword)
      .then(user => {
        if(!user) return next(new errors.ResourceNotFoundError('User for provided key not found'));
        
        // add to the request so that passport will log me in
        req.body.email = user.email;
        req.body.password = newPassword;
        return passport.authenticate('local-login', (err, token, userData) => {
          if (err) {
            return next(err);
          }

          return res.status(200).json({
            success: true,
            message: 'Password reset successfully!',
            token,
            user: user
          });

        })(req, res, next);

      })
      .catch(next);
  });

  /**
   * magiclink - GET
   * @param {string} magicLinkToken - magic link token generated by system
   * @returns TODO:add proper docs
   */
  router.get('/magiclink/:magicLinkToken', function(req, res, next){
    
    return passport.authenticate('magic-link-login', (err, token, userData) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        success: true,
        message: 'You have successfully logged in!',
        token,
        user: userData
      });

    })(req, res, next);

  });


  app.use(basePath, router);
}
