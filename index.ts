import {lex} from "./lexer";
import * as fs from "node:fs";

import * as readline from "node:readline";

// Must be two or three args
if (process.argv.length < 2 || process.argv.length > 3) {
    console.log("Invalid args!");
    console.log("Usage: npm run start [path to file]");
    process.exit(1);
}

const input = process.argv.length == 2 ? process.stdin : fs.createReadStream(process.argv[3]);

const rl = readline.createInterface({
    input: input,
    output: process.stdout,
});

for await (const line of rl) {
    console.log(lex(line));
}