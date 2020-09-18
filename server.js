require('dotenv/config');
const sharp = require('sharp');
const fs = require('fs').promises;

const compress = async () => {
  const directory = await fs.readdir(process.env.SRC_FOLDER);

  const pattern = new RegExp('^.*.(jpg|JPG|gif|GIF|png|PNG)$');

  const files = directory.filter(file => pattern.test(file));

  if (files.length > 0) {
    await Promise.all(
      files.map(async file => {
        const content = await fs.readFile(`${process.env.SRC_FOLDER}/${file}`);
        const compressContent = await sharp(content)
          .resize(Number(process.env.WIDTH), Number(process.env.HEIGHT), {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .toFormat('jpeg', {
            progressive: true,
            quality: 90,
          })
          .toBuffer();

        await fs.writeFile(
          `${process.env.DEST_FOLDER}/${file}`,
          compressContent
        );
      })
    );
  }
};

compress();
