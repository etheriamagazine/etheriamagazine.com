import { $ } from "bun";
import { urlize } from "urlize";

const prompt = "Título del post: ";
process.stdout.write(prompt);

let title = "";
let fileNameBase = "";

for await (const line of console) {
  title = line;
  fileNameBase = urlize(line);
  break;
}

// run hugo new passing the title as env variable (see archetypes/default.md)
await $`HUGO_NEW_TITLE="${title}" hugo new --kind post posts/$(date "+%Y/%m")/${fileNameBase}.md`;
