const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises
const sharp = require('sharp');
const inquirer = require('inquirer');

const allowedTypes = [".jpg"]

// const ResizeImages = () => {
//     return new Promise((resolve, reject) => {
//         fs.readdir("./images", (error, files) => {
//             error ? reject(error) : resolve(files);
//         });
//     });
// }

ResizeImage = (imagePath) => {
    imagePath = path.join("images", imagePath);
    console.log(`imagePath: ${imagePath}`);
    sharp(imagePath)
    .resize(200)
    .jpeg()
    .toFile(`RESIZED_${imagePath}`)
    .then((data) => {
        console.log(`data: ${data}`);
    })
    .catch( err => {
        console.log(`error: ${err}`);
    })
}

async function PromiseGetImages() {
    const files = await fsPromises.readdir("./images");
    const images = files.filter(image => {
        console.log(`path.extname(image) returns ${path.extname(image)}`);
        allowedTypes.includes(path.extname(image).toLowerCase()) ? ResizeImage(image) : console.log(`${image} is not allowed type`);
        // console.log(`allowedTypes.includes(path.extname(image).toLowerCase()) returns ${allowedTypes.includes(path.extname(image).toLowerCase())}`);
    })

    // for (const image of images) {
        // console.log(image)
    // }
}

const Start = () => {
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["Resize images"]
    }]).then((answers) => {
        console.log(answers);
        PromiseGetImages();
    })
}

Start();