import { describe, it, expect } from 'vitest'
import { capitalize, Section, Emotion, Texture, Shape } from './utils'

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
})
