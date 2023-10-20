import { CMSQueries } from "@/types";

export function buildQueryString(queries: CMSQueries | undefined): string {
  if (!queries) {
    return "";
  }

  const queryArray: string[] = [];

  for (const key in queries) {
    if (queries.hasOwnProperty(key) && queries[key] !== undefined) {
      const value = queries[key];

      if (Array.isArray(value)) {
        // If the value is an array, join the values with a comma
        queryArray.push(`${key}=${value.join(",")}`);
      } else if (value !== "") {
        queryArray.push(`${key}=${value}`);
      }
    }
  }

  return queryArray.join("&");
}
