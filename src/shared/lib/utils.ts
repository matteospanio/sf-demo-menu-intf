export type Optional<T> = T | null

export interface Indexable {
  [key: string]: unknown
}

export enum Emotion {
  Joy = 'joy',
  Anger = 'anger',
  Fear = 'fear',
  Sadness = 'sadness',
  Surprise = 'surprise',
  Satisfaction = 'satisfaction',
  Gratitude = 'gratitude',
  Hope = 'hope',
  Love = 'love',
  Serenity = 'serenity',
  Euphoria = 'euphoria',
  Conviviality = 'conviviality',
  Playfulness = 'playfulness',
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
  Solid = 'solid',
  Rough = 'rough',
  Hard = 'hard',
  Viscous = 'viscous',
  Airy = 'airy',
  Dense = 'dense',
  Hollow = 'hollow',
  Porous = 'porous',
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

export interface SelectOption<T> {
  label: string,
  value: T
}

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
