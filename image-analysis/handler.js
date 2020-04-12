'use strict';
const { promises: { readFile } } = require('fs');

class Handler {
  constructor({ rekoSvc }) {
    this.rekoSvc = rekoSvc;
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc.detectLabels({
      Image: { 
        Bytes: buffer
      }
    }).promise();

    const workingItems = result.Labels
      .filter(({ Confidence }) => Confidence > 80);

    const names = workingItems
      .map(({ Name }) => Name)
      .join(' and ');
  }

  async main(event) {
    try {
      const imgBuffer = await readFile('./images/cat.jpg');
      this.detectImageLabels(imgBuffer);
      return {
        statusCode: 200,
        body: 'Hello!'
      }
    } catch (error) {
      console.log('Error***', error.stack);
      return {
        statusCode: 500,
        body: 'Internal server error'
      }
    }
  }
}

//factory
const aws = require('aws-sdk');
const rekognition = new aws.Rekognition();
const handler = new Handler({
  rekoSvc: rekognition
});

module.exports.main = handler.main.bind(handler);