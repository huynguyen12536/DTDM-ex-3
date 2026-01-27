import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImage }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const uploadImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file hình ảnh');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('File quá lớn. Tối đa 10MB');
            return;
        }

        setLoading(true);
        setError("");

        try {
            // 1. Get presigned URL from backend
            const res = await axios.post(
                `${getBaseUrl()}/api/get-presigned-url`,
                { fileType: file.type },
                { withCredentials: true }
            );

            const { uploadUrl, publicUrl } = res.data;

            // 2. Upload file directly to S3 using presigned URL
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            });

            // 3. Set the public URL
            setUrl(publicUrl);
            setImage(publicUrl);
            alert('Tải ảnh lên thành công!');

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Lỗi khi tải ảnh lên');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                Hình ảnh
            </label>
            <input
                onChange={uploadImage}
                name={name}
                id={name}
                type="file"
                accept="image/*"
                className="add-product-InputCSS"
            />
            {loading && (
                <div className="mt-2 text-sm text-blue-600">
                    <p>Đang tải lên...</p>
                </div>
            )}
            {error && (
                <div className="mt-2 text-sm text-red-600">
                    <p>{error}</p>
                </div>
            )}
            {url && (
                <div className="mt-2 text-sm text-green-600">
                    <p>Tải ảnh lên thành công!</p>
                    <img src={url} alt="Uploaded" className="mt-2 max-w-xs rounded" />
                </div>
            )}
        </div>
    );
};

export default UploadImage;
