import { useState } from "react";

import CategoryForm from "../../components/admin/categories/CategoryForm";
import LoadingMessage from "../../components/ui/LoadingMessage";
import ErrorMessage from "../../components/ui/ErrorMessage";

import useAdminCategories from "../../hooks/useAdminCategories";

import {
  createAdminCategory,
  updateAdminCategory,
} from "../../services/adminCategoryService";

export default function AdminCategoriesPage() {
  const {
    categories,
    loading,
    error,
    refresh,
  } = useAdminCategories();

  const [action, setAction] = useState("");
  const [message, setMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [newFormKey, setNewFormKey] = useState(0);

  function showError(error) {
    const errors = error.response?.data?.errors;

    setRequestError(
      errors
        ? Object.values(errors).flat().join(" ")
        : error.response?.data?.message ??
            "Unable to save category."
    );
  }

  async function handleCreate(data) {
    try {
      setAction("create");
      setMessage("");
      setRequestError("");

      await createAdminCategory(data);

      setMessage("Category created successfully.");
      setNewFormKey((key) => key + 1);
      refresh();
    } catch (error) {
      showError(error);
    } finally {
      setAction("");
    }
  }

  async function handleUpdate(id, data) {
    try {
      setAction(`update-${id}`);
      setMessage("");
      setRequestError("");

      await updateAdminCategory(id, data);

      setMessage("Category updated successfully.");
      refresh();
    } catch (error) {
      showError(error);
    } finally {
      setAction("");
    }
  }

  if (loading) {
    return (
      <LoadingMessage message="Loading categories..." />
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <main>
      <h1>Categories</h1>

      {message && <p role="status">{message}</p>}

      {requestError && (
        <ErrorMessage message={requestError} />
      )}

      <section>
        <h2>Add category</h2>

        <CategoryForm
          key={newFormKey}
          submitting={action === "create"}
          submitLabel="Create category"
          onSubmit={handleCreate}
        />
      </section>

      <section>
        <h2>Existing categories</h2>

        {categories.map((category) => (
          <article key={category.id}>
            <h3>{category.name}</h3>

            <p>
              {category.products_count ?? 0} products
            </p>

            <CategoryForm
              initialCategory={category}
              submitting={
                action === `update-${category.id}`
              }
              submitLabel="Update category"
              onSubmit={(data) =>
                handleUpdate(category.id, data)
              }
            />
          </article>
        ))}
      </section>
    </main>
  );
}