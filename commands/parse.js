import fs from "fs";

export function parse(file) {
  // read the file
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
    console.log(parsed);
  });
}
