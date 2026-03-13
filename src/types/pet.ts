export type PetSpecies = "golden-hamster" | "campbell" | "capybara";

export type PetState = {
  species: PetSpecies;
  name: string;
  level: number;
  xp: number;
  mood: number;
  coins: number;
  failShield: number;
  accessoriesOwned: string[];
  equippedAccessory: string;
};
