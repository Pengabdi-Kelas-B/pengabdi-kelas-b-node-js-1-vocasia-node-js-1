const fs = require("node:fs");
const readline = require("node:readline");
const { promisify } = require("util");
const path = require("node:path");
const stat = promisify(fs.stat);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {};

// fitur membuat folder baru
app.makeFolder = () => {
  rl.question("Masukan Nama Folder : ", (folderName) => {
    fs.mkdir(__dirname + `/${folderName}`, () => {
      console.log("success created new folder");
    });
    rl.close();
  });
};

// fitur untuk membuat file baru
app.makeFile = () => {
  rl.question(
    "Masukkan Nama File (dengan ekstensi, contoh: catatan.txt): ",
    (fileName) => {
      const filePath = `${__dirname}/${fileName}`;

      try {
        fs.writeFileSync(filePath, "");
        console.log("Berhasil membuat file baru:", fileName);
      } catch (err) {
        console.error("Terjadi kesalahan saat membuat file:", err.message);
      } finally {
        rl.close();
      }
    }
  );
};
//fitur membaca isi folder
app.readFolder = async () => {
  rl.question("Masukkan Nama Folder untuk dibaca: ", async (folderName) => {
    const folderPath = path.join(__dirname, folderName);
    try {
      const files = fs.readdirSync(folderPath);
      const fileDetails = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(folderPath, file);
          const stats = await stat(filePath);
          return {
            namaFile: file,
            extensi: path.extname(file).slice(1),
            jenisFile: fs.lstatSync(filePath).isDirectory() ? "folder" : "file",
            tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
            ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`,
          };
        })
      );
      console.log(
        `Berhasil menampilkan isi dari folder ${folderName}:`,
        JSON.stringify(fileDetails, null, 2)
      );
    } catch (err) {
      console.error("Terjadi kesalahan saat membaca folder:", err.message);
    } finally {
      rl.close();
    }
  });
};

// fitur membaca isi file
app.readFile = () => {
  rl.question(
    "Masukkan Nama File (dengan ekstensi, contoh: cerpen.txt): ",
    (fileName) => {
      const filePath = path.join(__dirname, fileName);

      if (path.extname(fileName) !== ".txt") {
        console.error("Hanya file teks (.txt) yang dapat dibaca.");
        rl.close();
        return;
      }

      fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
          console.error("Terjadi kesalahan saat membaca file:", err.message);
        } else {
          console.log(`Isi dari file ${fileName}:\n\n${data}`);
        }
        rl.close();
      });
    }
  );
};

//  merapikan sebuah folder sesuai dengan extensi
app.extSorter = () => {
  rl.question("Masukkan Nama Folder untuk merapikan file: ", (folderName) => {
    const folderPath = path.join(__dirname, folderName);

    if (!fs.existsSync(folderPath)) {
      console.error("Folder tidak ditemukan:", folderName);
      rl.close();
      return;
    }

    fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.error("Terjadi kesalahan saat membaca folder:", err.message);
        rl.close();
        return;
      }

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = await stat(filePath);

        if (stats.isFile()) {
          const ext = path.extname(file).slice(1);
          const extFolderPath = path.join(__dirname, ext);

          if (!fs.existsSync(extFolderPath)) {
            fs.mkdirSync(extFolderPath);
            console.log(`Folder ${ext} telah dibuat.`);
          }

          const newFilePath = path.join(extFolderPath, file);
          fs.rename(filePath, newFilePath, (err) => {
            if (err) {
              console.error(`Gagal memindahkan file ${file}:`, err.message);
            } else {
              console.log(`File ${file} telah dipindahkan ke folder ${ext}.`);
            }
          });
        }
      }

      rl.close();
    });
  });
};

module.exports = app;
