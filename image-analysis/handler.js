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

    return { names, workingItems };
  }

  async main(event) {
    try {
      const imgBuffer = await readFile('./images/cat.jpg');
      const { names, workingItems } = await this.detectImageLabels(imgBuffer);
      console.log({ names, workingItems });
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