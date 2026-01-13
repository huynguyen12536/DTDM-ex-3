import React, { useState } from 'react';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

import ProductCards from './ProductCards';

const TrendingProducts = () => {
  const [visibleProducts, setVisibleProducts] = useState(8);
  
  // Fetch products from API instead of static JSON
  const { data, isLoading, error } = useFetchAllProductsQuery({
    category: '',
    color: '',
    minPrice: 0,
    maxPrice: '',
    page: 1,
    limit: 40
  });

  const products = data?.products || [];

  const loadMoreProducts = () => {
    setVisibleProducts(prevCount => prevCount + 4);
  };

  if (isLoading) return <p className="text-center py-8">Loading products...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error loading products.</p>;

  return (
    <section className="section__container product__container">
      <h2 className="section__header">Trending Products</h2>
      <p className="section__subheader mb-12">
        Discover the Hottest Picks: Elevate Your Style with Our Curated
        Collection of Trending Women's Fashion Products.
      </p>

      {/* products card */}
      <ProductCards products={products.slice(0, visibleProducts)} />

       {/* Load More button */}
      <div className="product__btn">
        {visibleProducts < products.length && (
          <button className="btn" onClick={loadMoreProducts}>
            Load More
          </button>
        )}
      </div>
    </section>
  );
};

export default TrendingProducts;
