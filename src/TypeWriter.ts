
export class EasyWriter {

    private config: EasyWriterConfig = {
        element: '.easy-writer',
        typeDelay: 150,
        loop: false,
        loopFrom: 0,
        hideCursorOnEnd: false
    };
    private _writes: Array<{ text: string; delay: number }> = [];
    private _eraseNum = 0;
    private _charsNum = 0;
    private _typingStarted = false;
    private _currentWritesIndex = 0;

    /**
     * @typedef {object} EasyWriterConfig - EasyWriter configuration
     * @property {string|HTMLElement} element - Element to type into
     * @property {number} typeDelay - Delay between each character typed
     * @property {number} loop - Loop after last text was typed
     * @prop {number} loopFrom - Index to start loop from
     * @prop {number} hideCursorOnEnd - Hide cursor at end of typing 
     * @param {EasyWriterConfig} config 
     */
    constructor(config: Partial<EasyWriterConfig> = {}) {

        this.config = { ...this.config, ...config };
        if (typeof this.config.element == 'string') {
            this.config.element = document.querySelector(this.config.element) as HTMLElement;
        }
        if (!(this.config.element instanceof HTMLElement)) {
            throw new Error("EasyWriter: Could not find element");
        }
    }

    /**
     * Set a text to be written after some delay. Delay is relative to when last text was finished
     * 
     * @param {string} text - Text to be written
     * @param {number} [delay=0] - Delay before start writing the text
     * @returns {EasyWriter}
     */
    write(text: string, delay: number = 0): EasyWriter {
        if (this._typingStarted) {
            throw new Error('EasyWriter: Cannot write after typing has already started');
        }
        this._charsNum += text.length;
        this._writes.push({
            text,
            delay
        });
        return this;
    }

    /**
     * Erase give number of characters after delay
     * 
     * @param {number} count - Number of characters to be erased
     * @param {number} [delay=0] - Delay before erase starts
     * @returns {EasyWriter}
     */
    erase(count: number, delay: number = 0): EasyWriter {
        this._eraseNum += count;
        this._charsNum -= count;

        this.write('\r'.repeat(count), delay);
        return this;
    }

    /**
     * Erase last text written. Should not be called consecutively, only after a write call to avoid unexpected results
     * 
     * @param {number} delay - Delay before erase starts
     * @returns {EasyWriter}
     */
    eraseLast(delay: number): EasyWriter {
        const last = this._writes.slice(-1)[0];
        if (!last) {
            throw new Error('EasyWriter: Cannot eraseLast, last element does not exist');
        }
        const count = last.text.length;
        this.erase(count, delay);
        return this;
    }

    /**
     * Erase all text from Element, including text that was already there previously in the DOM and was not written by EasyWriter
     * 
     * @param {number} delay - Delay before erase starts
     * @returns {EasyWriter}
     */
    eraseAll(delay: number): EasyWriter {
        const textElementLength = (this.config.element as HTMLElement).innerText.length;
        this.erase(textElementLength + this._charsNum - this._eraseNum, delay);
        return this;
    }

    /**
     * Start typing. Cannot make changes to text or delay after typing starts
     * 
     * @returns {EasyWriter}
     */
    start(): EasyWriter {
        this._typingStarted = true;
        if (!this._writes.length) {
            return this;
        }

        const firstWriteEl = this._writes[this._currentWritesIndex]!;
        setTimeout(() => {
            this.#type(firstWriteEl.text);
        }, firstWriteEl.delay || 0)
        return this;
    }


    #type(text: string): void {
        this.#toggleCursor(false);
        let index = 0;
        let intervalId = setInterval(() => {
            const isFinished = index === text.length;
            if (isFinished) {
                this.#toggleCursor(true);
                clearInterval(intervalId);
                this._currentWritesIndex++;
                const nextWrite = this._writes[this._currentWritesIndex];
                if (nextWrite) {
                    setTimeout(() => {
                        this.#type(nextWrite.text)
                    }, nextWrite.delay || 0);
                } else if (this.config.loop) {
                    this._currentWritesIndex = this.config.loopFrom;
                    this.start();
                } else if (this.config.hideCursorOnEnd) {
                    this.hideCursor();
                }
                return;
            }
            let char = text.substring(index, index + 1);
            index++;
            if (char === '\r') {
                (this.config.element as HTMLElement).innerText = (this.config.element as HTMLElement).innerText.slice(0, -1);
                return;
            }
            (this.config.element as HTMLElement).innerText += char;
        }, this.config.typeDelay);
    }

    #toggleCursor(show: boolean) {
        (this.config.element as HTMLElement).classList.toggle('typing', !show);
    }

    private hideCursor() {
        (this.config.element as HTMLElement).classList.add('hide-cursor');
    }
}

interface EasyWriterConfig {
    element: string | HTMLElement;
    typeDelay: number;
    loop: boolean;
    loopFrom: number;
    hideCursorOnEnd: boolean;
}
