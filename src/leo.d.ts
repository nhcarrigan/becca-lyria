/**
 * Type definitions for leo-profanity version 1.3.0.
 * Project: https://github.com/jojoee/leo-profanity
 * Definitions by: Nicholas Carrigan <https://github.com/nhcarrigan>.
 */
declare module "leo-profanity" {
  /**
   * Return current profanity words.
   */
  function list(): string[];

  /**
   * Check if the string contains
   * profanity.
   */
  function check(str: string): boolean;

  /**
   * Replaces profane words.
   */
  function clean(str: string, replaceKey: string, nbLetters: number): string;
  /**
   * Get list of used profane words.
   */
  function badWordsUsed(str: string): string[];

  /**
   * Add words to the list.
   */
  function add(data: string | string[]): void;

  /**
   * Remove words from the list.
   */
  function remove(data: string | string[]): void;

  /**
   * Reset the list.
   */
  function reset(): void;

  /**
   * Clear the word list.
   */
  function clearList(): void;

  /**
   * Return the word list from the dictionary.
   */
  function getDictionary(name: string): string[];

  /**
   * Load the word list from a dictionary to use
   * in the filter.
   */
  function loadDictionary(name: string): void;
}
