"use client"
import { toast } from "react-toastify";

const toastify = ({
    props,
    message
}) => {
    toast(message, {
        ...props,
        hideProgressBar: true,
        theme: 'colored',
        icon: false
    });
};
const ApiClient = async (url, method, body) => {
    const session = localStorage.getItem('session_token');
    const response = await fetch(url,
        {
            method: method,
            headers: {
                'Authorization': `Bearer ${decodeURIComponent(session)}`
            }
        }
    )
        .then((res) => res.json())
        .then((res) => {
            toastify({
                message: res?.message,
                props: {
                    type: res?.success === true ? 'success' : 'error',
                    
                }
            })
            return res.data;
        })
        .catch((err) => {
            toastify({
                message: err?.message,
                props: {
                    type: 'error',
                    position: 'top-right',
                    closeButton: false,
                    autoClose: 3000
                }
            })
        })
        console.log(response)
    return response
}



export default ApiClient;
