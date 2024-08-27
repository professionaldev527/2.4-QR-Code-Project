import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

// Function to generate QR code and save URL
const generateQRCode = (url) => {
  const qr_svg = qr.image(url);
  qr_svg.pipe(fs.createWriteStream("qr_img.png"));

  fs.writeFile("URL.txt", url, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
};

// Check if there's input from stdin (piped input)
const stdin = process.stdin;
stdin.setEncoding('utf-8');

let input = '';

stdin.on('data', function(chunk) {
    input += chunk;
});

stdin.on('end', function() {
    input = input.trim();
    if (input) {
        generateQRCode(input);
    } else {
        promptUser();
    }
});

// Function to prompt the user for a URL
const promptUser = () => {
  inquirer
    .prompt([
      {
        message: "Type in your URL: ",
        name: "URL",
        // default: "https://www.google.com",  // Default value is google.com
      },
    ])
    .then((answers) => {
      const url = answers.URL;
      generateQRCode(url);
    })
    .catch((error) => {
      if (error.isTtyError) {
        console.error("Prompt couldn't be rendered in the current environment.");
      } else {
        console.error("Something went wrong:", error);
      }
    });
};

// If stdin isn't readable (i.e., no piped input), prompt the user
if (!stdin.readable) {
    promptUser();
}