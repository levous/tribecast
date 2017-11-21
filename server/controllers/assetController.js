const aws = require('aws-sdk');
const S3Publisher = require('../modules/S3Publisher');

exports.publishMemberProfilePhoto = (member, photo) => {
  const originalName = photo.originalname;
  const fileName = `${(member.firstName || 'profile')}-${(member.lastName || 'photo')}.png`;
  const s3Pub = new S3Publisher();
  const folderPath = `members/${member._id}`;
  return s3Pub.publishAsset(fileName, photo, folderPath);
}
