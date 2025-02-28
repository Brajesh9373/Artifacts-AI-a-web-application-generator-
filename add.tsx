import React, { useState, useEffect } from 'react';
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface Review {
  id: number;
  rating: number;
  comment: string;
}

const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-500 py-4 flex justify-between items-center sticky top-0">
      <ul className="flex items-center space-x-4">
        <li><a href="#" className="text-white hover:text-gray-200">Home</a></li>
        <li><a href="#" className="text-white hover:text-gray-200">Shop</a></li>
        <li><a href="#" className="text-white hover:text-gray-200">Categories</a></li>
        <li><a href="#" className="text-white hover:text-gray-200">Offers</a></li>
        <li><a href="#" className="text-white hover:text-gray-200">About</a></li>
        <li><a href="#" className="text-white hover:text-gray-200">Contact</a></li>
      </ul>
      <div className="flex items-center space-x-4">
        <input type="search" placeholder="Search" className="px-4 py-2 rounded-md bg-gray-200" />
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4 8L21 5H7z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l2 2m-2 2l2-2" />
        </svg>
      </div>
    </nav>
  );
};

const HeroBanner: React.FC = () => {
  return (
    <section className="bg-blue-500 h-screen flex justify-center items-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl text-white font-bold">Promotional Offer</h1>
        <p className="text-2xl text-white">Get 20% off on all products</p>
        <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Shop Now
        </button>
      </div>
    </section>
  );
};

const FeaturedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Product 1', price: 10.99, image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', price: 9.99, image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Product 3', price: 12.99, image: 'https://via.placeholder.com/150' },
  ]);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white shadow-md p-4 rounded">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-xl font-bold mb-4">${product.price}</p>
            <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategoriesSection: React.FC = () => {
  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Sports & Outdoors'];

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div key={category} className="bg-white shadow-md p-4 rounded">
            <h3 className="text-2xl font-bold mb-2">{category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    id: 1,
    name: 'Product 1',
    price: 10.99,
    image: 'https://via.placeholder.com/150',
  });

  const [reviews, setReviews] = useState<Review[]>([
    { id: 1, rating: 5, comment: 'Great product!' },
    { id: 2, rating: 4, comment: 'Good product, but not great.' },
  ]);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-2xl font-bold mb-2">Description</h3>
          <p className="text-xl font-bold mb-4">This is a great product.</p>
          <h3 className="text-2xl font-bold mb-2">Reviews</h3>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white shadow-md p-4 rounded">
                <h4 className="text-xl font-bold mb-2">Rating: {review.rating}/5</h4>
                <p className="text-xl font-bold mb-4">{review.comment}</p>
              </div>
            ))}
          </div>
          <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

const DealsAndDiscounts: React.FC = () => {
  const deals = [
    { id: 1, name: 'Deal 1', discount: 10 },
    { id: 2, name: 'Deal 2', discount: 20 },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">Deals & Discounts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="bg-white shadow-md p-4 rounded">
            <h3 className="text-2xl font-bold mb-2">{deal.name}</h3>
            <p className="text-xl font-bold mb-4">{deal.discount}% off</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CustomerReviews: React.FC = () => {
  const reviews = [
    { id: 1, rating: 5, comment: 'Great product!' },
    { id: 2, rating: 4, comment: 'Good product, but not great.' },
  ];

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white shadow-md p-4 rounded">
            <h3 className="text-2xl font-bold mb-2">Rating: {review.rating}/5</h3>
            <p className="text-xl font-bold mb-4">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CartAndCheckout: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([
    { id: 1, name: 'Product 1', price: 10.99, image: 'https://via.placeholder.com/150' },
  ]);

  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-4">Cart & Checkout</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.map((product) => (
          <div key={product.id} className="bg-white shadow-md p-4 rounded">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-xl font-bold mb-4">${product.price}</p>
          </div>
        ))}
      </div>
      <button className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
        Checkout
      </button>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 py-4 text-white text-center">
      <p>&copy; 2023 E-commerce Website</p>
      <p>Developed by : Yash Gaikwad</p>
    </footer>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <Navbar />
      <HeroBanner />
      <FeaturedProducts />
      <CategoriesSection />
      <ProductPage />
      <DealsAndDiscounts />
      <CustomerReviews />
      <CartAndCheckout />
      <Footer />
    </div>
  );
};

export default App;
