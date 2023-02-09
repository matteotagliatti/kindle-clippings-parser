#! /usr/bin/env node
import { program } from "commander";
import { parse } from "./commands/parse.js";

program
  .command("parse <file>", { isDefault: true })
  .description("Parse a My Clippings.txt file generated from the Kindle")
  .action(parse);

program.parse();
