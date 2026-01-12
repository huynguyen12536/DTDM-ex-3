import React from 'react';
import { useSelector } from 'react-redux';
import { useGetUserStatsQuery } from '../../../../redux/features/stats/statsApi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import UserStats from './UserStats';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserDMain = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: stats, error, isLoading } = useGetUserStatsQuery(user?.email);

  if (isLoading) {
    return <p className="text-center text-gray-500">Đang tải thống kê...</p>;
  }

  if (!stats) {
    return <p className="text-center text-gray-500">Không có dữ liệu thống kê.</p>;
  }

  // Prepare data for the bar chart
  const data = {
    labels: ['Tổng thanh toán', 'Tổng đánh giá', 'Tổng sản phẩm đã mua'],
    datasets: [
      {
        label: 'Thống kê người dùng',
        data: [stats.totalPayments, stats.totalReviews, stats.totalPurchasedProducts],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            if (tooltipItem.label === 'Tổng thanh toán') {
              return `Tổng thanh toán: $${tooltipItem.raw.toFixed(2)}`;
            }
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Bảng điều khiển người dùng</h1>
        <p className="text-gray-500">Xin chào, {user?.username}! Chào mừng đến với bảng điều khiển của bạn.</p>
      </div>
      <UserStats stats={stats}/>
      <div className="mb-6">
        <Bar data={data} options={options} />
      </div>
     
    </div>
  );
};

export default UserDMain;
