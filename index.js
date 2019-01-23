const filename = 'dump.sql';
const fs = require('fs');
const spawn = require('child_process').spawn;
const wstream = fs.createWriteStream(filename);
const serviceAccount = require("./credentials.json");
const {
    Storage
} = require('@google-cloud/storage');
const bucketName = "MyProjectBucket"
const date = new Date();

//google storage auth
const storageClient = new Storage({
    projectId: serviceAccount.project_id,
    credentials: {
        private_key: serviceAccount.private_key,
        client_email: serviceAccount.client_email,
    },
});

// dump the result straight to a file
const doSQlDump = () => {
    const mysqldump = spawn('mysqldump', [
        '-u',
        'root',
        '-p<DATABASE_PASSWORD>',
        '<DATABASE_NAME>',
    ]);

    return new Promise((accept, reject) => {
        mysqldump
            .stdout
            .pipe(wstream)
            .on('finish', function () {
                accept();
            })
            .on('error', function (err) {
                console.log(err);
                reject();
            })
    });
}

// upload file in gcp
const uploadFile = () => {
    return storageClient.bucket(bucketName).upload(filename, {
        gzip: true,
        destination: `backups/dump_${("0" + date.getDate()).slice(-2)}_${("0" + (date.getMonth() + 1)).slice(-2)}_${date.getFullYear()}.sql`,
        metadata: {
            cacheControl: 'no-cache',
        },
    });
}

doSQlDump()
    .then(() => {
        console.log('Sql dump complete.');
        return uploadFile();
    })
    .then(() => {
        console.log('Dump file stored successfully');
        fs.unlinkSync(filename);
        console.log('Dump file deleted locally');
    });