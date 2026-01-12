import React, { useState } from 'react';
import {useSelector } from 'react-redux';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'Chọn danh mục', value: '' },
    { label: 'Phụ kiện', value: 'accessories' },
    { label: 'Váy', value: 'dress' },
    { label: 'Trang sức', value: 'jewellery' },
    { label: 'Mỹ phẩm', value: 'cosmetics' }
];

const colors = [
    { label: 'Chọn màu', value: '' },
    { label: 'Đen', value: 'black' },
    { label: 'Đỏ', value: 'red' },
    { label: 'Vàng', value: 'gold' },
    { label: 'Xanh dương', value: 'blue' },
    { label: 'Bạc', value: 'silver' },
    { label: 'Be', value: 'beige' },
    { label: 'Xanh lá', value: 'green' }
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        color: '',
        price: '',
        description: ''
    });
    const [image, setImage] = useState('');

    const [addProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate()
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!product.name || !product.category || !product.price  || !product.color || !product.description) {
            alert('Vui lòng điền đầy đủ các trường.');
            return;
        }
        try {
            await addProduct({ ...product, image, author: user?._id }).unwrap();
            alert('Thêm sản phẩm thành công!');
            setProduct({ name: '', category: '', color: '', price: '', description: '' });
            setImage('');
            navigate("/shop")
        } catch (err) {
            console.error('Failed to add product:', err);
        }
    };

    // console.log("This is the image:", image)
    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Tên sản phẩm"
                    name="name"
                    placeholder="Ví dụ: Bông tai kim cương"
                    value={product.name}
                    onChange={handleChange}
                />
                <SelectInput
                    label="Danh mục"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                <SelectInput
                    label="Màu sắc"
                    name="color"
                    value={product.color}
                    onChange={handleChange}
                    options={colors}
                />
                <TextInput
                    label="Giá"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
                {/* <TextInput
                    label="Image URL"
                    name="image"
                    type='text'
                    value={product.image}
                    onChange={handleChange}
                     placeholder="Ex: https://unsplash.com/photos/a-group-of-women-in-brightly-colored-outfits.png"
                /> */}
                <UploadImage
                name="image"
                id="image"
                value={e => setImage(e.target.value)}
                placeholder='Viết mô tả sản phẩm'
                setImage={setImage}
                />

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Mô tả
                    </label>
                    <textarea
                        rows={6}
                        name="description"
                        id="description"
                        value={product.description}
                        placeholder='Viết mô tả sản phẩm'
                        onChange={handleChange}
                        className="add-product-InputCSS "
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang thêm...' : 'Thêm sản phẩm'}
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mt-4">Lỗi khi thêm sản phẩm: {error.message}</p>}
        </div>
    );
};

export default AddProduct;
