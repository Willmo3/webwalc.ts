// TypeScript lexer for a simple calculator.
// Author: Will Morris

// Interface for the lexeme.
export interface Lexeme {
    type: 'Number' | 'OpenParen' | 'CloseParen' | 'Plus' | 'Minus' | 'Star' | 'Slash' | 'EOF';
    value?: Number; // Only a value if token is of type number.
}

export function lex(data: string): Array<Lexeme> {
    const lexer = new Lexer(data);
    lexer.lex();
    return lexer.lexemes;
}

// Lexer helper class.
class Lexer {
    data: String;
    index: number;
    lexemes: Array<Lexeme>;

    constructor(data: String) {
        this.data = data;
        this.index = 0;
        this.lexemes = [];
    }

    lex() {
        let lexeme = this.lexNext();
        while (lexeme.type !== 'EOF') {
            this.lexemes.push(lexeme);
            lexeme = this.lexNext();
        }
        // Push EOF lexeme
        this.lexemes.push(lexeme);
    }

    lexNext(): Lexeme {
        while (this.whitespace()) {
            this.skip();
        }
        // If after skipping whitespace out of bounds, return EOF
        if (!this.inBounds()) {
            return { type: 'EOF' };
        }

        const start = this.next();
        switch (start) {
            case '(': return { type: 'OpenParen' };
            case ')': return { type: 'CloseParen' };
            case '*': return { type: 'Star' };
            case '/': return { type: 'Slash'};
            case '+': return { type: 'Plus' };
            case '-': {
                // minus can be the start of a number or just a minus sign.
                if (this.inBounds() && this.number()) {
                    return this.lexNumber(start);
                } else {
                    return { type: 'Minus' };
                }
            }
            default: {
                if (this.isNumeric(start)) {
                    return this.lexNumber(start);
                } else {
                    throw new Error("Unexpected character: " + this.current());
                }
            }
        }
    }

    // ---- Lexing Helpers:

    // Lex a numeric literal, starting with char.
    // All numbers are converted to floats.
    lexNumber(start: string): Lexeme {
        if (!this.isNumeric(start) && !(start == '-')) throw new Error('Invalid number');

        while (this.inBounds() && this.number()) {
            start += this.next();
        }

        // If the next character isn't a decimal point, we've got an integer.
        if (!this.inBounds() || this.current() != '.') {
            return { type: 'Number', value: Number(start) };
        }

        // Otherwise, keep parsing a float.
        start += this.next();
        if (!this.inBounds() || !this.number()) throw new Error('Unterminated float!');

        while (this.inBounds() && this.number()) {
            start += this.next();
        }

        return { type: 'Number', value: Number(start) };
    }


    // ---- Assorted Helpers:

    // Get the character under the scanner.
    current(): string {
        this.assertInBounds();
        return this.data[this.index];
    }

    // Advance the scanner and return the character previously under the cursor.
    next(): string {
        this.assertInBounds();
        const retval = this.current();
        this.index++;
        return retval;
    }

    skip() {
        this.index += 1;
    }

    // Bounds checkers

    inBounds(): boolean {
        return this.index < this.data.length;
    }
    // Some functions require in bounds to operate.
    assertInBounds() {
        if (!this.inBounds()) throw new Error("Out of bounds!");
    }

    // Character type checkers

    number(): boolean {
        return this.isNumeric(this.current());
    }
    isNumeric(char: string): boolean {
        return char != ' ' && !isNaN(Number(char));
    }

    whitespace(): boolean {
        return this.inBounds() && ( this.current() == ' ' || this.current() == '\n' );
    }
}