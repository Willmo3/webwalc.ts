import {lex} from "./lexer";

const program = "3 + 5 - -8";
console.log(lex(program));