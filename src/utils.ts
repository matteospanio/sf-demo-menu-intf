export type Optional<T> = T | null

export interface Indexable {
  [key: string]: any
}

export enum Emotion {
  Joy = 'joy',
  Anger = 'anger',
  Fear = 'fear',
  Surprise = 'surprise',
  Sadness = 'sadness',
}

export enum Shape {
  Sharp = 'sharp',
  Round = 'round',
  Smooth = 'smooth',
  Symmetric = 'symmetric',
  Asymmetric = 'asymmetric',
  Compact = 'compact',
  Loose = 'loose',
}

export enum Texture {
  Crunchy = 'crunchy',
  Soft = 'soft',
  Liquid = 'liquid',
  Creamy = 'creamy',
}

export enum Section {
  Appetizer = 'appetizer',
  FirstCourse = 'firstCourse',
  SecondCourse = 'secondCourse',
  Dessert = 'dessert',
  None = 'none'
}

export interface BasicTasteConfiguration extends Indexable {
  sweet: Optional<number>
  bitter: Optional<number>
  sour: Optional<number>
  salty: Optional<number>
  umami: Optional<number>
}

export interface OtherSlideableConfig extends Indexable {
  piquant: Optional<number>
  fat: Optional<number>
  temperature: Optional<number>
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
