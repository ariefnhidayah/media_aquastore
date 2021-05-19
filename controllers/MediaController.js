const { Media } = require("../models");
const isBase64 = require("is-base64");
const base64Img = require("base64-img");
const fs = require("fs");

const { HOSTNAME } = process.env;

module.exports = {
  getAll: async (req, res) => {
    const media = await Media.findAll({
      attributes: ["id", "image"],
    });

    media.map((element) => {
      element.image = `${HOSTNAME}/${element.image}`;
    });

    return res.json({
      status: "success",
      data: media,
    });
  },
  add: async (req, res) => {
    const { image } = req.body;

    if (!isBase64(image, { mimeRequired: true })) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid image!" });
    } else {
      base64Img.img(
        image,
        "./public/images",
        Date.now(),
        async (error, filepath) => {
          if (error) {
            return res.status(400).json({
              status: "error",
              message: error.message,
            });
          } else {
            const filename = filepath.split("\\").pop().split("/").pop();

            const media = await Media.create({
              image: `images/${filename}`,
            });

            return res.json({
              status: "success",
              data: {
                id: media.id,
                image: `${HOSTNAME}/images/${filename}`,
              },
            });
          }
        }
      );
    }
  },
  delete: async (req, res) => {
    const { id } = req.params;

    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({
        status: "error",
        message: "Image not found!",
      });
    } else {
      fs.unlink(`./public/${media.image}`, async (err) => {
        if (err) {
          return res.status(400).json({
            status: "error",
            message: err.message,
          });
        } else {
          await media.destroy();

          return res.json({
            status: "success",
            message: "Image deleted!",
          });
        }
      });
    }
  },
  delete_by_image: async (req, res) => {
    const { image } = req.body;
    const split = image.split("/");
    const subfolder1 = split[split.length - 2];
    const subfolder2 = split[split.length - 1];
    const fixedImage = subfolder1 + "/" + subfolder2;
    const media = await Media.findOne({
      where: {
        image: fixedImage,
      },
    });
    if (!media) {
      return res.status(404).json({
        status: "error",
        message: "Image not found!",
      });
    } else {
      fs.unlink(`./public/${media.image}`, async (err) => {
        if (err) {
          return res.status(400).json({
            status: "error",
            message: err.message,
          });
        } else {
          await media.destroy();

          return res.json({
            status: "success",
            message: "Image deleted!",
          });
        }
      });
    }
  },
};
