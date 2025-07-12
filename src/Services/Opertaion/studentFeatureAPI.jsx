import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import logo from "../../Assets/Logo/Learnify-unscreen.gif"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";




const {COURSE_PAYMENT_API, COURSE_VERIFY_API} = studentEndpoints;

// function loadScript(src) {
//     return new Promise((resolve, reject) => {
//         const script = document.createElement("script");
//         script.src = src

//         script.onload = ()=> {
//             resolve(true)
//         }

//         script.onerror = () => {
//             resolve(false)
//         }
//         document.body.appendChild(script);
//     })
// }

// export const buyCourse = async (token, courses, userDetails, navigate, dispatch,)=> {

//     const toastId = toast.loading("Loading...");

//     try {
//         const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
        
//         if (!res) {
//             toast.error("RazorPay SDK failed to load");
//             return;
//         }

//         const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
//                                                     {courses},
//                                                     {  
//                                                         Authorization: `Bearer ${token}`
//                                                     })

//         // if(!orderResponse.data.success){
//         //     throw new Error(orderResponse.data.message)
//         // }

//         console.log("Order Initialized, printing order response", orderResponse);

//         const options = {
//             key: process.env.RAZORPAY_KEY,
//             currency: orderResponse.data.message.currency,
//             amount: `${orderResponse.data.message.amount}`,
//             order_id:orderResponse.data.message.id,
//             name:"StudyHarsh",
//             description: "Thank You for Purchasing the Course",
//             image:rzpLogo,
//             prefill: {
//                 name:`${userDetails.firstName}`,
//                 email:userDetails.email
//             },
//             handler: (response)=> {
//                 sendPaymentSuccessEmail(response, orderResponse.data.message.amount,token)

//                 verifyPayment({...response, courses}, token, navigate, dispatch)
//             }  
//         }

//         // Open the modal using options, as order is initialized => payment will be done =>  Payment done mail => verificationPayment => course successfully enrolled mail sent
//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//         paymentObject.on("payment.failed", (response)=> {
//             toast.error("oops, payment failed");
//             console.log(response.error);
//         })
//     } catch (error) {
//         console.log("PAYMENT API ERROR.....", error);
//         toast.error("Could not make Payment");
//     }

//     toast.dismiss(toastId)
// }


function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error("Failed to load script"));

        document.body.appendChild(script);
    });
}

export const buyCourse = async (token, courses, userDetails, navigate, dispatch) => {
    console.log("Courses:", courses);
console.log("User Details:", userDetails);
console.log("Token:", token);


const RAZORPAY_KEY='rzp_test_8oNxW0keHfN7qS'
    const toastId = toast.loading("Initializing payment...");

    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res || !window.Razorpay) {
            throw new Error("Razorpay SDK failed to load");
        }

        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            { Authorization: `Bearer ${token}` }
        );

        if (!orderResponse || !orderResponse.success) {
            throw new Error(orderResponse.message || "Order creation failed");
        }
   
        //  console.log("------>",RAZORPAY_KEY);
        const { currency, amount, id: order_id } = orderResponse.message;
        const options = {
            key: RAZORPAY_KEY,
            currency,
            amount: `${amount}`,
            order_id,
            name: "Learnify",
            description: "Thank you for purchasing the course",
            image: logo,
            prefill: {
                name: userDetails?.firstName || "Guest",
                email: userDetails?.email || "guest@example.com",
            },
            handler: (response) => {
                // sendPaymentSuccessEmail(response, amount, token);
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", (response) => {
            toast.error("Oops, payment failed");
            console.error("Payment failed:", response.error);
        });
    } catch (error) {
        console.error("PAYMENT API ERROR:", error);
        toast.error(error.message || "Could not complete payment");
    } finally {
        toast.dismiss(toastId);
    }
};



// async function sendPaymentSuccessEmail(response, amount, token) {
//     console.log("----->response",response);
//     try {
//         await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
//             orderId:  response.razorpay_order_id,
//             paymentId: response.razorpay_payment_id,
//             amount
//         },{
//             Authorization: `Bearer ${token}`
//         })
//     } catch (error) {
//         console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
//         toast.error("Payment success mail failed")
//     }
// }


  //(Tested)
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        
        const response =  await apiConnector("POST", COURSE_VERIFY_API, bodyData,
        {
            Authorization: `Bearer ${token}`
        })
        console.log("}}}}}}",response)

        if (!response.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful, you are added to the course!")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}