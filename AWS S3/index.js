require('dotenv').config()
const AWS = require('aws-sdk')
const fs = require('fs')

let s3bucket = new AWS.S3({
  accessKeyId: process.env.IAM_USER_KEY,
  secretAccessKey: process.env.IAM_USER_SECRET,
})

const main = async () => {
  let contentfile

  try {
    const data = fs.readFileSync('./fileImagem2.txt')
    contentfile = data
  } catch (err) {
    console.error(err)
  }

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: 'teste3.txt',
    Body: contentfile,
  }

  s3bucket.upload(params, function (s3Err, data) {
    if (s3Err) throw s3Err
    console.log(`File uploaded successfully at ${data.Location}`)
  })
}

main()
