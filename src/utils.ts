export const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

type Optional<T> = T | null

export type Dish = {
    name: string
    description: Optional<string>
    section: Section
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

export enum Section {
    Appetizer = 'appetizer',
    FirstCourse = 'firstCourse',
    SecondCourse = 'secondCourse',
    Dessert = 'dessert',
    None = 'none'
}

export const makeSectionsList = (dishes: Dish[]): Map<Section, Dish[]> => {
    let res: Map<Section, Dish[]> = new Map();

    dishes.forEach(dish => {
        if (!res.has(dish.section)) {
            res.set(dish.section, []);
        }
        res.get(dish.section)?.push(dish);
    })

    return res
}
