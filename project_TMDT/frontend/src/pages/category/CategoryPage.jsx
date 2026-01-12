import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCards from '../shop/ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const CategoryPage = () => {
    const { categoryName } = useParams();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [categoryName]);

    const { data: { products = [] } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: categoryName,
        color: '',
        minPrice: '',
        maxPrice: '',
        page: 1,
        limit: 40,
    });

    const filteredProducts = useMemo(() => {
        return products.map(product => ({
            ...product,
            image: product.image || product.images?.[0] || '/placeholder.png',
        }));
    }, [products]);

    const categoryLabel = (name) => {
        switch (name) {
            case 'accessories':
                return 'Phụ kiện';
            case 'dress':
                return 'Bộ sưu tập váy';
            case 'jewellery':
                return 'Trang sức';
            case 'cosmetics':
                return 'Mỹ phẩm';
            default:
                return name;
        }
    };

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className="section__header capitalize">{categoryLabel(categoryName)}</h2>
                <p className="section__subheader">
                    Duyệt qua nhiều danh mục đa dạng, từ những chiếc váy thanh lịch đến các phụ kiện đa năng. Nâng tầm phong cách của bạn ngay hôm nay!
                </p>
            </section>
            <div className='section__container'>
                {isLoading && <p>Đang tải sản phẩm...</p>}
                {error && <p className='text-red-500'>Không thể tải sản phẩm. Vui lòng thử lại.</p>}
                {!isLoading && !error && filteredProducts.length === 0 && (
                    <p>Hiện chưa có sản phẩm nào trong danh mục này.</p>
                )}
                {!isLoading && !error && filteredProducts.length > 0 && (
                    <ProductCards products={filteredProducts} />
                )}
            </div>
        </>
    );
};

export default CategoryPage;
