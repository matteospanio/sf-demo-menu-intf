import { BasicTasteConfiguration, Emotion, Optional, OtherSlideableConfig, Section, Shape, Texture } from "./utils"

export type Dish = {
  description: Optional<string>
  emotions: Emotion[]
  name: string
  section: Section
  tastes: {
    basic: BasicTasteConfiguration
    other: OtherSlideableConfig
  }
  textures: Texture[]
  vision: {
    colors: string[]
    shapes: Shape[]
  }
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

export function updateDishList<T extends Dish>(list: T[], id: string, element: T): T[] {
  return list.map((el) => el.name === id ? element : el)
}

export function deleteListDish<T extends Dish>(list: T[], id: string): T[] {
  return list.filter((el) => el.name !== id)
}

enum SaveStatus {
  nameRequired = 'nameRequired',
  dishUpdated = 'dishUpdated',
  dishSaved = 'dishSaved'
}

export const saveDish = (id: string, state: Dish, dishes: Dish[]): [Dish[], SaveStatus] => {
  let res = []
  let status;

  if (!state.name) {
    return [dishes, SaveStatus.nameRequired]
  }

  if (dishes.find((dish) => dish.name === id)) {
    res = updateDishList(dishes, id, state)
    status = SaveStatus.dishUpdated
  } else {
    res = [...dishes, state]
    status = SaveStatus.dishSaved
  }

  return [res, status]
}