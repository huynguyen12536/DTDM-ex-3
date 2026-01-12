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
                        Số tiền cần thanh toán: <strong>${order.amount?.toFixed(2) || '0.00'}</strong>
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

export default OrderDetails;
