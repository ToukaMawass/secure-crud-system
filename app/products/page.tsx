"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  username: string;
  role: "admin" | "user";
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

export default function ProductsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function loadPageData() {
      try {
        const userResponse = await fetch("/api/auth/me");

        if (!userResponse.ok) {
          router.push("/login");
          return;
        }

        const userData = await userResponse.json();

        setUser(userData.user);

        const productsResponse = await fetch("/api/products");

        if (!productsResponse.ok) {
          setMessage("Could not load products.");
          return;
        }

        const productsData = await productsResponse.json();

        setProducts(productsData.products);
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong while loading the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPageData();
  }, [router]);

  function resetForm() {
    setName("");
    setDescription("");
    setPrice("");
    setEditingProductId(null);
  }

  async function refreshProducts() {
    const response = await fetch("/api/products");

    if (!response.ok) {
      setMessage("Could not refresh products.");
      return;
    }

    const data = await response.json();

    setProducts(data.products);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");

    const method = editingProductId ? "PUT" : "POST";

    const body = editingProductId
      ? {
          id: editingProductId,
          name,
          description,
          price,
        }
      : {
          name,
          description,
          price,
        };

    try {
      const response = await fetch("/api/products", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Operation failed.");
        return;
      }

      setMessage(data.message);
      resetForm();
      await refreshProducts();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    }
  }

  function startEditing(product: Product) {
    setEditingProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(String(product.price));
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Delete failed.");
        return;
      }

      setMessage(data.message);
      await refreshProducts();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while deleting.");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-300">Loading products...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Protected CRUD Page
            </p>

            <h1 className="text-3xl font-bold">Products Management</h1>

            {user && (
              <p className="mt-2 text-sm text-slate-400">
                Logged in as{" "}
                <span className="text-cyan-400">{user.username}</span> with role{" "}
                <span className="text-cyan-400">{user.role}</span>
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
          >
            Logout
          </button>
        </div>

        {message && (
          <p className="mb-6 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
            {message}
          </p>
        )}

        {isAdmin && (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h2 className="mb-5 text-xl font-bold">
              {editingProductId ? "Edit Product" : "Add Product"}
            </h2>

            <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Product name"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <input
                type="text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400 md:col-span-2"
              />

              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Price"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              />

              <div className="flex gap-3 md:col-span-4">
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  {editingProductId ? "Update Product" : "Add Product"}
                </button>

                {editingProductId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {!isAdmin && (
          <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-300">
              You are logged in as a normal user. You can view products, but you
              cannot add, edit, or delete them.
            </p>
          </section>
        )}

        <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
            >
              <h2 className="text-xl font-bold">{product.name}</h2>

              <p className="mt-3 text-sm text-slate-400">
                {product.description}
              </p>

              <p className="mt-5 text-lg font-bold text-cyan-400">
                ${product.price}
              </p>

              {isAdmin && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => startEditing(product)}
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="rounded-xl border border-red-900/70 px-4 py-2 text-sm font-semibold text-red-300 transition hover:border-red-400 hover:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}