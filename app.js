const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises
const sharp = require('sharp');
const inquirer = require('inquirer');

const allowedTypes = [".jpg"]
let sizes = [1000, 500, 200]

ResizeImage = (imagePath) => {
    imagePath = path.join("images", imagePath);
    console.log(`imagePath: ${imagePath}`);
    sizes.map((size) => {

        sharp(imagePath)
            .resize(size)
            .jpeg()
            .toFile(path.join("RESIZED_images", `RESIZED_${size}_${path.basename(imagePath)}`))
            .then((data) => {
                console.log("data", data);
            })
            .catch(err => {
                console.log(`error: ${err}`);
            })
    })
}

PromiseGetImages = async () => {
    const files = await fsPromises.readdir("./images");
    files.map(image => {
        allowedTypes.includes(path.extname(image).toLowerCase()) ? ResizeImage(image) : console.log(`${image} is not allowed type`);
    })
}

const Start = () => {
    inquirer.prompt([{
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["make images smaller"]
    }]).then((answers) => {
        console.log(answers);
        PromiseGetImages();
    })
}

Start();