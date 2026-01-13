import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/features/cart/cartSlice';

const CartDetails = ({ product }) => {
  const dispatch = useDispatch();

  const handleQuantity = (type, id) => {
    const payload = { type, id };
    dispatch(updateQuantity(payload));
  };

  const handleRemove = (e, id) => {
    e.preventDefault();
    dispatch(removeFromCart({ id }));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between shadow-md md:p-5 p-4 rounded-lg bg-white">
      <div className="flex items-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="size-20 object-cover rounded-md mr-4"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/80x80?text=No+Image';
          }}
        />
        <div>
          <h5 className="text-lg font-medium">{product.name}</h5>
          <p className="text-gray-600 text-sm">${Number(product.price).toFixed(2)}</p>
          <p className="text-gray-500 text-xs capitalize">Color: {product.color}</p>
        </div>
      </div>

      <div className="flex flex-row md:justify-start justify-end items-center mt-4 md:mt-0">
        <button
          onClick={() => handleQuantity("decrement", product._id)}
          className="size-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
        >
          -
        </button>
        <span className="px-4 text-center font-medium">{product.quantity}</span>
        <button
          onClick={() => handleQuantity("increment", product._id)}
          className="size-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-primary hover:text-white transition-colors"
        >
          +
        </button>
        <div className="ml-6">
          <button
            onClick={(e) => handleRemove(e, product._id)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDetails;
