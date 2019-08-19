var app = new Vue({
  el: '#app',
  data: {
    payment : {
      id : '',
      success : '',
      cancel : '',
      amount : '',
      currency : '',
      description : '',
      rate : '',
      fee : '0.00001',
    },
    user : {},
    item : {
      name : ''
    },
    merchant : {
      name : '',
      id : '',
      image : '',
      acceptedCurrencies : {}
    },
    login : {
      username : '',
      password : ''
    },
    active_currency : {
      code : '',
      rate : '',
      issuer : '',
      calculated : ''
    },
    order : {},
    step : 'preview',
    logged : '',
    isGuest : '',
    error : '',
    message : '',
    countDownMessage : '',
    fetchOrder : {},
    shopifyOrderId : '',
    api_server : 'https://api.stellarpay.io',
    usdxlm: 0.1
  },
  created(){
    var prefix = this.$root
    var current_url = window.location.href;
    var url = new URL(current_url);
    var merchant = url.searchParams.get("merchant");
    prefix.payment.description = url.searchParams.get("description");
    this.$root.payment.amount = url.searchParams.get("amount");
    prefix.shopifyOrderId = url.searchParams.get("order_id");
    prefix.payment.sum = prefix.payment.amount + prefix.payment.fee
    axios.get(prefix.api_server+'/api/merchantDetails/'+merchant).then(response => {
        this.$root.merchant.name = response.data.result[0].merchantLabel
        this.$root.merchant.id = response.data.result[0].merchantId
        this.$root.merchant.image = response.data.result[0].merchantLogo
        this.$root.merchant.success = response.data.result[0].successUrl
        this.$root.merchant.cancel = response.data.result[0].cancelUrl
        this.$root.merchant.acceptedCurrencies = JSON.parse(response.data.result[0].acceptedCurrencies)
        })

    this.checkUSDXLM();
    this.checkShopifyStatus();
  },
  mounted(){
    $(".generated_icon").click(function(){
        $(".generated_icon").removeClass("active");
        $(this).addClass("active");
    });
  },
  methods: {
    checkUSDXLM(){
          var prefix = this.$root
      axios.get(prefix.api_server+'/api/prices/').then(response => {
            prefix.usdxlm = response.data.USD_XLM
            prefix.usdxlm -= response.data.USD_XLM*(5/100);
            console.log(prefix.usdxlm)
          })
    },
    selectAsset(asset){
      $(".generated_icon").click(function(){
          $(".generated_icon").removeClass("active");
          $(this).addClass("active");
      });
      if(asset == 'XLM'){
        this.$root.active_currency.code = 'native'
        this.$root.active_currency.rate = this.$root.payment.amount
      } else {
        this.$root.active_currency.code = asset
        this.$root.active_currency.issuer = this.$root.merchant.acceptedCurrencies[asset]['issuer']
        this.$root.active_currency.rate = this.$root.merchant.acceptedCurrencies[asset]['rate']
        this.$root.active_currency.calculated = ( (this.$root.payment.amount / this.$root.usdxlm) / this.$root.merchant.acceptedCurrencies[asset]['rate']).toFixed(7)
      }
      this.$forceUpdate()
    },
    createOrder(){
      var prefix = this.$root
        if(prefix.active_currency.code == 'XLM' || prefix.active_currency.code == ''){
          prefix.active_currency.code = 'native'
        }
        axios.get(prefix.api_server+'/api/shopify_gateway/' , { params: { key: prefix.merchant.id, description : prefix.payment.description, currency : prefix.active_currency.code, order_id : prefix.shopifyOrderId } }).then(response => {
              if(response.data.error == 'Invalid Request!'){
                this.$root.error = 'Invalid payment request. You need to create new order from merchant`s site!'
              } else {
                this.$root.order = response.data
                this.$root.step = 'order'
                var minutes = 60 * 60,
                display = document.querySelector('#time');
                this.countDown(minutes, display);
                if(prefix.countDownMessage == ''){
                  window.setInterval(() => {
                    this.checkOrder()
                }, 7500);
                }
              }
            })
    },
    countDown(duration, display){
      var timer = duration, minutes, seconds;
      var current = this
      var prefix = this.$root
      setInterval(function () {
          minutes = parseInt(timer / 60, 10)
          seconds = parseInt(timer % 60, 10);

          minutes = minutes < 10 ? "0" + minutes : minutes;
          seconds = seconds < 10 ? "0" + seconds : seconds;

          display.textContent = minutes + ":" + seconds;

          if (--timer < 0) {
            if(prefix.fetchOrder.isExpired == true && prefix.fetchOrder.orderStatus == false){
              //prefix.countDownMessage = 'expired'
            }
          }
      }, 1000);
    },
    shortIt(string,length){
      var maxLength = length;
      var result = string.substring(0, maxLength) + '...';
      return result
    },
    checkShopifyStatus(){
          var prefix = this.$root
      axios.get(prefix.api_server+'/api/isProcessedOnShopify/'+prefix.shopifyOrderId).then(response => {
            prefix.fetchOrder = response.data.result[0]
            if(prefix.fetchOrder.isExpired == true && prefix.fetchOrder.orderStatus == false){
              prefix.countDownMessage = 'expired'
            } else if (prefix.fetchOrder.orderStatus == true){
              prefix.countDownMessage = 'paid'
            } else {
              console.log('Waiting for payment')
            }
          })
    },
    checkOrder(){
          var prefix = this.$root
      axios.get(prefix.api_server+'/api/isProcessedOnShopify/'+prefix.shopifyOrderId).then(response => {
            prefix.fetchOrder = response.data.result[0]
            if(prefix.fetchOrder.isExpired == true && prefix.fetchOrder.orderStatus == false){
              prefix.countDownMessage = 'expired'
            } else if (prefix.fetchOrder.orderStatus == true){
              prefix.countDownMessage = 'paid'
            } else {
              console.log('Waiting for payment')
            }
          })
    },
    }
})
