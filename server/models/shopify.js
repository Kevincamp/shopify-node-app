const ShopifyAPIClient = require('shopify-api-node');

const {
  SHOPIFY_APP_KEY,
  SHOPIFY_APP_HOST,
  SHOPIFY_APP_SECRET,
  NODE_ENV,
} = process.env;

class Shopify {

  static getScopeList(shopDomain, accessToken, cb){
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    shopifyApi.accessScope.list()
    .then(data => {
      console.log(data)
      if(cb) return cb(null, data)
    })
    .catch(error => {
      console.error(error)
      if(cb) return cb(error)
    });
  }

  static getCarrierList(shopDomain, accessToken, cb){
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    shopifyApi.carrierService.list()
    .then(data => {
      console.log(data)
      if(cb) return cb(null, data)
    })
    .catch(error => {
      console.error(error)
      if(cb) return cb(error)
    });
  }

  static createShippifyFlex(shopDomain, accessToken, cb) {
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    const callbackUrl = `${SHOPIFY_APP_HOST}/quotes`
    const name = 'Shippify Flex'
    Shopify.getCarrierList(shopDomain, accessToken, (error, data)=>{
      if(error) {
        if(cb)return cb(error)
        return
      }
      const carrier = data.find((item)=>{
        return item.name.trim() === name.trim()
      })
      if(carrier){
        if(cb)return cb(null, carrier)
        return
      }
      const params = {
          "name": name,
          "callback_url": callbackUrl,
          "service_discovery": true
      }
      shopifyApi.carrierService.create(params)
      .then(data => {
        console.log(data)
        if(cb) return cb(null, data)
      })
      .catch(error => {
        console.error(error)
        if(cb) return cb(error)
      });
    })

  }

  static removeShippifyFlex(shopDomain, accessToken, cb) {
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    const name = 'Shippify Flex'
    Shopify.getCarrierList(shopDomain, accessToken, (error, data)=>{
      if(error) {
        if(cb)return cb(error)
        return
      }
      const carrier = data.find((item)=>{
        return item.name.trim() === name.trim()
      })
      if(carrier){
        return shopifyApi.carrierService.delete(carrier.id)
        .then(data => {
          console.log(data)
          if(cb) return cb(null, data)
        })
        .catch(error => {
          console.error(error)
          if(cb) return cb(error)
        });
      }
      if(cb)
      return cb(null)
    })
  }


  static registerWebhook(shopDomain, accessToken, webhook, cb) {
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    shopifyApi.webhook.create(webhook)
    .then(data =>{
      console.log(data)
      if(cb) return cb(null, data)
    })
    .catch(error => {
      console.log(`Error creating webhook '${webhook.topic}'. ${JSON.stringify(error.response.body)}`)
      if(cb) return cb(error)
    });
  }

  static createOrderWebHook(shopDomain, accessToken, cb){
    Shopify.registerWebhook(shopDomain, accessToken, {
      topic: 'orders/create',
      address: `${SHOPIFY_APP_HOST}/create/order`,
      format: 'json'
    }, (error, data)=>{
      if(error){
        console.log(error)
        if(cb) return cb(error)
        return
      }
      console.log(data)
      if(cb) return cb(null, data)
    })
  }

  static getOrders(shopDomain, accessToken, cb) {
    const shopifyApi = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    shopifyApi.order.list({ limit: 5 })
    .then(data =>{
      console.log(data)
      if(cb) return cb(null, data)
    })
    .catch(error => {
      if(cb) return cb(error)
    });
  }

}

module.exports = Shopify
