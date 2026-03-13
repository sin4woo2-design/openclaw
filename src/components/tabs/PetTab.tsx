import type { PetSpecies, PetState } from "../../types";

type ShopItem = { id: string; name: string; price: number };

type PetMeta = { label: string; emoji: string; ability: string };

type PetTabProps = {
  petMotion: boolean;
  onMotion: () => void;
  petMeta: PetMeta;
  pet: PetState;
  petSpeciesMeta: Record<PetSpecies, PetMeta>;
  accessoryShop: ShopItem[];
  setSpecies: (species: PetSpecies) => void;
  petInteract: (kind: "feed" | "pet" | "play") => void;
  equipAccessory: (id: string) => void;
  buyAccessory: (id: string, price: number) => void;
};

export function PetTab({
  petMotion,
  onMotion,
  petMeta,
  pet,
  petSpeciesMeta,
  accessoryShop,
  setSpecies,
  petInteract,
  equipAccessory,
  buyAccessory,
}: PetTabProps) {
  return (
    <main className="stack">
      <section className="card petShowcase">
        <button className={`pixelPet petImageWrap ${petMotion ? "active" : ""}`} onClick={onMotion}>
          <div className="petImageSprite" aria-label={`${petMeta.label} 캐릭터`} />
          <small>{petMeta.emoji}</small>
        </button>
        <h2>{pet.name}</h2>
        <p>Lv.{pet.level} · XP {pet.xp}/100 · 무드 {pet.mood}%</p>
        <div className="petActions">
          <button onClick={() => petInteract("feed")}>간식 주기</button>
          <button onClick={() => petInteract("pet")}>쓰다듬기</button>
          <button onClick={() => petInteract("play")}>놀아주기</button>
        </div>
        <small>특수 능력: {petMeta.ability}</small>
      </section>

      <section className="card">
        <h2>종류 선택</h2>
        <div className="speciesGrid">
          {(Object.keys(petSpeciesMeta) as PetSpecies[]).map((sp) => (
            <button key={sp} className={pet.species === sp ? "active" : ""} onClick={() => setSpecies(sp)}>
              {petSpeciesMeta[sp].emoji} {petSpeciesMeta[sp].label}
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>꾸미기 상점</h2>
        <p>코인: {pet.coins}</p>
        <div className="shopGrid">
          {accessoryShop.map((item) => {
            const owned = pet.accessoriesOwned.includes(item.id);
            const equipped = pet.equippedAccessory === item.id;
            return (
              <article key={item.id}>
                <strong>{item.name}</strong>
                <small>{item.price} 코인</small>
                {owned ? (
                  <button className={equipped ? "active" : ""} onClick={() => equipAccessory(item.id)}>{equipped ? "장착중" : "장착"}</button>
                ) : (
                  <button onClick={() => buyAccessory(item.id, item.price)} disabled={pet.coins < item.price}>구매</button>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
