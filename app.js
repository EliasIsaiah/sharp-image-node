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
        .toFile(path.join("RESIZED_images", `RESIZED_${path.basename(imagePath)}`))
        .then((data) => {
            console.log("data",data);
        })
        .catch(err => {
            console.log(`error: ${err}`);
        })
}

PromiseGetImages = async () => {
    const files = await fsPromises.readdir("./images");
    files.filter(image => {
        console.log(`path.extname(image) returns ${path.extname(image)}`);
        allowedTypes.includes(path.extname(image).toLowerCase()) ? ResizeImage(image) : console.log(`${image} is not allowed type`);
    })
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