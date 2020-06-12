const ApiRedsys = require('./api-redsys');
const redsys = new ApiRedsys();

class RedsysPayment {
  /**
   * Provide the api key
   * @param {*} REDSYS_API_KEY
   */
  constructor(REDSYS_API_KEY) {
    // secret token provide for RedSys
    this.REDSYS_API_KEY = REDSYS_API_KEY;

    // enviroments to use RedSys
    this.REDSYS_ENV = {
      live: `https://sis.redsys.es/sis/realizarPago`,
      test: `https://sis-t.redsys.es:25443/sis/realizarPago`,
    };

    // ## REDSYS PAYMENT VALUES

    // this.DS_MERCHANT_IDENTIFIER = ``;

    // commerce name to display
    this.DS_MERCHANT_MERCHANTNAME = ``;
    // commerce code
    this.DS_MERCHANT_MERCHANTCODE = ``;
    // commerce email
    this.DS_MERCHANT_TITULAR = ``;
    // terminal code
    this.DS_MERCHANT_TERMINAL = '001';

    // order amount
    this.DS_MERCHANT_AMOUNT = ``;
    // payment order id
    this.DS_MERCHANT_ORDER = ``;

    // products description
    this.DS_MERCHANT_PRODUCTDESCRIPTION = ``;

    // url complete transaction
    this.DS_MERCHANT_URLOK = ``;
    // url uncomplete transaction
    this.DS_MERCHANT_URLKO = ``;
    // notification after complete transaction
    this.DS_MERCHANT_MERCHANTURL = ``;

    // currency: default €
    this.DS_MERCHANT_CURRENCY = '978';
    // transaction type
    this.DS_MERCHANT_TRANSACTIONTYPE = 0;
    // payment method: default credit card only
    this.DS_MERCHANT_PAYMETHODS = 'C';

    // credit card number
    this.DS_MERCHANT_PAN = ``;
    // credit card expiry date
    this.DS_MERCHANT_EXPIRYDATE = ``;
    // credit card secret number
    this.DS_MERCHANT_CVV2 = ``;
  }

  /**
   * generate the signatures
   * @param {*} useCredit signature with or not with credit card
   */
  createPayment(useCredit = false) {
    const redsysObject = {};

    // required args
    redsysObject.DS_MERCHANT_AMOUNT = this.DS_MERCHANT_AMOUNT;
    redsysObject.DS_MERCHANT_ORDER = this.DS_MERCHANT_ORDER;
    redsysObject.DS_MERCHANT_PRODUCTDESCRIPTION = this.DS_MERCHANT_PRODUCTDESCRIPTION;
    redsysObject.DS_MERCHANT_MERCHANTNAME = this.DS_MERCHANT_MERCHANTNAME;
    redsysObject.DS_MERCHANT_TITULAR = this.DS_MERCHANT_TITULAR;
    redsysObject.DS_MERCHANT_TERMINAL = this.DS_MERCHANT_TERMINAL;
    redsysObject.DS_MERCHANT_MERCHANTCODE = this.DS_MERCHANT_MERCHANTCODE;
    redsysObject.DS_MERCHANT_URLOK = this.DS_MERCHANT_URLOK;
    redsysObject.DS_MERCHANT_URLKO = this.DS_MERCHANT_URLKO;

    // default c
    redsysObject.DS_MERCHANT_PAYMETHODS = this.DS_MERCHANT_PAYMETHODS;
    // default 978
    redsysObject.DS_MERCHANT_CURRENCY = this.DS_MERCHANT_CURRENCY;
    // default 0
    redsysObject.DS_MERCHANT_TRANSACTIONTYPE = this.DS_MERCHANT_TRANSACTIONTYPE;

    if (this.DS_MERCHANT_MERCHANTURL != ``) {
      redsysObject.DS_MERCHANT_MERCHANTURL = this.DS_MERCHANT_MERCHANTURL;
    }

    // use credit card values
    if (useCredit) {
      redsysObject.DS_MERCHANT_PAN = this.DS_MERCHANT_PAN;
      redsysObject.DS_MERCHANT_EXPIRYDATE = this.DS_MERCHANT_EXPIRYDATE;
      redsysObject.DS_MERCHANT_CVV2 = this.DS_MERCHANT_CVV2;
    }

    return {
      signature: redsys.createMerchantSignature(
        this.REDSYS_API_KEY,
        redsysObject
      ),
      merchantParameters: redsys.createMerchantParameters(redsysObject),
      raw: redsysObject,
    };
  }

