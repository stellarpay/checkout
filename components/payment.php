<body style="background:#1f3543 !important">
<div id="app"></br>
<div class="container col-sm-3" role="main">
  <div class="row">
      <div class="panel panel-default box-shadow">
        <div class="panel-body">
      <section class="payment-form dark" style="border-radius:5px">
        <br>
        <center>
        <img v-bind:src="merchant.image" style="width:110px">
        </br>
        </br>Payment to <b>{{ merchant.name }}</b>
        </center>
        <hr>
        <body>
              <div class="container" v-show="step == 'preview' && countDownMessage == ''">
                <form>
                  <div class="products">
                    <h3 class="title">Checkout</h3>
                    <div class="item">
                      <span class="price">{{ payment.amount }} XLM</span>
                      <p class="item-name">{{ item.name }}</p>
                      <p class="item-description">{{ payment.description }}</p>
                      <p class="item-description" v-if="payment.description == '' || payment.description == undefined">Payment</p>
                    </div>
                    <div class="item">
                      <span class="price">{{ payment.fee }} XLM</span>
                      <p class="item-name">Fees</p>
                        <p class="item-description">Stellar network transaction fee</p>
                    </div>
                    <div class="total">Total<span class="price">{{ payment.amount }} XLM</span></div>
                  </div>
                  <div class="card-details"><br>
                    <h3 class="title">Payment Methods</h3>
                    <div class="row" v-if="logged==0">
                      <div v-if="error" class="alert alert-danger alert-dismissable">
                          {{ error }}
                      </div>
                      <div v-if="message" class="alert alert-success alert-dismissable">
                          {{ message }}
                      </div>
                      <div class="form-group col-sm-12">
                      <center>
                        <div class="generated_icon" @click="selectAsset('XLM')">XLM</div>
                        <div class="generated_icon" v-for="asset in merchant.acceptedCurrencies" v-if="asset.asset_code != native" @click="selectAsset(asset.asset_code)">{{ asset.asset_code }}</div>
                      </center>
                      <center>
                        <p v-if="active_currency.code != '' && active_currency.code != 'native'" style="font-size:18px">
                        <br>
                        The asset automatically converted to XLM by merchant's rates.
                        Accepting pay <b>{{ active_currency.calculated }} {{ active_currency.code }}</b> to finish order.
                        <br>
                        <p v-if="active_currency.code != '' && active_currency.code != 'native'" style="font-size:12px">
                          Conversion rate : {{ active_currency.rate }} per XLM
                          <br>
                          Issuer of asset : {{ shortIt(active_currency.issuer,15) }}
                      </p>
                      <p v-if="active_currency.code == 'native'" style="font-size:18px">
                      <br>
                      Need to pay <b>{{ payment.amount }} XLM</b> to finish order.
                    </p>
                      </center>
                        </div>
                      <div class="form-group col-sm-12">
                        <button type="button" class="btn btn-primary btn-block" @click="createOrder()">Continue Payment</button>
                        </div>
                        <div class="form-group col-sm-9">
                      <a :href="merchant.cancel">Return merchant's site</a>
                    </div>
                    </div>
                  </div>
                </form>
              </div>


              <div class="container" v-show="step == 'order' && countDownMessage == ''">
                <form>
                  <div class="card-details">
                    <h3 class="title"><i class="fa fa-spinner fa-spin" style="font-size:20px"></i> Payment Waiting | <span id="time">05:00</span></h3>
                    <div class="row">
                      <div class="form-group col-sm-15">
                        <p>
                        <center><img :src="'https://chart.googleapis.com/chart?chs=120x120&chld=M%7C0&cht=qr&chl='+''+order.paymentAddress"></center>
                        <br>
                        <center>
                        <h3 style="font-size:20px" v-show="active_currency.code == 'native'">To pay send {{ (order.orderAmount) }} XLM to the address below</h3>
                        <h3 style="font-size:20px" v-show="active_currency.code != 'native'">To pay send {{ (order.orderAmount) }} {{ active_currency.code }} to the address below</h3>
                        <div class="publicButton">{{ order.paymentAddress }}
                        </div>
                        <br>
                        <small v-if="active_currency.code != 'native'">*Issuer of {{ active_currency.code }} : <b>[{{ shortIt(active_currency.issuer,15) }}]<b><br><br></small>
                        <h3 style="font-size:20px">with MEMO Text</h3>
                          <div class="publicButton">{{ order.memo }}
                          </div>
                        </p></center>
                      </div>
                    </div>
                    <a :href="merchant.cancel">Return merchant's site</a>
                  </div>
                </form>
              </div>

              <div class="container" v-show="countDownMessage == 'expired'">
                  <div class="card-details">
                    <center>
                    <i class="fa fa-exclamation-triangle" style="font-size:80px;color:red"></i>
                    <br><br>
                    <h3 style="font-size:25px">It looks like you weren’t to complete a transaction in time.
                    <br><br>
                    If you believe there’s been a mistake, please contact us at <b>support@stellarpay.io</b> with the following order code:
                    <b>{{ fetchOrder.orderId }}</b></h3>
                    <br>
                    <div class="form-group col-sm-9">
                  <a :href="merchant.cancel">Return merchant's site</a>
                </div>
                  </center>
                  </div>
              </div>

              <div class="container" v-show="countDownMessage == 'paid'">
                  <div class="card-details">
                    <center>
                    <i class="fa fa-check" style="font-size:80px;color:green"></i>
                    <br><br>
                    <h3 style="font-size:35px">ORDER SUCCESSFULLY PAID</h3>
                    <br>
                    <h4><a :href="'http://stellarchain.io/tx/' + fetchOrder.transactionId" target="_blank" style="font-size:13px;color:grey">Check Transaction</a></h4>
                    <div class="form-group col-sm-9">
                  <a :href="'http://' + merchant.success" >Return merchant's site</a>
                </div>
                  </center>
                  </div>
              </div>

            </section>
          </main>
        </body>
  </div>
</div>
</div>
<br>
<center>
<span style="color:white;font-weight:300;font-size:25px">StellarPay</span>
<span style="color:white;font-weight:300;font-size:12px">/checkout</span>
</center>
</div>
</div>
