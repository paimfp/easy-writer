export declare class EasyWriter {
    #private;
    private config;
    private _writes;
    private _eraseNum;
    private _charsNum;
    private _typingStarted;
    private _currentWritesIndex;
    /**
     * @typedef {object} EasyWriterConfig - EasyWriter configuration
     * @property {string|HTMLElement} element - Element to type into
     * @property {number} typeDelay - Delay between each character typed
     * @property {number} loop - Loop after last text was typed
     * @prop {number} loopFrom - Index to start loop from
     * @prop {number} hideCursorOnEnd - Hide cursor at end of typing
     * @param {EasyWriterConfig} config
     */
    constructor(config?: Partial<EasyWriterConfig>);
    /**
     * Set a text to be written after some delay. Delay is relative to when last text was finished
     *
     * @param {string} text - Text to be written
     * @param {number} [delay=0] - Delay before start writing the text
     * @returns {EasyWriter}
     */
    write(text: string, delay?: number): EasyWriter;
    /**
     * Erase give number of characters after delay
     *
     * @param {number} count - Number of characters to be erased
     * @param {number} [delay=0] - Delay before erase starts
     * @returns {EasyWriter}
     */
    erase(count: number, delay?: number): EasyWriter;
    /**
     * Erase last text written. Should not be called consecutively, only after a write call to avoid unexpected results
     *
     * @param {number} delay - Delay before erase starts
     * @returns {EasyWriter}
     */
    eraseLast(delay: number): EasyWriter;
    /**
     * Erase all text from Element, including text that was already there previously in the DOM and was not written by EasyWriter
     *
     * @param {number} delay - Delay before erase starts
     * @returns {EasyWriter}
     */
    eraseAll(delay: number): EasyWriter;
    /**
     * Start typing. Cannot make changes to text or delay after typing starts
     *
     * @returns {EasyWriter}
     */
    start(): EasyWriter;
    private hideCursor;
}
interface EasyWriterConfig {
    element: string | HTMLElement;
    typeDelay: number;
    loop: boolean;
    loopFrom: number;
    hideCursorOnEnd: boolean;
}
export {};
