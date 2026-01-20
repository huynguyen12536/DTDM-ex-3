import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOrderByIdQuery } from '../../../redux/features/orders/orderApi';
import TimelineStep from './TimelineStep';

const OrderDetails = () => {
    const { orderId } = useParams();
    const { data: order, error, isLoading } = useGetOrderByIdQuery(orderId);

    if (isLoading) return <div>Đang tải...</div>;
    if (error) return <div>Lỗi: {error.message}</div>;

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
            icon: { iconName: 'edit-2-line', bgColor: 'red-500', textColor: 'gray-800' },
        },
        {
            status: 'processing',
            label: 'Đang xử lý',
            description: 'Đơn hàng của bạn đang được xử lý.',
            icon: { iconName: 'loader-line', bgColor: 'yellow-500', textColor: 'yellow-800' },
        },
        {
            status: 'shipped',
            label: 'Đã giao hàng',
            description: 'Đơn hàng của bạn đã được giao.',
            icon: { iconName: 'truck-line', bgColor: 'blue-800', textColor: 'blue-100' },
        },
        {
            status: 'completed',
            label: 'Hoàn thành',
            description: 'Đơn hàng của bạn đã được hoàn thành thành công.',
            icon: { iconName: 'check-line', bgColor: 'green-800', textColor: 'white' },
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
                {order.paymentMethod === 'cod' ? 'Đơn hàng COD' : 'Chi tiết đơn hàng'}
            </h2>
            <p className="mb-4">Mã đơn hàng: {order.orderId}</p>
            {order.paymentMethod === 'cod' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 font-semibold mb-2">💰 Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-blue-700 text-sm">
                        Bạn sẽ thanh toán cho nhân viên giao hàng khi nhận được sản phẩm.
                        Số tiền cần thanh toán: <strong>{order.amount?.toLocaleString('vi-VN') || '0'}đ</strong>
                    </p>
                </div>
            )}
            <p className="mb-8">Trạng thái: {order.status === 'confirmed' ? 'Đã xác nhận' : order.status}</p>

            {/* Product List */}
            <div className="mb-8 border-t pt-4">
                <h3 className="text-xl font-semibold mb-3">Sản phẩm đã mua</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {order.products?.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm text-gray-900">
                                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{item.name || 'Sản phẩm không tên'}</td>
                                    <td className="px-4 py-2 text-sm text-center text-gray-900">{item.quantity}</td>
                                    <td className="px-4 py-2 text-sm text-right text-gray-900">{(item.price || 0).toLocaleString('vi-VN')}đ</td>
                                    <td className="px-4 py-2 text-sm text-right text-gray-900 font-medium">{((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-semibold">
                            <tr>
                                <td colSpan="3" className="px-4 py-2 text-sm text-right text-gray-900">Tổng cộng (sau thuế):</td>
                                <td className="px-4 py-2 text-sm text-right text-green-600">{(order.amount || 0).toLocaleString('vi-VN')}đ</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

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

export default OrderDetails;
