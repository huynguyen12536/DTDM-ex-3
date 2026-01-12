
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/features/cart/cartSlice";
import { getBaseUrl } from "../../utils/baseURL";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const products = useSelector((store) => store.cart.products);
  const { tax, taxRate, grandTotal, totalPrice, selectedItems } =
    useSelector((store) => store.cart);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const makePayment = async (paymentMethod = 'momo') => {
    if (!user?.email) {
      alert("Vui lòng đăng nhập trước khi thanh toán.");
      return;
    }

    if (!products.length) {
      alert("Giỏ hàng của bạn đang trống.");
      return;
    }

    try {
      // Ensure each product has _id or id
      const productsWithId = products.map(product => {
        if (!product._id && !product.id) {
          throw new Error(`Sản phẩm "${product.name}" thiếu ID. Vui lòng thêm lại sản phẩm vào giỏ hàng.`);
        }
        return {
          ...product,
          _id: product._id || product.id,
          id: product._id || product.id,
        };
      });

      if (paymentMethod === 'momo') {
        // MoMo Payment
        const response = await fetch(
          `${getBaseUrl()}/api/orders/create-momo-payment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              products: productsWithId,
              email: user.email,
            }),
          }
        );

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Server trả về lỗi không hợp lệ. Vui lòng kiểm tra backend đã chạy chưa.");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Không thể tạo payment link. Vui lòng thử lại hoặc sử dụng thanh toán đơn giản.");
        }

        if (data.payUrl) {
          // Redirect to MoMo payment page
          dispatch(clearCart());
          window.location.href = data.payUrl;
        } else {
          throw new Error("Không nhận được payment URL từ MoMo. Vui lòng thử lại hoặc sử dụng thanh toán đơn giản.");
        }
      } else if (paymentMethod === 'cod') {
        // COD (Cash on Delivery) checkout
        const response = await fetch(
          `${getBaseUrl()}/api/orders/cod-checkout`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              products: productsWithId,
              email: user.email,
            }),
          }
        );

        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          console.error("Non-JSON response:", text);
          throw new Error("Server trả về lỗi không hợp lệ. Vui lòng kiểm tra backend đã chạy chưa.");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Không thể tạo đơn hàng COD.");
        }

        dispatch(clearCart());
        navigate(`/success?orderId=${data.order._id}&paymentMethod=cod`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert(error.message || "Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className=" bg-primary-light mt-5 rounded text-base">
      <div className="px-6 py-4 space-y-5">
        <h1 className="text-2xl font-bold text-dark">Tóm tắt đơn hàng</h1>
        <p className="text-dark mt-2">
          Số lượng sản phẩm : {selectedItems}
        </p>
        <p className="text-dark mt-2">
          Tổng tiền : ${totalPrice.toFixed(2)}
        </p>
        <p className="text-dark mt-2">
          Thuế ({taxRate * 100}%): ${tax.toFixed(2)}
        </p>
        <h3 className="font-semibold text-dark mt-4">
          Tổng cộng ${grandTotal.toFixed(2)}
        </h3>
      </div>
      <div className="px-4 pb-6">
        {" "}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClearCart();
          }}
          className="bg-red-500 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center mb-4"
        >
          <span className="mr-2">Xóa giỏ hàng</span>

          <i className="ri-delete-bin-7-line"></i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            makePayment('momo');
          }}
          className="bg-green-600 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center mb-2"
        >
          <span className="mr-2">Thanh toán MoMo</span>
          <i className="ri-bank-card-line"></i>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            makePayment('cod');
          }}
          className="bg-blue-600 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center"
        >
          <span className="mr-2">Thanh toán khi nhận hàng (COD)</span>
          <i className="ri-truck-line"></i>
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;