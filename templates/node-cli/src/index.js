import { Command } from "commander";
import { greet } from "./commands/greet.js";

const program = new Command();

program
  .name("my-cli")
  .version("0.0.1")
  .description("A minimal CLI tool");

program
  .command("greet")
  .description("Print a greeting")
  .argument("[name]", "Name to greet", "World")
  .action((name) => {
    greet(name);
  });

export function run(argv) {
  program.parse(argv);
}
