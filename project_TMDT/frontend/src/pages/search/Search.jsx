import React, { useState, useMemo } from 'react';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import ProductCards from '../shop/ProductCards';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Fetch all products from API (with high limit to get all)
    const { data, isLoading, error } = useFetchAllProductsQuery({
        category: '',
        color: '',
        minPrice: 0,
        maxPrice: '',
        page: 1,
        limit: 100
    });

    const products = data?.products || [];

    // Filter products based on search term
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        
        const query = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
    }, [products, searchTerm]);

    const handleSearch = () => {
        setSearchTerm(searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    if (isLoading) {
        return (
            <section className="section__container">
                <p className="text-center">Đang tải sản phẩm...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="section__container">
                <p className="text-center text-red-500">Lỗi khi tải sản phẩm.</p>
            </section>
        );
    }

    return (
        <>
            <section className="section__container bg-primary-light">
                <h2 className="section__header">Tìm kiếm sản phẩm</h2>
                <p className="section__subheader">
                    Duyệt qua nhiều danh mục đa dạng, từ những chiếc váy thanh lịch đến các phụ kiện đa năng. Nâng tầm phong cách của bạn ngay hôm nay!
                </p>
            </section>
            <section className="section__container">
                <div className="w-full mb-12 flex flex-col md:flex-row items-center justify-center gap-4">
                    <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="search-bar w-full max-w-4xl p-2 border rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded"
                    >
                        Tìm kiếm
                    </button>
                </div>
                {searchTerm && (
                    <p className="text-center mb-4 text-gray-600">
                        Tìm thấy {filteredProducts.length} kết quả cho "{searchTerm}"
                    </p>
                )}
                <ProductCards products={filteredProducts}/>
            </section>
        </>
    );
};

export default Search;
