const crypto = require('crypto');

/**
 * MoMo Payment Gateway Integration
 * Tạo payment request và xử lý callback từ MoMo
 */

// MoMo API Configuration
const MOMO_PARTNER_CODE = process.env.MOMO_PARTNER_CODE || 'MOMO';
const MOMO_ACCESS_KEY = process.env.MOMO_ACCESS_KEY || 'F8BBA842ECF85';
const MOMO_SECRET_KEY = process.env.MOMO_SECRET_KEY || 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_API_ENDPOINT = process.env.MOMO_API_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';

/**
 * Tạo chữ ký (signature) cho MoMo API
 */
function createSignature(rawSignature) {
  return crypto.createHmac('sha256', MOMO_SECRET_KEY)
    .update(rawSignature)
    .digest('hex');
}

/**
 * Tạo payment request với MoMo
 * @param {Object} paymentData - Dữ liệu thanh toán
 * @param {string} paymentData.orderId - Mã đơn hàng
 * @param {number} paymentData.amount - Số tiền (VND)
 * @param {string} paymentData.orderInfo - Thông tin đơn hàng
 * @param {string} paymentData.returnUrl - URL trả về sau khi thanh toán thành công
 * @param {string} paymentData.notifyUrl - URL callback từ MoMo
 * @param {string} paymentData.extraData - Dữ liệu bổ sung
 * @returns {Promise<Object>} Payment response từ MoMo
 */
async function createMoMoPayment(paymentData) {
  const {
    orderId,
    amount,
    orderInfo,
    returnUrl,
    notifyUrl,
    extraData = '',
  } = paymentData;

  // Tạo request ID
  const requestId = `${orderId}_${Date.now()}`;
  const requestType = 'captureWallet';

  // Tạo raw signature
  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;

  // Tạo signature
  const signature = createSignature(rawSignature);

  // Tạo request body
  const requestBody = {
    partnerCode: MOMO_PARTNER_CODE,
    partnerName: 'Lebaba Ecommerce',
    storeId: 'LebabaStore',
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: returnUrl,
    ipnUrl: notifyUrl,
    lang: 'vi',
    requestType: requestType,
    autoCapture: true,
    extraData: extraData,
    signature: signature,
  };

  try {
    // Use https module for Node.js compatibility
    const https = require('https');
    const url = require('url');
    
    const parsedUrl = url.parse(MOMO_API_ENDPOINT);
    const postData = JSON.stringify(requestBody);

    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);

            if (jsonData.resultCode === 0) {
              resolve({
                success: true,
                payUrl: jsonData.payUrl,
                orderId: orderId,
                requestId: requestId,
              });
            } else {
              resolve({
                success: false,
                message: jsonData.message || 'Không thể tạo payment link',
                resultCode: jsonData.resultCode,
              });
            }
          } catch (parseError) {
            console.error('MoMo API Parse Error:', parseError);
            resolve({
              success: false,
              message: 'Lỗi xử lý response từ MoMo',
              rawResponse: data,
            });
          }
        });
      });

      req.on('error', (error) => {
        console.error('MoMo API Request Error:', error);
        resolve({
          success: false,
          message: error.message || 'Lỗi kết nối đến MoMo',
        });
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    console.error('MoMo API Error:', error);
    return {
      success: false,
      message: error.message || 'Lỗi kết nối đến MoMo',
    };
  }
}

/**
 * Xác thực callback từ MoMo
 * @param {Object} callbackData - Dữ liệu callback từ MoMo
 * @returns {boolean} True nếu signature hợp lệ
 */
function verifyMoMoCallback(callbackData) {
  const {
    partnerCode,
    orderId,
    requestId,
    amount,
    orderInfo,
    orderType,
    transId,
    resultCode,
    message,
    payType,
    responseTime,
    extraData,
    signature,
  } = callbackData;

  // Tạo raw signature từ callback data
  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  // Tạo signature để so sánh
  const calculatedSignature = createSignature(rawSignature);

  // So sánh signature
  return calculatedSignature === signature;
}

module.exports = {
  createMoMoPayment,
  verifyMoMoCallback,
};

