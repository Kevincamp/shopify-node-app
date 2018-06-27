const express = require('express');
const router = express.Router();
const Utils = require('./../utils')

router.post('/create/orders', Utils.withWebhook((error, request) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log('We got a webhook!');
  console.log('Details: ', request.webhook);
  console.log('Body:', request.body);
}));

router.post('/quotes', (req, res) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log('We got a webhook!');
  console.log('Details: ', req.webhook);
  console.log('Body:', req.body);
  res.json({ code: 'OK', message: 'Success' })
});

module.exports = router;
