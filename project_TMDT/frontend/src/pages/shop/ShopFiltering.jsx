import React from 'react'

const ShopFiltering = ({filters, filtersState, setFiltersState, clearFilters}) => {
    return (
        <div className="space-y-5 flex-shrink-0 ">
            <h3>Bộ lọc</h3>

            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Danh mục</h4>
                <hr />
                {filters.categories.map(category => {
                    const categoryNames = {
                        'all': 'Tất cả',
                        'accessories': 'Phụ kiện',
                        'dress': 'Bộ sưu tập váy',
                        'jewellery': 'Trang sức',
                        'cosmetics': 'Mỹ phẩm'
                    };
                    return (
                        <label key={category} className='cursor-pointer'>
                            <input
                                type="radio"
                                name="category"
                                value={category}
                                checked={filtersState.category === category}
                                onChange={e => setFiltersState({ ...filtersState, category: e.target.value })}
                            />
                            <span className='ml-1'>{categoryNames[category] || category}</span>
                        </label>
                    );
                })}
            </div>

            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Màu sắc</h4>
                <hr />
                {filters.colors.map(color => {
                    const colorNames = {
                        'all': 'Tất cả',
                        'black': 'Đen',
                        'red': 'Đỏ',
                        'gold': 'Vàng',
                        'blue': 'Xanh dương',
                        'silver': 'Bạc',
                        'beige': 'Be',
                        'green': 'Xanh lá'
                    };
                    return (
                        <label key={color} className='cursor-pointer'>
                            <input
                                type="radio"
                                name="color"
                                value={color}
                                checked={filtersState.color === color}
                                onChange={e => setFiltersState({ ...filtersState, color: e.target.value })}
                            />
                            <span className='ml-1'>{colorNames[color] || color}</span>
                        </label>
                    );
                })}
            </div>

            <div className="flex flex-col space-y-2">
                <h4 className='font-medium text-lg'>Khoảng giá</h4>
                <hr />
                {filters.priceRanges.map(range => (
                    <label key={range.label} className='cursor-pointer'>
                        <input
                            type="radio"
                            name="priceRange"
                            value={`${range.min}-${range.max}`}
                            checked={filtersState.priceRange === `${range.min}-${range.max}`}
                            onChange={e => setFiltersState({ ...filtersState, priceRange: e.target.value })}
                        />

                        <span className='ml-1'>{range.label}</span>
                    </label>
                ))}
            </div>

            {/* Clear Filters Button */}
            <button className="bg-primary py-1 px-4 text-white rounded" onClick={clearFilters}>
                Xóa tất cả bộ lọc
            </button>
        </div>
    )
}

export default ShopFiltering