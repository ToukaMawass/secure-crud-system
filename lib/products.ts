export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

let products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    description: "A powerful laptop for students and developers.",
    price: 1200,
  },
  {
    id: 2,
    name: "Headphones",
    description: "Wireless headphones with noise cancellation.",
    price: 150,
  },
];

export function getProducts() {
  return products;
}

export function addProduct(data: Omit<Product, "id">) {
  const newProduct: Product = {
    id: Date.now(),
    ...data,
  };

  products.push(newProduct);

  return newProduct;
}

export function updateProduct(id: number, data: Omit<Product, "id">) {
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex === -1) {
    return null;
  }

  products[productIndex] = {
    id,
    ...data,
  };

  return products[productIndex];
}

export function deleteProduct(id: number) {
  const productExists = products.some((product) => product.id === id);

  if (!productExists) {
    return false;
  }

  products = products.filter((product) => product.id !== id);

  return true;
}