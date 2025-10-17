import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();

  // Split the pathname into parts and accumulate paths
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    // Build the url for the breadcrumb item
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    // Format label from the path segment, e.g. "product-details" -> "Product Details"
    const text = pathSnippets[index]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const isLast = index === pathSnippets.length - 1;

    return (
      <Breadcrumb.Item key={url}>
        {isLast ? (
          <span className="text-gray-500">{text}</span>
        ) : (
          <Link to={url} className="text-indigo-600 hover:text-indigo-800 font-medium">
            {text}
          </Link>
        )}
      </Breadcrumb.Item>
    );
  });

  // Add home breadcrumb at the front
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
        Home
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className="bg-white p-4 rounded shadow-md">
      <Breadcrumb separator=">">{breadcrumbItems}</Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
