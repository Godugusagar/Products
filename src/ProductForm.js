import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [message, setMessage] = useState('');  // State to handle messages

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5051/api/Product');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching ', error);
    }
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form submission for create or update
  const handleSubmit = async (event) => {
    event.preventDefault();

    const productData = {
      name,
      price: parseFloat(price),
    };

    try {
      if (selectedProductId) {
        // Update product if a product is selected
        await axios.put(`http://localhost:5051/api/Product/${selectedProductId}`, {
          id: selectedProductId, // For update, we pass the ID
          ...productData,
        });
        setMessage('Product updated successfully!');
      } else {
        // Create new product
        await axios.post('http://localhost:5051/api/Product', productData);
        setMessage('Product created successfully!');
      }

      // Reset form and refresh product list
      setName('');
      setPrice('');
      setSelectedProductId(null);
      fetchProducts();
    } catch (error) {
      setMessage('Error occurred while creating/updating the product.');
      console.error('Error creating/updating product', error);
    }
  };

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5051/api/Product/${id}`);
      setMessage('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      setMessage('Error occurred while deleting the product.');
      console.error('Error deleting product', error);
    }
  };

  // Handle product selection for update
  const handleEdit = (product) => {
    setSelectedProductId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setMessage(''); // Clear message on edit
  };

  return (
    <div>
      <h1>Product Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>
        </div>
        <button type="submit">{selectedProductId ? 'Update Product' : 'Create Product'}</button>
      </form>

      {message && <p>{message}</p>} {/* Display message if available */}

      <h2>Product List</h2>
      <label><b>ProductName</b></label>    <label><b>Price</b></label>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
        
             {product.name}
             <tab></tab>
              {product.price.toFixed(2)}
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductForm;
