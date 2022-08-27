/**
 * Type definitions for leo-profanity version 1.3.0.
 * Project: https://github.com/jojoee/leo-profanity
 * Definitions by: Naomi Carrigan <https://github.com/nhcarrigan>.
 */
declare module "leo-profanity" {
  /**
   * Return current profanity words.
   */
  function list(): string[];

  /**
   * Check if the string contains
   * profanity.
   *
   * @param {string} str The string to check.
   */
  function check(str: string): boolean;

  /**
   * Replaces letters in a profane word with a placeholder.
   *
   * @param {string} str The string to replace.
   * @param {string} replaceKey The string to replace with.
   * @param {number} nbLetters The number of letters in `str` to replace.
   */
  function clean(str: string, replaceKey: string, nbLetters: number): string;
  /**
   * Get list of used profane words.
   *
   * @param {string} str The string to check.
   */
  function badWordsUsed(str: string): string[];

  /**
   * Add words to the list.
   *
   * @param {string | string[]} data The word or words to add.
   */
  function add(data: string | string[]): void;

  /**
   * Remove words from the list.
   *
   * @param {string | string[]} data The word or words to remove.
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
   *
   * @param {string} name The name of the dictionary to read.
   */
  function getDictionary(name: string): string[];

  /**
   * Load the word list from a dictionary to use
   * in the filter.
   *
   * @param {string} name The name of the dictionary to load.
   */
  function loadDictionary(name: string): void;
}
