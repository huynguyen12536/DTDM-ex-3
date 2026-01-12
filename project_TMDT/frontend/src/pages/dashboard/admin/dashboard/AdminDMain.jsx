import React from 'react';
import AdminStats from './AdminStats';
import { useSelector } from 'react-redux';
import { useGetAdminStatsQuery } from '../../../../redux/features/stats/statsApi';
import AdminStatsChart from './AdminStatsChart';

const AdminDMain = () => {
    const { user } = useSelector((state) => state.auth);
    const { data: stats, error, isLoading } = useGetAdminStatsQuery();
    console.log(stats);

    if (isLoading) {
        return <p className="text-center text-gray-500">Đang tải thống kê...</p>;
    }


    if (!stats) {
        return <p className="text-center text-gray-500">Không có dữ liệu thống kê.</p>;
    }

    return (
        <div className="p-6">
            <div>
                <h1 className="text-2xl font-semibold mb-4">Bảng điều khiển quản trị</h1>
                <p className="text-gray-500">Xin chào, {user?.username}! Chào mừng đến với bảng điều khiển quản trị.</p>
            </div>
            <AdminStats stats={stats} />
            <AdminStatsChart stats={stats} />
        </div>
    );
};

export default AdminDMain;
