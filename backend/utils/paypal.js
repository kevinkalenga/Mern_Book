// import dotenv from "dotenv";
// dotenv.config();

// const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// // 🔑 Get access token
// async function getPaypalAccessToken() {
//   const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString(
//     "base64"
//   );

//   const url = `${PAYPAL_API_URL}/v1/oauth2/token`;
   
  

 

//   const headers = {
//     Accept: "application/json",
//     "Accept-Language": "en_US",
//     Authorization: `Basic ${auth}`,
//   };

//   const body = "grant_type=client_credentials";
//   const response = await fetch(url, {
//     method: "POST",
//     headers,
//     body,
//   });

//   if (!response.ok) throw new Error("Failed to get access token");

//   const paypalData = await response.json();

//   return paypalData.access_token;
// } 

// export async function checkIfNewTransaction(orderModel, paypalTransactionId) {
//   try {
//     const orders = await orderModel.find({
//       "paymentResult.id": paypalTransactionId,
//     });

//     return orders.length === 0;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function verifyPaPalPayment(paypalTransactionId) {
//   const accessToken = await getPaypalAccessToken();
//   const paypalResponse = await fetch(
//     `${PAYPAL_API_URL}/v2/checkout/orders/${paypalTransactionId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   if (!paypalResponse.ok) throw new Error("Failed to verify payment");

//   const paypalData = await paypalResponse.json();

//   return {
//     verified: paypalData.status === "COMPLETED",
//     value: paypalData.purchase_units[0].amount.value,
//   };
// } 

/////////////////////////////////////////////////////////////////////
// import dotenv from "dotenv";
// dotenv.config();

// const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// // 🔑 Get access token
// async function getPaypalAccessToken() {
//   const auth = Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET).toString(
//     "base64"
//   );

//   const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded", 
//       Accept: "application/json",
//       "Accept-Language": "en_US",
//       Authorization: `Basic ${auth}`,
//     },
//     body: "grant_type=client_credentials",
//   });

//   if (!response.ok) throw new Error("Failed to get access token");

//   const data = await response.json();
//   return data.access_token;
// }

// // 🛒 Create PayPal order
// export async function createPaypalOrder(totalPrice) {
//   const accessToken = await getPaypalAccessToken();

//   const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify({
//       intent: "CAPTURE",
//       purchase_units: [
//         {
//           amount: {
//             currency_code: "USD", // change if needed
//             value:  parseFloat(totalPrice).toFixed(2),
//           },
//         },
//       ],
//     }),
//   });

//   if (!response.ok) throw new Error("Failed to create PayPal order");

//   return await response.json(); // { id, status, links }
// }

// // 💰 Capture PayPal payment
// export async function capturePaypalOrder(paypalOrderId) {
//   const accessToken = await getPaypalAccessToken();

//   const response = await fetch(
//     `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   if (!response.ok) throw new Error("Failed to capture PayPal order");

//   return await response.json(); // contains payer info, amount, status
// }

// // ✅ Verify payment (optional safeguard)
// export async function verifyPaypalPayment(paypalOrderId) {
//   const accessToken = await getPaypalAccessToken();

//   const response = await fetch(
//     `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${accessToken}`,
//       },
//     }
//   );

//   if (!response.ok) throw new Error("Failed to verify PayPal order");

//   const data = await response.json();
//   return {
//     verified: data.status === "COMPLETED",
//     value: data.purchase_units[0].amount.value,
//   };
// }

import dotenv from "dotenv";
dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_APP_SECRET, PAYPAL_API_URL } = process.env;

// 🔑 Get PayPal access token
async function getPaypalAccessToken() {
  const auth = Buffer.from(
    PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET
  ).toString("base64");

  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
      "Accept-Language": "en_US",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ PayPal token error:", errorData);
    throw new Error("Failed to get access token");
  }

  const data = await response.json();
  return data.access_token;
}

// 🛒 Create PayPal order
export async function createPaypalOrder(totalPrice) {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD", // or your store’s currency
            value: Number(totalPrice).toFixed(2), // ensure proper format
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ PayPal create order error:", errorData);
    throw new Error("Failed to create PayPal order");
  }

  return await response.json(); // { id, status, links }
}

// 💰 Capture PayPal payment
export async function capturePaypalOrder(paypalOrderId) {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ PayPal capture error:", errorData);
    throw new Error("Failed to capture PayPal order");
  }

  return await response.json(); // contains payer info, amount, status
}

// ✅ Verify payment (optional safeguard)
export async function verifyPaypalPayment(paypalOrderId) {
  const accessToken = await getPaypalAccessToken();

  const response = await fetch(
    `${PAYPAL_API_URL}/v2/checkout/orders/${paypalOrderId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("❌ PayPal verify error:", errorData);
    throw new Error("Failed to verify PayPal order");
  }

  const data = await response.json();
  return {
    verified: data.status === "COMPLETED",
    value: data.purchase_units[0].amount.value,
  };
}

