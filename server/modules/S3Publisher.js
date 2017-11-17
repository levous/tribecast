const AWS = require('aws-sdk');
const config = require('config');
const path = require('path');
class S3Publisher {

  constructor() {
    AWS.config.update({
      accessKeyId: config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: config.get('AWS_SECRET_ACCESS_KEY'),
      subregion: config.get('aws.region'),
    });
  }

  publishAsset(fileName, file) {

    const s3 = new AWS.S3()
    const bucketName = config.get('aws.assetBucket');
    const cloudfrontBaseURL = config.get('aws.cloudfrontBaseURL');
    //console.log(file);
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // your permisions
      }, (err) => {
        if (err) return reject(err);
        //const assetPath = `http://${bucketName}.s3.amazonaws.com/${fileName}`
        const assetPath = '//' + path.join(cloudfrontBaseURL, fileName);
        resolve(assetPath);
      });
    });

   }
 }

module.exports = S3Publisher;
