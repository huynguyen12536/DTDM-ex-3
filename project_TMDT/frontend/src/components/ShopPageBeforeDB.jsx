import React, { useState, useEffect, useMemo } from 'react';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';

const filters = {
    categories: ['all', 'accessories', 'dress', 'jewellery', 'cosmetics'],
    colors: ['all', 'black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'],
    priceRanges: [
        { label: 'Under $50', min: 0, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100 - $200', min: 100, max: 200 },
        { label: '$200 and above', min: 200, max: Infinity }
    ]
};

const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        color: 'all',
        priceRange: ''
    });

    // Fetch products from API
    const { data, isLoading, error } = useFetchAllProductsQuery({
        category: filtersState.category !== 'all' ? filtersState.category : '',
        color: filtersState.color !== 'all' ? filtersState.color : '',
        minPrice: 0,
        maxPrice: '',
        page: 1,
        limit: 100
    });

    const allProducts = data?.products || [];

    // Apply local price range filtering (since API might not support exact price ranges)
    const products = useMemo(() => {
        if (!filtersState.priceRange) return allProducts;
        
        const [minPrice, maxPrice] = filtersState.priceRange.split('-').map(Number);
        return allProducts.filter(
            product => product.price >= minPrice && product.price <= maxPrice
        );
    }, [allProducts, filtersState.priceRange]);

    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            color: 'all',
            priceRange: ''
        });
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
            <section className="section__container rounded bg-primary-light">
                <h2 className="section__header">Shop Page</h2>
                <p className="section__subheader">
                    Discover the Hottest Picks: Elevate Your Style with Our Curated
                    Collection of Trending Women's Fashion Products.
                </p>
            </section>
            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left side */}
                    <ShopFiltering filters={filters} filtersState={filtersState} setFiltersState={setFiltersState} clearFilters={clearFilters}/>

                    {/* right side */}
                    <div>
                        <h3 className='text-xl font-medium mb-4'>Products Available: {products.length}</h3>
                        <ProductCards products={products}/>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;
