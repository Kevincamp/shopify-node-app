
class Shopify {

  static createShippifyFlex(shopDomain, accessToken, cb) {
    const shopify = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    const callbackUrl = `${SHOPIFY_APP_HOST}/quotes`
    shopify.carrierService.create({
        "name": "Shippify Flex",
        "callback_url": callbackUrl,
        "format": "json",
        "service_discovery": true
    })
    .then(data => {
      if(cb) return cb(null, data)
    })
    .catch(error => {
      console.error(error)
      if(cb) return cb(error)
    });
  }

  static removeShippifyFlex(shopDomain, accessToken, cb) {
    const shopify = new ShopifyAPIClient({ shopName: shopDomain, accessToken: accessToken });
    const callbackUrl = `${SHOPIFY_APP_HOST}/quotes`
    shopify.carrierService.delete({
        "name": "Shippify Flex",
        "callback_url": callbackUrl,
        "format": "json",
        "service_discovery": true
    })
    .then(data => {
      if(cb) return cb(null, data)
    })
    .catch(error => {
      console.error(error)
      if(cb) return cb(error)
    });
  }

}
module.exports = Shopify
