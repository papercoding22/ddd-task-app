import { describe, it, expect } from 'vitest';
import { TaskTitle } from './TaskTitle';

describe('TaskTitle', () => {
  describe('create', () => {
    it('should create a valid task title', () => {
      const title = TaskTitle.create('Valid Task Title');
      expect(title.toString()).toBe('Valid Task Title');
    });

    it('should trim whitespace from title', () => {
      const title = TaskTitle.create('  Trimmed Title  ');
      expect(title.toString()).toBe('Trimmed Title');
    });

    it('should throw error for empty title', () => {
      expect(() => TaskTitle.create('')).toThrow('Task title cannot be empty');
    });

    it('should throw error for whitespace-only title', () => {
      expect(() => TaskTitle.create('   ')).toThrow('Task title cannot be empty');
    });

    it('should throw error for title exceeding max length', () => {
      const longTitle = 'a'.repeat(201);
      expect(() => TaskTitle.create(longTitle)).toThrow(
        'Task title cannot exceed 200 characters'
      );
    });

    it('should accept title at max length', () => {
      const maxLengthTitle = 'a'.repeat(200);
      const title = TaskTitle.create(maxLengthTitle);
      expect(title.toString()).toBe(maxLengthTitle);
    });
  });

  describe('toString', () => {
    it('should return the title value', () => {
      const title = TaskTitle.create('My Task');
      expect(title.toString()).toBe('My Task');
    });
  });
});
