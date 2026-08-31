const NUMERIC_COLUMNS = new Set(["birth_year", "death_year"]);

// Text columns (names, occupation) and grave_section (alphanumeric like
// "52a") both need Ukrainian-alphabet-correct sorting. grave_section
// additionally needs "numeric" mode so embedded numbers compare by value —
// e.g. "6" and "7" sort before "52a", not after, the way plain string
// comparison would put them.
function compareValues(a, b, column) {
  const aVal = a[column];
  const bVal = b[column];

  // Nulls/empties always sort last, regardless of direction.
  const aEmpty = aVal === null || aVal === undefined || aVal === "";
  const bEmpty = bVal === null || bVal === undefined || bVal === "";
  if (aEmpty && bEmpty) return 0;
  if (aEmpty) return 1;
  if (bEmpty) return -1;

  if (NUMERIC_COLUMNS.has(column)) {
    return Number(aVal) - Number(bVal);
  }

  return String(aVal).localeCompare(String(bVal), "uk", {
    numeric: true,
    sensitivity: "base",
  });
}

export function sortGraves(graves, sortColumn, sortDir) {
  const dirMultiplier = sortDir === "desc" ? -1 : 1;

  return [...graves].sort((a, b) => {
    const primary = compareValues(a, b, sortColumn) * dirMultiplier;
    if (primary !== 0) return primary;
    // Deterministic secondary key for stable pagination, regardless of sort/direction.
    return String(a.id).localeCompare(String(b.id));
  });
}
