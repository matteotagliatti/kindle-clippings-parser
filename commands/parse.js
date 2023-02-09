import fs from "fs";
import os from "os";
const homedir = os.homedir();

export function parse(file) {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const separator = "==========";
    const timestampRegex = /Aggiunto in|Added in\:*/;
    const notes = data.split(separator);

    const parsed = notes
      .map((note) => {
        const attributes = note.split("\n");
        const cleanedUpAttributes = attributes.filter(
          (attr) => attr !== "\r" && attr !== ""
        );

        if (cleanedUpAttributes.length < 3) return null;

        const title = cleanedUpAttributes[0]
          .replace(/[\n\r]+/g, "")
          .replace(/^\uFEFF/gm, "")
          .replace(/^\u00BB\u00BF/gm, "");
        const text = cleanedUpAttributes[2].replace(/[\n\r]+/g, "");
        const timestamp = cleanedUpAttributes[1]
          .replace(/[\n\r]+/g, "")
          .split(timestampRegex)
          .filter(Boolean)[1];

        return { title: title, text: text, timestamp: timestamp };
      })
      .filter((value) => value);

    const groupByTitles = groupBy("title");
    const grouped = groupByTitles(parsed);

    const dir = `${homedir}/clippings-parsed`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    Object.keys(grouped).forEach((key) => {
      const filename = key.replace(/[^a-z0-9]/gi, "_").toLowerCase() + ".md";
      const content = grouped[key]
        .map((note) => {
          return `${note.text}\n`;
        })
        .join("\n");
      fs.writeFileSync(`${dir}/${filename}`, content);
      console.log(`File ${filename} created`);
    });
  });
}

const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});
