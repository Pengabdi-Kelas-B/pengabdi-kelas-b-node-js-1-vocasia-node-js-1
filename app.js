const fs = require("node:fs");
const path = require("node:path");
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {}

// script pembuatan folder
 app.makeFolder = () => {
    rl.question("Masukan Nama Folder : ",(folderName) => {
        fs.mkdir(path.join(__dirname, folderName), (err) => {
            if (err) return console.error("Folder kamu gagal di buat:", err);
            console.log("Yeay, Folder kamu berhasil di buat:", folderName);
            rl.close();           
        });
    });
} ;
// script pembuatan file
 app.makeFile = () => {
    rl.question("Masukan Nama File (dan nama ekstensi) : ",(fileName) => {
        fs.writeFile(path.join(__dirname, fileName), "",(err) => {
            if (err) return console.error("File kamu gagal di buat:", err);
            console.log("Yeay, File kamu berhasil di buat:", fileName);
            rl.close();           
        });
    });
} ;
// script untuk merapihkan file berdasarkan ekstensi
 app.extSorter = () => {
    const sourceDir = path.join(__dirname, "unorganizer_folder");
    fs.readdir(sourceDir, (err, files) => {
        if (err) return console.error("Folder kamu gagal dibaca:", err);

        files.forEach((file) => {
            const ext = path.extname(file).substring(1); //mendapatkan ekstensi file
            const desDir = path.join(__dirname, ext);

            if (!fs.existsSync(destDir)) fs.mkdirSync(destDir);

            fs.rename(path.join(sourceDir, file), path.join(destDir, file), (err) => {
                if (err) console.error("File kamu gagal dipindahkan:", err);
                else console.log(`yeay File ${file} berhasil dipindahkan ke folder ${ext}`);
         });
      });
   });
} ;
// script untuk membaca isi folder
app.readFolder = () => {
    rl.question("Masukkan nama folder yang ingin di baca: ", (folderName) =>{
        const dirPath = path.join(__dirname, folderName);
        fs.readdir(dirPath, (err, files) => {
            if (err) return console.error("Gagal membaca folder:", err);

            const fileDetails = files.map((file) => {
                const filePath = path.join (dirPath, file);
                const stats = fs.statSync(filePath);
                return {
                    namaFile: file,
                    extensi: path.extname(file).substring(1),
                    jenisFile: ["jpg", "png"].includes(path.extname(file).substring(1))
                    ? "gambar"
                    : "text",
                    tanggalDibuat: stats.birthtime.toISOString().split("T")[0],
                    ukuranFile: `${(stats.size / 1024).toFixed(2)}kb`,
                };
            });
            
            fileDetails.sort(
                (a,b) => new Date(a.tanggalDibuat) - new Date(b.tanggalDibuat)
            );
            console.log(JSON.stringify(fileDetails, null, 2));
            rl.close();
        });
    });
};
// Fungsi untuk membaca isi file
app.readFile = () => {
    rl.question ("Masukkan nama file yang ingin dibaca: ", (fileName) => {
        const filePath = path.join(__dirname, fileName);
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) return console.error("Gagal membaca file:", err);
            console.log(`Isi dari file ${fileName} :\n\n${data}`);
            rl.close();
        });
    });
};

module.exports = app;