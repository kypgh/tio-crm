/**
 *
 * @param {Array} queries
 */
export default async function multipleQueryFetch(queries) {
  let querieErrorCatch = queries.map((q) => q.catch((e) => e));
  return Promise.all(querieErrorCatch);
}
