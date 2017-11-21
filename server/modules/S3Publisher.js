const AWS = require('aws-sdk');
const config = require('config');
const path = require('path');
const log = require('./log')(module);

class S3Publisher {

  constructor() {
    AWS.config.update({
      accessKeyId: config.get('aws.S3_key'),
      secretAccessKey: config.get('aws.S3_secret'),
      subregion: config.get('aws.region'),
    });
  }

  publishAsset(fileName, file, folderPath) {
    let key;
    const s3 = new AWS.S3()
    const bucketName = config.get('aws.assetBucket');
    const cloudfrontBaseURL = config.get('aws.cloudfrontBaseURL');
    return s3.listObjects({
      Bucket: bucketName,
      Prefix: folderPath
    }).promise()
      .then(data => {
        key = path.join(folderPath, fileName);
        const keys = data.Contents.map(item => item.Key);
        // version filename by iterating through indexer if existing file found
        let incrementer = 2;
        while(keys.includes(key)){
          log.info('path parse:', key);
          const keyPath = path.parse(key);
          let name = keyPath.name;
          // check for previous versioning
          log.info('/-[0-9]+$/g.test(',name,')', /-[0-9]+$/g.test(name));
          if(/-[0-9]+$/g.test(name)){
            name = name.substring(0, name.lastIndexOf('-'));
          }
          const newKeyFileName = `${name}-${incrementer++}${keyPath.ext}`;
          key = path.join(keyPath.dir, newKeyFileName);
        }
        return;
      })
      .then(() => {
        log.info('S3Publisher publishing file to bucket:', bucketName, ' using key:', key);
        return s3.putObject({
          Bucket: bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read', // your permisions
        }).promise()
      })
      .then(()=>{
        const assetPath = '//' + path.join(cloudfrontBaseURL, key);
        return assetPath;
      });
   }
 }

module.exports = S3Publisher;
