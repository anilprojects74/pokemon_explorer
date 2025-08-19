import { useState, useEffect, useCallback } from "react";

export function useUrlState() {
  const [urlParams, setUrlParams] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      search: params.get("q") || "",
      type: params.get("type") || "",
      sort: params.get("sort") || "id",
      page: parseInt(params.get("page")) || 1,
      view: params.get("view") || "all",
    };
  });

  const updateUrl = useCallback(
    (newParams) => {
      const params = new URLSearchParams();
      Object.entries({ ...urlParams, ...newParams }).forEach(([key, value]) => {
        if (value && value !== "" && value !== 1 && value !== "all" && value !== "id") {
          params.set(key === "search" ? "q" : key, value);
        }
      });
      const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
      window.history.pushState({}, "", newUrl);
      setUrlParams((prev) => ({ ...prev, ...newParams }));
    },
    [urlParams]
  );

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setUrlParams({
        search: params.get("q") || "",
        type: params.get("type") || "",
        sort: params.get("sort") || "id",
        page: parseInt(params.get("page")) || 1,
        view: params.get("view") || "all",
      });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return [urlParams, updateUrl];
}
