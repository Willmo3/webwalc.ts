// TypeScript lexer for



// Inter
export interface Lexeme {
    Type: 'Number' | 'OpenParen' | 'CloseParen' | 'Plus' | 'Minus' | 'Star' | 'Slash' | 'EOF';
}

export function lex(data: string): Array<Lexeme> {
    const tokens: Array<Lexeme> = []
    return tokens
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

    LexNext(): Lexeme {
        while (this.whitespace()) {
            this.skip();
        }
        // If after skipping whitespace out of bounds, return EOF
        if (!this.inBounds()) {
            return { Type: 'EOF' };
        }

        const start = this.next();
        switch (start) {
            case '(': return { Type: 'OpenParen' };
            case ')': return { Type: 'CloseParen' };
            case '*': return { Type: 'Star' };
            case '/': return { Type: 'Slash'};
            case '+': return { Type: 'Plus' };
            case '-': {
                // minus can be the start of a number or just a minus sign.
                if (this.inBounds() && this.number()) {
                    // TODO: implement number parsing.
                } else {
                    return { Type: 'Minus' }
                }
            }

        }
    }

    // ---- Lexing Helpers:

    // Lex a numeric literal, starting with char.
    // All numbers are converted to floats.
    lex_number(start: string): Lexeme {
        if (!this.isNumeric(start) && !(start == '-')) throw new Error('Invalid number');

        while (this.inBounds() && this.current() != '.') {
            start += this.current();
        }

        // If the next character isn't a decimal point, we've got an integer.
        if (!this.inBounds() || this.current() != '.') {
        }
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
        return !isNaN(Number(char));
    }

    whitespace(): boolean {
        return this.inBounds() && ( this.current() == ' ' || this.current() == '\n' );
    }
}