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
      fee : '.00001',
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
      issuer : ''
    },
    order : {},
    step : 'preview',
    logged : '',
    isGuest : '',
    error : '',
    message : '',
    countDownMessage : '',
    fetchOrder : {},
    timeLeft : ''
  },
  created(){
    var prefix = this.$root
    var current_url = window.location.href;
    var url = new URL(current_url);
    var oId = url.searchParams.get("order");
    axios.get('http://sp.local/api/'+'orderDetails/'+oId).then(response => {
        this.$root.order = response.data.result[0]
        this.$root.active_currency.code = this.$root.order.orderCurrency['currency']
        this.$root.active_currency.issuer = this.$root.order.orderCurrency['issuer']
        this.$root.active_currency.rate = this.$root.order.orderCurrency['rate']
        this.$root.timeLeft = this.$root.order.expireIn
        })
        var minutes = 60 * 3,
        display = document.querySelector('#time');
        this.countDown(minutes, display);
        window.setInterval(() => {
          this.checkOrder()
      }, 1000);
  },
  methods: {
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
              prefix.countDownMessage = 'expired'
            }
          }
      }, 1000);
    },
    checkOrder(){
          var prefix = this.$root
      axios.get('http://sp.local/api/'+'orderDetails/'+this.$root.order.orderId).then(response => {
            prefix.fetchOrder = response.data.result[0]
            if(prefix.fetchOrder.isExpired == true && prefix.fetchOrder.orderStatus == false){
              prefix.countDownMessage = 'expired'
            } else if (prefix.fetchOrder.orderStatus == true){
              prefix.countDownMessage = 'paid'
            } else {
              console.log('Waiting for payment')
              console.log(prefix.fetchOrder.isExpired)
            }
          })
    }
    }
})
