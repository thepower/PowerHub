/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line
import { google } from 'googleapis';
import path from 'path';
// eslint-disable-next-line import/extensions
import parse from 'csv-parse/lib/sync.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const drive = google.drive('v3');

const auth = new google.auth.GoogleAuth({
  keyFilename: path.join(__dirname, './regal-sun-332215-9c9a74b9465e.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});

google.options({ auth });

const fileId = '1qhCzGaDhJ33yNFEKN4VKlA2ZKqNvCsHDRkrCO5wOJVY';

async function loadLocales() {
  const res = await drive.files.export({
    fileId,
    mimeType: 'text/csv',
  });
  const parsedData = parse(res.data, {
    skip_empty_lines: true,
    columns: true,
  });
  if (res.data) {
    const langs = ['en', 'ru', 'th'];

    const locales = langs.reduce((sum, value) => {
      sum[value] = parsedData.reduce((sum2, value2) => {
        sum2[value2.KEY] = value2[value.toUpperCase()];
        return sum2;
      }, {});
      return sum;
    }, {});

    for (const key in locales) {
      if (Object.prototype.hasOwnProperty.call(locales, key)) {
        const element = { translation: locales[key] };
        const json = JSON.stringify(element, null, 2);
        try {
          await new Promise((resolve, reject) => {
            fs.writeFile(
              path.join(__dirname, `/locales/${key}.json`),
              json,
              (err) => {
                if (err) reject(err);
                resolve(true);
              },
            );
          });
        } catch (error) {
          console.error(error);
        }
      }
    }
  }
}

loadLocales();
