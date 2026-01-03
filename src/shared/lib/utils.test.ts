import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { capitalize, Section, Emotion, Texture, Shape, formatRelativeTime, parseApiUtcDate } from './utils'

describe('Utils', () => {
  describe('capitalize', () => {
    it('capitalizes first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('handles empty string', () => {
      expect(capitalize('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('preserves rest of string', () => {
      expect(capitalize('hELLO')).toBe('HELLO')
    })

    it('handles already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('Section enum', () => {
    it('has correct values', () => {
      expect(Section.Appetizer).toBe('appetizer')
      expect(Section.FirstCourse).toBe('firstCourse')
      expect(Section.SecondCourse).toBe('secondCourse')
      expect(Section.Dessert).toBe('dessert')
      expect(Section.None).toBe('none')
    })
  })

  describe('Emotion enum', () => {
    it('has correct values', () => {
      expect(Emotion.Joy).toBe('joy')
      expect(Emotion.Anger).toBe('anger')
      expect(Emotion.Fear).toBe('fear')
      expect(Emotion.Sadness).toBe('sadness')
      expect(Emotion.Surprise).toBe('surprise')
      expect(Emotion.Satisfaction).toBe('satisfaction')
      expect(Emotion.Gratitude).toBe('gratitude')
      expect(Emotion.Hope).toBe('hope')
      expect(Emotion.Love).toBe('love')
      expect(Emotion.Serenity).toBe('serenity')
      expect(Emotion.Euphoria).toBe('euphoria')
      expect(Emotion.Conviviality).toBe('conviviality')
      expect(Emotion.Playfulness).toBe('playfulness')
    })
  })

  describe('Texture enum', () => {
    it('has correct values', () => {
      expect(Texture.Crunchy).toBe('crunchy')
      expect(Texture.Soft).toBe('soft')
      expect(Texture.Liquid).toBe('liquid')
      expect(Texture.Creamy).toBe('creamy')
      expect(Texture.Solid).toBe('solid')
      expect(Texture.Rough).toBe('rough')
      expect(Texture.Hard).toBe('hard')
      expect(Texture.Viscous).toBe('viscous')
      expect(Texture.Airy).toBe('airy')
      expect(Texture.Dense).toBe('dense')
      expect(Texture.Hollow).toBe('hollow')
      expect(Texture.Porous).toBe('porous')
    })
  })

  describe('Shape enum', () => {
    it('has correct values', () => {
      expect(Shape.Sharp).toBe('sharp')
      expect(Shape.Round).toBe('round')
      expect(Shape.Smooth).toBe('smooth')
      expect(Shape.Symmetric).toBe('symmetric')
      expect(Shape.Asymmetric).toBe('asymmetric')
      expect(Shape.Compact).toBe('compact')
      expect(Shape.Loose).toBe('loose')
    })
  })

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      // Mock current time to 2026-01-03T12:00:00Z
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2026-01-03T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('English locale', () => {
      it('returns "just now" for times less than 10 seconds ago', () => {
        const fiveSecondsAgo = new Date('2026-01-03T11:59:55Z').toISOString()
        expect(formatRelativeTime(fiveSecondsAgo, 'en')).toBe('just now')
      })

      it('returns seconds ago for times between 10 and 60 seconds', () => {
        const thirtySecondsAgo = new Date('2026-01-03T11:59:30Z').toISOString()
        expect(formatRelativeTime(thirtySecondsAgo, 'en')).toBe('30 seconds ago')
      })

      it('returns "1 second ago" for singular', () => {
        const elevenSecondsAgo = new Date('2026-01-03T11:59:49Z').toISOString()
        expect(formatRelativeTime(elevenSecondsAgo, 'en')).toBe('11 seconds ago')
      })

      it('returns minutes ago for times between 1 and 60 minutes', () => {
        const fiveMinutesAgo = new Date('2026-01-03T11:55:00Z').toISOString()
        expect(formatRelativeTime(fiveMinutesAgo, 'en')).toBe('5 minutes ago')
      })

      it('returns "1 minute ago" for singular', () => {
        const oneMinuteAgo = new Date('2026-01-03T11:59:00Z').toISOString()
        expect(formatRelativeTime(oneMinuteAgo, 'en')).toBe('1 minute ago')
      })

      it('returns hours ago for times between 1 and 24 hours', () => {
        const threeHoursAgo = new Date('2026-01-03T09:00:00Z').toISOString()
        expect(formatRelativeTime(threeHoursAgo, 'en')).toBe('3 hours ago')
      })

      it('returns "1 hour ago" for singular', () => {
        const oneHourAgo = new Date('2026-01-03T11:00:00Z').toISOString()
        expect(formatRelativeTime(oneHourAgo, 'en')).toBe('1 hour ago')
      })

      it('returns days ago for times between 1 and 7 days', () => {
        const threeDaysAgo = new Date('2025-12-31T12:00:00Z').toISOString()
        expect(formatRelativeTime(threeDaysAgo, 'en')).toBe('3 days ago')
      })

      it('returns "1 day ago" for singular', () => {
        const oneDayAgo = new Date('2026-01-02T12:00:00Z').toISOString()
        expect(formatRelativeTime(oneDayAgo, 'en')).toBe('1 day ago')
      })

      it('returns weeks ago for times between 1 and 4 weeks', () => {
        const twoWeeksAgo = new Date('2025-12-20T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoWeeksAgo, 'en')).toBe('2 weeks ago')
      })

      it('returns months ago for times between 1 and 12 months', () => {
        const twoMonthsAgo = new Date('2025-11-03T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoMonthsAgo, 'en')).toBe('2 months ago')
      })

      it('returns years ago for times more than 1 year', () => {
        const twoYearsAgo = new Date('2024-01-03T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoYearsAgo, 'en')).toBe('2 years ago')
      })

      it('defaults to English when no locale provided', () => {
        const fiveMinutesAgo = new Date('2026-01-03T11:55:00Z').toISOString()
        expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago')
      })
    })

    describe('Italian locale', () => {
      it('returns "adesso" for times less than 10 seconds ago', () => {
        const fiveSecondsAgo = new Date('2026-01-03T11:59:55Z').toISOString()
        expect(formatRelativeTime(fiveSecondsAgo, 'it')).toBe('adesso')
      })

      it('returns seconds ago in Italian', () => {
        const thirtySecondsAgo = new Date('2026-01-03T11:59:30Z').toISOString()
        expect(formatRelativeTime(thirtySecondsAgo, 'it')).toBe('30 secondi fa')
      })

      it('returns "1 secondo fa" for singular', () => {
        const elevenSecondsAgo = new Date('2026-01-03T11:59:49Z').toISOString()
        expect(formatRelativeTime(elevenSecondsAgo, 'it')).toBe('11 secondi fa')
      })

      it('returns minutes ago in Italian', () => {
        const fiveMinutesAgo = new Date('2026-01-03T11:55:00Z').toISOString()
        expect(formatRelativeTime(fiveMinutesAgo, 'it')).toBe('5 minuti fa')
      })

      it('returns "1 minuto fa" for singular', () => {
        const oneMinuteAgo = new Date('2026-01-03T11:59:00Z').toISOString()
        expect(formatRelativeTime(oneMinuteAgo, 'it')).toBe('1 minuto fa')
      })

      it('returns hours ago in Italian', () => {
        const threeHoursAgo = new Date('2026-01-03T09:00:00Z').toISOString()
        expect(formatRelativeTime(threeHoursAgo, 'it')).toBe('3 ore fa')
      })

      it('returns "1 ora fa" for singular', () => {
        const oneHourAgo = new Date('2026-01-03T11:00:00Z').toISOString()
        expect(formatRelativeTime(oneHourAgo, 'it')).toBe('1 ora fa')
      })

      it('returns days ago in Italian', () => {
        const threeDaysAgo = new Date('2025-12-31T12:00:00Z').toISOString()
        expect(formatRelativeTime(threeDaysAgo, 'it')).toBe('3 giorni fa')
      })

      it('returns weeks ago in Italian', () => {
        const twoWeeksAgo = new Date('2025-12-20T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoWeeksAgo, 'it')).toBe('2 settimane fa')
      })

      it('returns months ago in Italian', () => {
        const twoMonthsAgo = new Date('2025-11-03T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoMonthsAgo, 'it')).toBe('2 mesi fa')
      })

      it('returns years ago in Italian', () => {
        const twoYearsAgo = new Date('2024-01-03T12:00:00Z').toISOString()
        expect(formatRelativeTime(twoYearsAgo, 'it')).toBe('2 anni fa')
      })
    })

    describe('Unknown locale', () => {
      it('falls back to English for unknown locale', () => {
        const fiveMinutesAgo = new Date('2026-01-03T11:55:00Z').toISOString()
        expect(formatRelativeTime(fiveMinutesAgo, 'fr')).toBe('5 minutes ago')
      })
    })
  })

  describe('parseApiUtcDate', () => {
    it('treats timezone-less ISO strings as UTC', () => {
      expect(parseApiUtcDate('2026-01-03T10:30:00').toISOString()).toBe('2026-01-03T10:30:00.000Z')
    })

    it('treats timezone-less strings with space separator as UTC', () => {
      expect(parseApiUtcDate('2026-01-03 10:30:00').toISOString()).toBe('2026-01-03T10:30:00.000Z')
    })

    it('preserves explicit timezone offsets', () => {
      expect(parseApiUtcDate('2026-01-03T10:30:00+00:00').toISOString()).toBe('2026-01-03T10:30:00.000Z')
    })
  })
})
