export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

type Optional<T> = T | null

export type Dish = {
    name: string
    description: Optional<string>
    sweet: Optional<number>
    bitter: Optional<number>
    sour: Optional<number>
    salty: Optional<number>
    umami: Optional<number>
    piquant: Optional<number>
    fat: Optional<number>
    temperature: Optional<number>
    texture: Optional<number>
    shape: Optional<number>
    color: Optional<string>
}