import pc from "picocolors";

export function greet(name) {
  console.log(pc.green(`Hello, ${pc.bold(name)}!`));
}