  /**
   * Check if the signature is valid before and after to complete the transaction
   * args will be destructured on redirection request for notification
   * @param {*} Ds_MerchantParameters
   * @param {*} Ds_Signature
   */
  signatureIsValid(Ds_MerchantParameters, Ds_Signature) {
    const merchantParamsDecoded = redsys.decodeMerchantParameters(
      Ds_MerchantParameters
    );
    const merchantSignatureNotif = redsys.createMerchantSignatureNotif(
      this.REDSYS_API_KEY,
      Ds_MerchantParameters
    );

    const dsResponse = parseInt(
      merchantParamsDecoded.Ds_Response || merchantParamsDecoded.DS_RESPONSE
    );

    return (
      redsys.merchantSignatureIsValid(Ds_Signature, merchantSignatureNotif) &&
      dsResponse > -1 &&
      dsResponse < 100
    );
  }

  /**
   * Decrypt the payment parameters
   * @param {*} Ds_MerchantParameters
   */
  decryptPayment(Ds_MerchantParameters) {
    return redsys.decodeMerchantParameters(Ds_MerchantParameters);
  }

  /**
   * redirect this url when the process is complete
   * @param {*} url
   */
  setUrlCompleteTransaction(url) {
    this.DS_MERCHANT_URLOK = url;
    return this;
  }

  /**
   * redirect the url when the process is uncomplete
   * @param {*} url
   */
  setUrlUncompleteTransaction(url) {
    this.DS_MERCHANT_URLKO = url;
    return this;
  }

  /**
   * set the payment method
   * @param {*} payment T or C only credit card
   */
  setPaymentMethod(payment) {
    this.DS_MERCHANT_PAYMETHODS = payment;
    return this;
  }

  /**
   * set terminal
   * the terminal code is the numbers after the hyphen of commerce code
   * @param {*} terminalCode
   */
  setTerminalCode(terminalCode) {
    this.DS_MERCHANT_TERMINAL = terminalCode;
    return this;
  }

  /**
   * Set the currency id value
   * Default value for euros is 978
   * @param {*} currencyId must be a 3 digit code
   */
  setCurrency(currencyId) {
    this.DS_MERCHANT_CURRENCY = currencyId;
  }

  /**
   * Commerce email defined on redsys contract
   * @param {*} titularEmail
   */
  setTitularEmail(titularEmail) {
    this.DS_MERCHANT_TITULAR = titularEmail;
    return this;
  }

  /**
   * Set the commerce name
   * @param {*} commerceName
   */
  setCommerceName(commerceName) {
    this.DS_MERCHANT_MERCHANTNAME = commerceName;
    return this;
  }

  /**
   * Set the commerce code
   * @param {*} merchant
   */
  setCommerceCode(merchant) {
    this.DS_MERCHANT_MERCHANTCODE = merchant;
    return this;
  }

  // como se setean las variables de entorno
  setEnvironment() {
    return this;
  }

  /**
   * Set the transation type
   * @param {*} transantionType
   */
  setTransactiontype(transantionType) {
    this.DS_MERCHANT_TRANSACTIONTYPE = transantionType;
    return this;
  }

  /**
   * Order content description
   * @param {*} productDescription
   */
  setProductDescription(productDescription) {
    this.DS_MERCHANT_PRODUCTDESCRIPTION = productDescription;
    return this;
  }

  /**
   * Credit card number
   * @param string cardnumber
   */
  setCreditCard(cardnumber) {
    this.DS_MERCHANT_PAN = cardnumber;
    return this;
  }

  /**
   * Credit card expiration date
   * year and month only last two values
   * NUMBER FORMAT, VALUES less than 10 add zero prefix
   * @param {*} panExpiryDate
   */
  setExpiryDate(panExpiryDate) {
    this.DS_MERCHANT_EXPIRYDATE = panExpiryDate;
    return this;
  }

  /**
   * Credit card secret number
   * @param string cvv
   */
  setCVV2(cvv) {
    this.DS_MERCHANT_CVV2 = cvv;
    return this;
  }

  /**
   * Order total amount
   * @param {*} amount must be rounded and must be less than zero
   */
  setAmount(totalAmount) {
    this.DS_MERCHANT_AMOUNT = Number.parseFloat(totalAmount)
      .toFixed(2)
      .toString();
    return this;
  }

  /**
   * Trade order id
   * the must be converted to string
   * @param string orderId must be between 4 and 12 digits and parse to string
   */
  setOrder(orderId) {
    this.DS_MERCHANT_ORDER = orderId.toString();
    return this;
  }
}

module.exports = RedsysPayment;
