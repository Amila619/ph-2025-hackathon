import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Typography, Tag, Select, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ProductGallery = () => {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

  // Mock product data with image URLs added
  useEffect(() => {
    setProducts([
      {
        key: 1,
        name: "Coconut",
        price: 120,
        farmer: "John Doe",
        location: "Galle",
        stock: 150,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      },
      {
        key: 2,
        name: "Vegetables",
        price: 80,
        farmer: "Mary Jane",
        location: "Kandy",
        stock: 200,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1542831371-d531d36971e6?auto=format&fit=crop&w=400&q=80",
      },
      {
        key: 3,
        name: "Rice",
        price: 200,
        farmer: "Sam Wilson",
        location: "Anuradhapura",
        stock: 500,
        category: "Grains",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&q=80",
      },
      // Add more products as needed
    ]);
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const handleBuy = (product) => {
    if (product.stock > 0) {
      message.success(`Successfully added ${product.name} to your cart.`);
      // Connect to cart logic or API here
    } else {
      message.error("Sorry, this product is out of stock.");
    }
  };

  // Filter products by selected category or show all
  const filteredProducts =
    filterCategory === "All"
      ? products
      : products.filter((p) => p.category === filterCategory);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Title level={2} className="mb-6 text-indigo-700">
        Product Gallery
      </Title>

      <div className="mb-6 flex justify-end">
        <Select
          value={filterCategory}
          onChange={setFilterCategory}
          className="w-48"
          placeholder="Filter by Category"
        >
          {categories.map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>
      </div>

      <Row gutter={[24, 24]}>
        {filteredProducts.map((product) => (
          <Col xs={24} sm={12} md={8} key={product.key}>
            <Card
              hoverable
              className="rounded-xl shadow-lg"
              cover={
                <img
                  alt={product.name}
                  src={product.image}
                  className="rounded-t-xl object-cover h-48 w-full"
                />
              }
              actions={[
                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  disabled={product.stock === 0}
                  onClick={() => handleBuy(product)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {product.stock === 0 ? "Out of Stock" : "Buy"}
                </Button>,
              ]}
            >
              <Card.Meta
                title={
                  <div className="flex justify-between items-center">
                    <span>{product.name}</span>
                    <Tag color="purple" className="capitalize">
                      {product.category}
                    </Tag>
                  </div>
                }
                description={
                  <>
                    <Text strong className="text-lg block">
                      Price: Rs {product.price}
                    </Text>
                    <Text className="block">Farmer: {product.farmer}</Text>
                    <Text className="block">Location: {product.location}</Text>
                    <Text>
                      Stock:{" "}
                      <Tag color={product.stock > 50 ? "green" : "volcano"}>
                        {product.stock}
                      </Tag>
                    </Text>
                  </>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductGallery;
