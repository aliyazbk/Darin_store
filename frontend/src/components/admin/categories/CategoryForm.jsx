import {
  useEffect,
  useState,
} from "react";

const emptyCategory = {
  name: "",
  description: "",
  is_active: true,
  display_order: 0,
};

export default function CategoryForm({
  initialCategory,
  submitting,
  submitLabel,
  onSubmit,
}) {
  const [category, setCategory] =
    useState(emptyCategory);

  useEffect(() => {
    setCategory(
      initialCategory
        ? {
            name: initialCategory.name ?? "",
            description:
              initialCategory.description ?? "",

            is_active:
              initialCategory.is_active ?? true,

            display_order:
              initialCategory.display_order ?? 0,
          }
        : emptyCategory
    );
  }, [initialCategory]);

  function handleChange(event) {
    const {
      name,
      value,
      checked,
      type,
    } = event.target;

    setCategory((current) => ({
      ...current,
      [name]: type === "checkbox"
        ? checked
        : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: category.name.trim(),
      description:
        category.description.trim() || null,

      is_active: category.is_active,

      display_order:
        Number(category.display_order),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          value={category.name}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={category.description}
          onChange={handleChange}
        />
      </label>

      <label>
        Display order
        <input
          name="display_order"
          type="number"
          min="0"
          value={category.display_order}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        <input
          name="is_active"
          type="checkbox"
          checked={category.is_active}
          onChange={handleChange}
        />
        Active
      </label>

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}