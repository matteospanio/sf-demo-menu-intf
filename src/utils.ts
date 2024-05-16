export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export type Dish = {
    name: string
    description?: string
    sweet?: number
    bitter?: number
    sour?: number
    salty?: number
    umami?: number
    piquant?: number
    fat?: number
    temperature?: number
    texture?: number
    shape?: number
    color?: string
}