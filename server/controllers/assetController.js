const aws = require('aws-sdk');
const S3Publisher = require('../modules/S3Publisher');

exports.publishMemberProfilePhoto = (memberId, photo) => {
  const originalName = photo.originalname;
  const fileName = `${memberId}.png`;
  const s3Pub = new S3Publisher();
  debugger;
  return s3Pub.publishAsset(fileName, photo);

  return new Promise( (resolve, reject) => {
    resolve('https://tribecast.herokuapp.com/images/help-image.jpg')
  });
}
