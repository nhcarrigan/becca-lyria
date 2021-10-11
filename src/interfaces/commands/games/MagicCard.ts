export interface MagicCard {
  cards: {
    name: string;
    manaCost: string;
    cmc: number;
    colors: string[];
    colorIdentity: string[];
    type: string;
    supertypes: unknown[];
    types: string[];
    subtypes: string[];
    rarity: string;
    set: string;
    setName: string;
    text: string;
    flavor: string;
    artist: string;
    number: string;
    power: string;
    toughness: string;
    layout: string;
    multiverseid: number;
    imageUrl: string;
    rulings: Record<string, unknown>[];
    foreignNames: Record<string, unknown>[];
    printings: string[];
    originalText: string;
    originalType: string;
    legalities: Record<string, unknown>[];
    id: string;
  }[];
}
