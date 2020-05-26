// open txt file
let file = await Deno.open("greet.txt");

// copy text to stdout
await Deno.copy(file, Deno.stdout);

// close file
file.close();
