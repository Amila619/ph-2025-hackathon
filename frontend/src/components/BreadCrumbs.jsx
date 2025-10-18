import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();

  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;

    const text = pathSnippets[index]
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    const isLast = index === pathSnippets.length - 1;

    return (
      <Breadcrumb.Item key={url} className="text-sm">
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

  const breadcrumbItems = [
    <Breadcrumb.Item key="home" className="text-sm">
      <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
        Home
      </Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className="bg-white py-2 px-8 text-sm max-w-full">
      <Breadcrumb separator=">" className="text-sm">
        {breadcrumbItems}
      </Breadcrumb>
    </div>
  );
};

export default BreadCrumbs;
