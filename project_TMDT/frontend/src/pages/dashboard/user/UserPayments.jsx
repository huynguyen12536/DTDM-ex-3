import React from 'react';
import { useGetMyOrdersQuery } from '../../../redux/features/orders/orderApi';

const UserPayments = () => {
  // ✅ SECURE: Email is now taken from JWT token, not from client state
  const { data: orders, error, isLoading } = useGetMyOrdersQuery();


  if (isLoading) return <div>Đang tải...</div>;

  // Calculate total payment
  const totalPayment = orders?.reduce((acc, order) => acc + order.amount, 0);

  return (
    <div className="py-6 px-4">
      <h3 className="text-xl font-semibold text-blueGray-700 mb-4">Tổng thanh toán</h3>
      <div className="bg-white p-8 shadow-lg rounded">
        <p className="text-lg font-medium text-gray-800 mb-5">Tổng đã chi: {totalPayment ? totalPayment.toLocaleString('vi-VN') : 0}đ</p>
        <ul>
        
          {
           orders && orders.map((item, index) => (
              <li key={index}>
                <h5 className="font-medium text-gray-800 mb-2">Đơn hàng #{index + 1}</h5>
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-gray-600">Mã đơn: #{item.id}</span>
                  <span className="text-gray-600">{item.amount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex md:flex-row items-center space-x-2">
                  <span className="text-gray-600">Ngày: {new Date(item.createdAt).toLocaleString()}</span>
                  <p className="text-gray-600">Trạng thái:
                    <span className={`ml-2 py-[2px] px-2 text-sm rounded ${item.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'pending' ? 'bg-red-200 text-red-700' :
                        item.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-200 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </p>
                </div>
                <hr className="my-2" />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
}

export default UserPayments;
