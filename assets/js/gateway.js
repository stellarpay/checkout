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
    api_server : 'https://api.stellarpay.io',
  },
  created(){
    var prefix = this.$root
    var current_url = window.location.href;
    var url = new URL(current_url);
    var merchant = url.searchParams.get("merchant");
    prefix.payment.description = url.searchParams.get("description");
    this.$root.payment.amount = url.searchParams.get("amount");
    prefix.payment.sum = prefix.payment.amount + prefix.payment.fee
    axios.get(prefix.api_server+'/api/merchantDetails/'+merchant).then(response => {
        this.$root.merchant.name = response.data.result[0].merchantLabel
        this.$root.merchant.id = response.data.result[0].merchantId
        this.$root.merchant.image = response.data.result[0].merchantLogo
        this.$root.merchant.success = response.data.result[0].successUrl
        this.$root.merchant.cancel = response.data.result[0].cancelUrl
        this.$root.merchant.acceptedCurrencies = JSON.parse(response.data.result[0].acceptedCurrencies)
        })
  },
  mounted(){
    $(".generated_icon").click(function(){
        $(".generated_icon").removeClass("active");
        $(this).addClass("active");
    });
  },
  methods: {
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
        this.$root.active_currency.calculated = (this.$root.payment.amount * this.$root.merchant.acceptedCurrencies[asset]['rate']).toFixed(7)
      }
      this.$forceUpdate()
    },
    createOrder(){
      var prefix = this.$root
        if(prefix.active_currency.code == 'XLM' || prefix.active_currency.code == ''){
          prefix.active_currency.code = 'native'
        }
        axios.get(prefix.api_server+'/api/gateway/' , { params: { key: prefix.merchant.id, amount : prefix.payment.amount, currency : prefix.active_currency.code, description : prefix.payment.description } }).then(response => {
              this.$root.order = response.data
              this.$root.step = 'order'
              var minutes = 60 * 5,
              display = document.querySelector('#time');
              this.countDown(minutes, display);
              if(prefix.countDownMessage == ''){
                window.setInterval(() => {
                  this.checkOrder()
              }, 1500);
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
    checkOrder(){
          var prefix = this.$root
      axios.get(prefix.api_server+'/api/orderDetails/'+this.$root.order.orderId).then(response => {
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
