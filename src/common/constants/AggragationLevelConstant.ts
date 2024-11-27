import { HierarchyLevel } from "src/types/aggregationType";

export const HierarchyLevels: HierarchyLevel[] = [
  "LegalEntity|Account|Symbol|Position",
  "LegalEntity|Account|Position",
  "LegalEntity|Symbol|Position",
  "Symbol|Position",
];

export const HierarchyLevelConstant = {
  LEACCSYMPOS: "LegalEntity|Account|Symbol|Position",
  LEACCPOS: "LegalEntity|Account|Position",
  LESYMPOS: "LegalEntity|Symbol|Position",
  SYMPOS: "Symbol|Position",
};
