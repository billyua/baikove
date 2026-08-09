// Builds a /directory URL from the current pagination/sort/search state plus
// any overrides, omitting parameters that are already at their default value
// so URLs stay clean (e.g. /directory instead of /directory?sort=last_name&dir=asc&page=1).
export function buildDirectoryHref(current, overrides = {}) {
  const merged = { ...current, ...overrides };
  const params = new URLSearchParams();

  if (merged.q) params.set("q", merged.q);
  if (merged.sort && merged.sort !== "last_name") params.set("sort", merged.sort);
  if (merged.dir && merged.dir !== "asc") params.set("dir", merged.dir);
  if (merged.page && String(merged.page) !== "1") params.set("page", String(merged.page));

  const qs = params.toString();
  return qs ? `/directory?${qs}` : "/directory";
}

// Returns an array of page numbers/ellipses to display:
// always the first page, the last page, and up to two pages on either side
// of the current page, with "..." filling any gaps.
export function getPageNumbers(current, total) {
  const pages = new Set([1, total]);
  for (let p = current - 2; p <= current + 2; p++) {
    if (p >= 1 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("...");
    }
    result.push(sorted[i]);
  }
  return result;
}
