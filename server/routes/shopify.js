const express = require('express');
const router = express.Router();
const Utils = require('./../utils')

router.get('/install', (req, res) => {
   return res.render('install');
})

// Client View Inside the app
router.get('/', Utils.withShop({authBaseUrl: '/shopify'}), (req, res) => {
  console.log('withWebhook',Utils.withWebhook)
  const { session: { shop, accessToken } } = req;

  res.render('app', {
    title: 'Shippify-Deliveries',
    apiKey: shopifyConfig.apiKey,
    shop: shop,
  });
});

module.exports = router;
