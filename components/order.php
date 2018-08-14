<body style="background:#1f3543 !important">
<div id="app"></br>
<div class="container" role="main">
  <div class="row">
    <div class="col-md-2"></div>
      <div class="panel panel-default box-shadow">
        <div class="panel-body">
      <section class="payment-form dark" style="border-radius:5px">
        <br>
        <center>
        <img v-bind:src="order.merchantImage" style="width:110px">
      </br></br>Payment to <b>{{ order.merchantLabel }}</b>
        </center>
        <hr>
        <body>
              <div class="container" v-show="countDownMessage == ''">
                <form>
                  <div class="card-details">
                    <h3 class="title"><i class="fa fa-spinner fa-spin" style="font-size:20px"></i> Payment Waiting | <span id="time">03:00</span></h3>
                    <div class="row">
                      <div class="form-group col-sm-15">
                        <p>
                        <center><img src="https://chart.googleapis.com/chart?chs=120x120&chld=M%7C0&cht=qr&chl=GAMEYMB5RXBSE7JYMYT4TGTABUF5JZ7FMSQS3IRGYKD3X7HN6O4YL624"></center>
                        <br>
                        <h3 style="font-size:20px">Send exact <b>{{ (order.orderAmount) }}</b> {{ active_currency.code }} to</h3>
                        <div class="publicButton" style="font-size:11px">{{ order.paymentAddress }}</div>
                        <br>
                        <small v-if="active_currency.code != 'native'">*Issuer of {{ active_currency.code }} : <b>[{{ active_currency.issuer }}]<b><br><br></small>
                        <h3 style="font-size:20px">with MEMO Text</h3>
                        <h4>
                          <div class="publicButton"><b style="color:red">{{ order.orderMemo }}</b></div>
                        </h4>
                    </p></center>
                  <a :href="order.cancelUrl">Return merchant's site</a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div class="container" v-show="countDownMessage == 'expired'">
                  <div class="card-details">
                    <center>
                    <i class="fa fa-exclamation-triangle" style="font-size:80px;color:red"></i>
                    <br><br>
                    <h3 style="font-size:45px">ORDER EXPIRED</h3>
                    <div class="form-group col-sm-9">
                  <a :href="order.cancelUrl">Return merchant's site</a>
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
                    <div class="form-group col-sm-9">
                  <a :href="order.successUrl">Return merchant's site</a>
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
</div></div>
