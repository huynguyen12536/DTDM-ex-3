import React, { useState } from 'react';
import axios from 'axios';
import { getBaseUrl } from '../../../../utils/baseURL';

const UploadImage = ({ name, setImage }) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");

    // Convert file to base64
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Upload base64 image to backend
    const uploadSingleImage = (base64) => {
        setLoading(true);
        axios
            .post(
                `${getBaseUrl()}/api/uploadImage`,
                { image: base64 },
                { withCredentials: true }
            )
            .then((res) => {
                const imageUrl = res.data;
                setUrl(imageUrl);
                setImage(imageUrl);
                alert("Tải ảnh lên thành công!");
            })
            .then(() => setLoading(false))
            .catch((error) => {
                console.error(error);
                alert("Lỗi khi tải ảnh lên");
                setLoading(false);
            });
    };

    // Handle file selection
    const uploadImage = async (event) => {
        const files = event.target.files;

        if (files.length === 1) {
            const base64 = await convertBase64(files[0]);
            uploadSingleImage(base64);
            return;
        }

        // Handle multiple files
        for (let i = 0; i < files.length; i++) {
            const base64 = await convertBase64(files[i]);
            uploadSingleImage(base64);
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
                className="add-product-InputCSS"
            />
            {loading && (
                <div className="mt-2 text-sm text-blue-600">
                    <p>Đang tải lên...</p>
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
