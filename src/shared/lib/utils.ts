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

/**
 * Formats a date string as relative time (e.g., "5 hours ago", "just now").
 *
 * @param dateString - ISO date string to format
 * @param locale - Locale for formatting ('en' or 'it')
 * @returns Formatted relative time string
 *
 * @example
 * formatRelativeTime('2024-01-15T10:30:00Z', 'en') // "2 hours ago"
 * formatRelativeTime('2024-01-15T10:30:00Z', 'it') // "2 ore fa"
 */
export const formatRelativeTime = (dateString: string, locale: string = 'en'): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  const translations: Record<string, Record<string, string | ((n: number) => string)>> = {
    en: {
      justNow: 'just now',
      secondsAgo: (n: number) => n === 1 ? '1 second ago' : `${n} seconds ago`,
      minutesAgo: (n: number) => n === 1 ? '1 minute ago' : `${n} minutes ago`,
      hoursAgo: (n: number) => n === 1 ? '1 hour ago' : `${n} hours ago`,
      daysAgo: (n: number) => n === 1 ? '1 day ago' : `${n} days ago`,
      weeksAgo: (n: number) => n === 1 ? '1 week ago' : `${n} weeks ago`,
      monthsAgo: (n: number) => n === 1 ? '1 month ago' : `${n} months ago`,
      yearsAgo: (n: number) => n === 1 ? '1 year ago' : `${n} years ago`,
    },
    it: {
      justNow: 'adesso',
      secondsAgo: (n: number) => n === 1 ? '1 secondo fa' : `${n} secondi fa`,
      minutesAgo: (n: number) => n === 1 ? '1 minuto fa' : `${n} minuti fa`,
      hoursAgo: (n: number) => n === 1 ? '1 ora fa' : `${n} ore fa`,
      daysAgo: (n: number) => n === 1 ? '1 giorno fa' : `${n} giorni fa`,
      weeksAgo: (n: number) => n === 1 ? '1 settimana fa' : `${n} settimane fa`,
      monthsAgo: (n: number) => n === 1 ? '1 mese fa' : `${n} mesi fa`,
      yearsAgo: (n: number) => n === 1 ? '1 anno fa' : `${n} anni fa`,
    },
  }

  const t = translations[locale] || translations['en']

  if (diffSeconds < 10) {
    return t.justNow as string
  } else if (diffSeconds < 60) {
    return (t.secondsAgo as (n: number) => string)(diffSeconds)
  } else if (diffMinutes < 60) {
    return (t.minutesAgo as (n: number) => string)(diffMinutes)
  } else if (diffHours < 24) {
    return (t.hoursAgo as (n: number) => string)(diffHours)
  } else if (diffDays < 7) {
    return (t.daysAgo as (n: number) => string)(diffDays)
  } else if (diffWeeks < 4) {
    return (t.weeksAgo as (n: number) => string)(diffWeeks)
  } else if (diffMonths < 12) {
    return (t.monthsAgo as (n: number) => string)(diffMonths)
  } else {
    return (t.yearsAgo as (n: number) => string)(diffYears)
  }
}
