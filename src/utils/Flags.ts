const flagModules = import.meta.glob("/public/assets/icon-*.svg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function normalizeFlagName(path: string) {
  const fileName = path.split("/").pop() || "";

  if (fileName.includes("-square.svg")) return null;

  return fileName.replace("icon-", "").replace(".svg", "");
}

export const flags: Record<string, string> = Object.fromEntries(
  Object.entries(flagModules)
    .map(([path, value]) => {
      const name = normalizeFlagName(path);
      if (!name) return null;
      return [name, value];
    })
    .filter(Boolean) as [string, string][]
);