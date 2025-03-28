import { toString, trailingSlash } from "@weborigami/async-tree";

/**
 * Given an Airtable personal access token, returns a function that can be used to
 * fetch records from a specific Airtable base and table.
 *
 * @param {import("@weborigami/async-tree").StringLike} token
 */
export default function airtable(token) {
  token = toString(token);
  return async function (baseId, tableName) {
    // Function might be called with slash syntax; remove slashes
    baseId = trailingSlash.remove(baseId);
    tableName = trailingSlash.remove(tableName);

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };
}
