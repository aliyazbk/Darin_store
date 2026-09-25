import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { getAdminCategories } from "../services/adminCategoryService";

export default function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNumber, setRefreshNumber] = useState(0);

  const refresh = useCallback(() => {
    setRefreshNumber((number) => number + 1);
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError("");

        setCategories(await getAdminCategories());
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ??
            "Unable to load categories."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, [refreshNumber]);

  return {
    categories,
    loading,
    error,
    refresh,
  };
}