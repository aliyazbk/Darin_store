import { useEffect, useState } from "react";

import { getAdminCategories } from "../../services/adminCategoryService";
import {
  createHomeSection,
  deleteHomeSection,
  getHomeSections,
  getStoreSettings,
  saveStoreSettings,
  updateHomeSection,
} from "../../services/storefrontService";

const emptySection = {
  title: "",
  category_id: "",
  display_order: 0,
  is_active: true,
};

export default function AdminStorefrontPage() {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [sectionForm, setSectionForm] = useState(emptySection);
  const [logo, setLogo] = useState(null);
  const [video, setVideo] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [store, categoryList, sectionList] = await Promise.all([
      getStoreSettings(),
      getAdminCategories(),
      getHomeSections(),
    ]);

    setSettings(store);
    setCategories(categoryList);
    setSections(sectionList);
  }

  useEffect(() => {
    loadData().catch(() => {
      setError("Unable to load storefront settings.");
    });
  }, []);

  function getError(requestError) {
    const errors = requestError.response?.data?.errors;

    return errors
      ? Object.values(errors).flat().join(" ")
      : requestError.response?.data?.message ??
          "Unable to save changes.";
  }

  async function handleSettingsSave(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const data = new FormData();
      data.append("hero_title", settings.hero_title);
      data.append("hero_subtitle", settings.hero_subtitle ?? "");
      data.append("hero_button_text", settings.hero_button_text);
      data.append("hero_button_url", settings.hero_button_url);

      if (logo) data.append("logo", logo);
      if (video) data.append("hero_video", video);

      const result = await saveStoreSettings(data);
      setSettings(result.settings);
      setLogo(null);
      setVideo(null);
      setMessage("Store appearance saved.");
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSection(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await createHomeSection({
        ...sectionForm,
        category_id: Number(sectionForm.category_id),
        display_order: Number(sectionForm.display_order),
      });

      setSectionForm(emptySection);
      setSections(await getHomeSections());
      setMessage("Homepage section added.");
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateSection(section) {
    try {
      setSaving(true);
      setError("");

      await updateHomeSection(section.id, {
        title: section.title,
        category_id: Number(section.category_id),
        display_order: Number(section.display_order),
        is_active: section.is_active,
      });

      setSections(await getHomeSections());
      setMessage("Section updated.");
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSection(id) {
    if (!window.confirm("Remove this homepage section?")) return;

    try {
      setSaving(true);
      setError("");

      await deleteHomeSection(id);
      setSections((current) =>
        current.filter((section) => section.id !== id)
      );
      setMessage("Section removed.");
    } catch (requestError) {
      setError(getError(requestError));
    } finally {
      setSaving(false);
    }
  }

  function changeSection(id, field, value) {
    setSections((current) =>
      current.map((section) =>
        section.id === id
          ? { ...section, [field]: value }
          : section
      )
    );
  }

  if (!settings) return <p>Loading storefront settings...</p>;

  return (
    <main className="admin-storefront-page">
      <h1>Storefront settings</h1>

      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}

      <section>
        <h2>Logo and homepage video</h2>

        <form onSubmit={handleSettingsSave}>
          {settings.logo_url && (
            <img
              src={settings.logo_url}
              alt="Current store logo"
              style={{ maxWidth: 220, maxHeight: 80 }}
            />
          )}

          <label>
            Replace logo
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(event) =>
                setLogo(event.target.files?.[0] ?? null)
              }
            />
          </label>

          {settings.hero_video_url && (
            <video
              src={settings.hero_video_url}
              controls
              style={{ width: "min(100%, 500px)" }}
            />
          )}

          <label>
            Replace hero video (MP4 or WebM, up to 50 MB)
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(event) =>
                setVideo(event.target.files?.[0] ?? null)
              }
            />
          </label>

          <label>
            Hero title
            <input
              value={settings.hero_title ?? ""}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  hero_title: event.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Subtitle
            <input
              value={settings.hero_subtitle ?? ""}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  hero_subtitle: event.target.value,
                })
              }
            />
          </label>

          <label>
            Button text
            <input
              value={settings.hero_button_text ?? ""}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  hero_button_text: event.target.value,
                })
              }
              required
            />
          </label>

          <label>
            Button destination (site path)
            <input
              value={settings.hero_button_url ?? ""}
              onChange={(event) =>
                setSettings({
                  ...settings,
                  hero_button_url: event.target.value,
                })
              }
              placeholder="/products"
              required
            />
          </label>

          <button type="submit" disabled={saving}>
            Save appearance
          </button>
        </form>
      </section>

      <section>
        <h2>Homepage category sections</h2>
        <p>
          These appear after On Sale and Top Buying, before All Products.
        </p>

        {sections.map((section) => (
          <div key={section.id} className="admin-home-section-row">
            <input
              aria-label="Section title"
              value={section.title}
              onChange={(event) =>
                changeSection(section.id, "title", event.target.value)
              }
            />

            <select
              aria-label="Section category"
              value={section.category_id}
              onChange={(event) =>
                changeSection(
                  section.id,
                  "category_id",
                  event.target.value
                )
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              aria-label="Section order"
              type="number"
              min="0"
              value={section.display_order}
              onChange={(event) =>
                changeSection(
                  section.id,
                  "display_order",
                  event.target.value
                )
              }
            />

            <label>
              <input
                type="checkbox"
                checked={section.is_active}
                onChange={(event) =>
                  changeSection(
                    section.id,
                    "is_active",
                    event.target.checked
                  )
                }
              />
              Visible
            </label>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleUpdateSection(section)}
            >
              Save
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleDeleteSection(section.id)}
            >
              Remove
            </button>
          </div>
        ))}

        <form onSubmit={handleAddSection}>
          <h3>Add category section</h3>

          <input
            aria-label="New section title"
            placeholder="Example: Pants"
            value={sectionForm.title}
            onChange={(event) =>
              setSectionForm({
                ...sectionForm,
                title: event.target.value,
              })
            }
            required
          />

          <select
            aria-label="New section category"
            value={sectionForm.category_id}
            onChange={(event) =>
              setSectionForm({
                ...sectionForm,
                category_id: event.target.value,
              })
            }
            required
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            aria-label="New section order"
            type="number"
            min="0"
            value={sectionForm.display_order}
            onChange={(event) =>
              setSectionForm({
                ...sectionForm,
                display_order: event.target.value,
              })
            }
          />

          <button type="submit" disabled={saving}>
            Add section
          </button>
        </form>
      </section>
    </main>
  );
}