import React, { useEffect, useState } from 'react';
import 'remixicon/fonts/remixicon.css';
import { getBaseUrl } from '../utils/baseURL';
import TimelineStep from '../pages/dashboard/user/TimelineStep';

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    const orderId = query.get('orderId');

    console.log('PaymentSuccess - sessionId:', sessionId, 'orderId:', orderId);

    if (sessionId) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to confirm payment');
          }
          return res.json();
        })
        .then((data) => {
          if (data.order) {
            setOrder(data.order);
          } else {
            console.error('No order data received');
          }
        })
        .catch((error) => {
          console.error('Error confirming payment:', error);
          alert('Không thể xác nhận thanh toán. Vui lòng thử lại.');
        });
    } else if (orderId) {
      console.log('Fetching order from:', `${getBaseUrl()}/api/orders/order/${orderId}`);
      fetch(`${getBaseUrl()}/api/orders/order/${orderId}`)
        .then((res) => {
          console.log('Response status:', res.status);
          if (!res.ok) {
            throw new Error(`Failed to fetch order: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Order data received:', data);
          if (data && data._id) {
            setOrder(data);
          } else {
            console.error('Invalid order data received:', data);
            alert('Không tìm thấy thông tin đơn hàng.');
          }
        })
        .catch((error) => {
          console.error('Error fetching order:', error);
          alert('Không thể tải thông tin đơn hàng. Vui lòng kiểm tra lại mã đơn hàng.');
        });
    } else {
      console.warn('No session_id or orderId found in URL');
    }
  }, []);

  if (!order) {
    return <div>Đang tải...</div>;
  }


  // Determine steps based on payment method
  const isCOD = order.paymentMethod === 'cod';
  
  const codSteps = [
    {
      status: 'confirmed',
      label: 'Đã xác nhận',
      description: 'Đơn hàng COD của bạn đã được xác nhận. Chúng tôi đang chuẩn bị hàng.',
      icon: { iconName: 'check-line', bgColor: 'green-500', textColor: 'white' },
    },
    {
      status: 'processing',
      label: 'Đang xử lý',
      description: 'Đơn hàng của bạn đang được xử lý và đóng gói.',
      icon: { iconName: 'loader-line', bgColor: 'yellow-500', textColor: 'yellow-800' },
    },
    {
      status: 'shipped',
      label: 'Đang giao hàng',
      description: 'Đơn hàng đã được gửi đi. Bạn sẽ nhận được hàng sớm.',
      icon: { iconName: 'truck-line', bgColor: 'blue-500', textColor: 'blue-100' },
    },
    {
      status: 'delivered',
      label: 'Đã giao hàng',
      description: 'Đơn hàng đã được giao đến bạn. Vui lòng thanh toán khi nhận hàng.',
      icon: { iconName: 'home-line', bgColor: 'purple-500', textColor: 'purple-100' },
    },
    {
      status: 'completed',
      label: 'Hoàn thành',
      description: 'Đơn hàng đã được thanh toán và hoàn tất.',
      icon: { iconName: 'check-double-line', bgColor: 'green-600', textColor: 'white' },
    },
  ];

  const normalSteps = [
    {
      status: 'pending',
      label: 'Chờ xử lý',
      description: 'Đơn hàng của bạn đã được tạo và đang chờ xử lý.',
      icon: { iconName: 'time-line', bgColor: 'red-500', textColor: 'gray-800' },
    },
    {
      status: 'processing',
      label: 'Đang xử lý',
      description: 'Đơn hàng của bạn đang được xử lý.',
      icon: { iconName: 'loader-line', bgColor: 'yellow-800', textColor: 'yellow-800' },
    },
    {
      status: 'shipped',
      label: 'Đã giao hàng',
      description: 'Đơn hàng của bạn đã được giao.',
      icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-800' },
    },
    {
      status: 'completed',
      label: 'Hoàn thành',
      description: 'Đơn hàng của bạn đã được hoàn thành thành công.',
      icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'green-900' },
    },
  ];

  const steps = isCOD ? codSteps : normalSteps;

  const isCompleted = (status) => {
    const statuses = steps.map(s => s.status);
    return statuses.indexOf(status) < statuses.indexOf(order.status);
  };

  const isCurrent = (status) => order.status === status;

  return (
    <div className="section__container rounded p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {order.paymentMethod === 'momo' 
          ? 'Thanh toán MoMo thành công' 
          : order.paymentMethod === 'cod'
          ? 'Đơn hàng COD đã được xác nhận'
          : 'Thanh toán thành công'}
      </h2>
      <p className="mb-4">Mã đơn hàng: {order.orderId || order._id}</p>
      {order.paymentMethod === 'momo' && order.paymentId && (
        <p className="mb-2 text-sm text-gray-600">Mã giao dịch MoMo: {order.paymentId}</p>
      )}
      {order.paymentMethod === 'cod' && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-semibold mb-2">💰 Thanh toán khi nhận hàng (COD)</p>
          <p className="text-blue-700 text-sm">
            Đơn hàng của bạn đã được xác nhận. Bạn sẽ thanh toán cho nhân viên giao hàng khi nhận được sản phẩm.
            Vui lòng chuẩn bị số tiền: <strong>${order.amount?.toFixed(2) || '0.00'}</strong>
          </p>
        </div>
      )}
      <p className="mb-8">Trạng thái: {order.status === 'confirmed' ? 'Đã xác nhận' : order.status}</p>

      {/* Timeline */}
      <ol className="items-center sm:flex relative">
        {steps.map((step, index) => (
          <TimelineStep
            key={step.status}
            step={step}
            order={order}
            isCompleted={isCompleted(step.status)}
            isCurrent={isCurrent(step.status)}
            isLastStep={index === steps.length - 1}
            icon={step.icon}
            description={step.description}
          />
        ))}
      </ol>
    </div>
  );
};

export default PaymentSuccess;
