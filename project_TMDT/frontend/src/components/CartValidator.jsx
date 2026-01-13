import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchAllProductsQuery } from '../redux/features/products/productsApi';
import { validateCart } from '../redux/features/cart/cartSlice';

/**
 * CartValidator Component
 * This component runs on app load to validate cart items against the database.
 * It removes any products from the cart that no longer exist in the database.
 */
const CartValidator = () => {
  const dispatch = useDispatch();
  const cartProducts = useSelector((state) => state.cart.products);
  
  // Fetch all products with a large limit to get all IDs
  const { data, isSuccess } = useFetchAllProductsQuery({ 
    limit: 1000 // Get all products to validate against
  });

  useEffect(() => {
    // Only validate if we have cart products and successfully fetched products
    if (isSuccess && data?.products && cartProducts.length > 0) {
      // Get all valid product IDs from database
      const validProductIds = data.products.map(product => product._id);
      
      // Dispatch validateCart action with valid IDs
      dispatch(validateCart(validProductIds));
    }
  }, [isSuccess, data, dispatch, cartProducts.length]);

  // This component doesn't render anything
  return null;
};

export default CartValidator;
