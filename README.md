
# Mysql dump to google storage
Create an automatic mysql backup file and upload it on google storage.

I needed a free and automatic solution to maintain backups of my database without using my server space. So there it is.

[Google Storage](https://cloud.google.com/storage/docs/) has a free quota of 5gb storage.

### Tech
* Node 8.x
* Have MySQL installed and mysqldump on path

### Installation
Install the dependencies in the project folder:

```sh
$ npm install
```

Create a [Service Account](https://cloud.google.com/storage/docs/). Save the credentials in `credentials.json` 

### Execution
```sh
$ node .
```

### (Linux) Cronjob - Everyday, at midnight
```sh
0 0 * * * cd <project dir> && node .
```