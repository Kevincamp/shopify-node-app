const express = require('express');
const ShopifyExpress = require('@shopify/shopify-express');
const { MemoryStrategy } = require('@shopify/shopify-express/strategies');
const ShopifyModel = require('./../models/shopify')

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
} = process.env;

const shopifyConfig = {
  host: SHOPIFY_APP_HOST,
  apiKey: SHOPIFY_APP_KEY,
  secret: SHOPIFY_APP_SECRET,
//  scope: ['read_orders, write_orders, write_products, write_shipping'],
  scope: ['write_shipping'],
  shopStore: new MemoryStrategy(),
  afterAuth(request, response) {
    console.log('request:',request.session)
    const { session: { accessToken, shop } } = request;

    ShopifyModel.createOrderWebHook(shopDomain, accessToken);
    ShopifyModel.getScopeList(shop, accessToken)
    ShopifyModel.getCarrierList(shop, accessToken)
    ShopifyModel.createShippifyFlex(shop, accessToken);
    ShopifyModel.removeShippifyFlex(shop, accessToken);
    ShopifyModel.getOrders(shop, accessToken);

    return response.redirect('/');
  },
};

// Create shopify middlewares and router
const shopify = ShopifyExpress(shopifyConfig);

// Mount Shopify Routes
const { routes, middleware } = shopify;
const { withShop, withWebhook } = middleware;


console.log('withShop:',withShop)


module.exports = {
  config : shopifyConfig,
  shopify : shopify,
  routes : routes,
  middleware : middleware,
  withShop : withShop,
  withWebhook : withWebhook
}
