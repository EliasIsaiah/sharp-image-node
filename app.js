const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises
const sharp = require('sharp');
const inquirer = require('inquirer');

const allowedTypes = [".jpg", ".tif"]
// let sizes = [1000, 500, 200];
let sizes = [3840, 2560, 1920, 1366, 1024];

ResizeImage = (imagePath) => {
    sizes.map((size) => {

        let newImagePath = path.join("images", "resized", `RESIZED_images_${size}`, `RESIZED_${size}_${path.parse(imagePath).name}.jpg`)
        console.log(`imagePath: ${imagePath}`);
        console.log(`newImagePath: ${newImagePath}`);

        // sharp(path.join("originals", `${imagePath}`))
        sharp(path.join("images", "originals", imagePath))
            .resize(size)
            .jpeg()
            // .toBuffer()
            .toFile(newImagePath)
            .then(info => { console.log("info", info) })
            .catch(err => { console.log("error:", err); })
    })
}

PromiseGetImages = async function () {
    try {
        try {
            await fsPromises.stat(path.join("images"));
        } catch (error) {
            switch (error.code) {
                case "ENOENT":
                    await fsPromises.mkdir(path.join("images"));
                    break;
                default:
                    throw error;
            }
        }
        try {
            await fsPromises.stat(path.join("images", "originals"));
        } catch (error) {
            switch (error.code) {
                case "ENOENT":
                    await fsPromises.mkdir(path.join("images", "originals"));
                    break;
                default:
                    throw error;
            }
        }
        try {
            await fsPromises.stat(path.join("images", "resized"));
        } catch (error) {
            switch (error.code) {
                case "ENOENT":
                    for (size of sizes) {
                        await fsPromises.mkdir(path.join("images", "resized", `RESIZED_images_${size}`), { recursive: true });
                    }
                    break;
                default:
                    throw error;
            }
        }
        const files = await fsPromises.readdir(path.join("images", "originals"));
        files.map(image => {
            console.log("path parse name", path.parse(image).name);
            allowedTypes.includes(path.extname(image).toLowerCase()) ? ResizeImage(image) : console.log(`${image} is not allowed type`);
        })
    } catch (error) { console.log(error); }
}

const questions = [
    {
        type: "list",
        name: "command",
        message: "What would you like to do?",
        choices: ["make images smaller"]
    },
    {
        type: "list",
        name: "size",
        message: "What width would you like your images to be? (Height automatically scales)",
        choices: ["3840", "2560", "1920", "1366", "1024", "other"]
    }
]

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