require('isomorphic-fetch');
require('dotenv').config();

const fs = require('fs');
const express = require('express');
const ShopifyExpress = require('@shopify/shopify-express');
const { MemoryStrategy } = require('@shopify/shopify-express/strategies');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const path = require('path');
const logger = require('morgan');
//const routerShippify = require('./routes/shippify');
const routerShopify = require('./routes/shopify');
const ShopifyModel = require('./models/shopify');

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
} = process.env;


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(
  session({
    store: new RedisStore(),
    secret: SHOPIFY_APP_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);


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


// Run webpack hot reloading in dev
const staticPath = path.resolve(__dirname, '../assets');
app.use('/assets', express.static(staticPath));

app.use('/', routerShopify)
app.use('/shopify', routes);
//app.use('/shippify', routerShippify)

// Error Handlers
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((error, request, response, next)=>{
  response.locals.message = error.message;
  response.locals.error = request.app.get('env') === 'development' ? error : {};

  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;
