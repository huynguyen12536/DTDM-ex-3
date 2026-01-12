import React, { useState } from 'react';
import productsData from '../../data/products.json';
import ProductCards from '../shop/ProductCards';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState(productsData);

    const handleSearch = () => {
        const query = searchQuery.toLowerCase();

        const filtered = productsData.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    };

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
                        className="search-bar w-full max-w-4xl p-2 border rounded"
                    />
                    <button
                        onClick={handleSearch}
                        className="search-button w-full md:w-auto py-2 px-8 bg-primary text-white rounded"
                    >
                        Tìm kiếm
                    </button>
                </div>
                <ProductCards products={filteredProducts}/>
                
            </section>
        </>

    );
};

export default Search;
