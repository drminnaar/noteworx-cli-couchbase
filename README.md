# NoteWorx README

A basic note application that uses a CLI (Command Line Interface) frontend to capture and manage notes, and [Couchbase Server](https://www.couchbase.com) as a data store.

## Features

* Add a note
* Remove a note
* Find notes by:
  * id
  * title
  * tag
* List all notes
* Tag a note
* Update note

## High Level Design

![noteworx-cli-couchbase](https://user-images.githubusercontent.com/33935506/33528597-0381ce24-d86c-11e7-9e36-e2add1e1fc6f.PNG)

---

## Developed With

* [Node.js](https://nodejs.org/en/) - Javascript runtime
* [yargs](https://www.npmjs.com/package/yargs) - Helps build CLI tools
* [Couchbase Server](https://couchbase.com) - Document database to store data
* [Docker](https://www.docker.com/) - Used to host MongoDB instance (Not manadatory. See other options below)

---

## Related Projects

* [noteworx-cli-fs]
* [noteworx-cli-mongodb]
* [noteworx-cli-mongoose]

---

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

The following software is required to be installed on your system:

* NodeJS

  The following version of Node and Npm are required:

  * Node 8.x
  * Npm 3.x

  Type the following commands in the terminal to verify your node and npm versions

  ```bash
  node -v
  npm -v
  ```

* Couchbase Server

  Couchbase Server 5.x is required

  Type the following address into your browser to verify that Couchbase Server is running on your local machine

  ```bash
  http://localhost:8091
  ```

  See alternative Couchbase Server hosting options below

### Couchbase Server Setup

One of the 3 options below is recommended to get up and running with MongoDB:

* Install and host locally
* Install and host in container
* Host in the cloud

#### Install And Host Locally

Visit the [Couchbase Developer Portal](https://developer.couchbase.com/documentation/server/4.1/getting-started/installing.html) for instructions on installing Couchbase Server on your OS.

#### Install And Host In Container

To host couchbase in a Docker container, type the following in your terminal:

```bash
docker run -d --name cb-dev -p 8091-8094:8091-8094 -p 11210:11210 couchbase
```

Next, open `http://localhost:8091` in your browser

For more information, see [Couchbase Server Docker Hub](https://hub.docker.com/r/couchbase/server/) and [Couchbase Containers](https://www.couchbase.com/containers)

#### Host In The Cloud

Couchbase is available via the following cloud hosting providers:

* [AWS (Amazon Web Services) - Couchbase Enterprise Edition](http://amzn.to/2gTjEQP)

* [Azure (Microsoft Azure) - Couchbase Enterprise Edition](http://bit.ly/2zeOo6d)

* [GCP (Google Cloud Platform) - Couchbase Enterprise Edition](http://bit.ly/2lpH6Xh)

### Prepare Couchbase Server For NoteWorx

Once you have a Couchbase Server running, please visit these [instructions](https://developer.couchbase.com/documentation/server/current/clustersetup/create-bucket.html) on creating a Bucket. You will need to create a Bucket called 'noteworx' using all the default settings.

Once you have created the 'noteworx' Bucket, open the Query window and type the following command into the query editor:

```bash
CREATE PRIMARY INDEX `id-index` ON `noteworx` USING GSI;
```

At this point you have completed all that is required on the Couchbase Server for the application to work.

### Install

Follow the following steps to get development environment running.

1. Clone 'noteworx-cli-couchbase' repository from GitHub

   ```bash
   git clone https://github.com/drminnaar/noteworx-cli-couchbase.git
   ```

   _or using ssh_

   ```bash
   git clone git@github.com:drminnaar/noteworx-cli-couchbase.git
   ```

1. Install node modules

   ```bash
   cd noteworx-cli-couchbase
   npm install
   ```

### Run ESlint

* Lint project using ESLint

  ```bash
  npm run lint
  ```

* Lint project using ESLint, and autofix

  ```bash
  npm run lint:fix
  ```

### Run

* Run start

  This will run `node app --help` and show a list of CLI commands that can be used to manage notes

  ```javascript
  npm start
  ```

* Get help

  ```javascript
  node app --help
  node app add --help
  node app remove --help
  node app find --help
  node app list --help
  node app tag --help
  node app update --help
  ```

* Add a note

  ```javascript
  node app add -t "Programming homework for weekend" -c "Read 'The Art of Computer Programming, Volume 1" --tags "programming, homework"
  node app add -t "Programming homework for today" -c "Read 'Computer Science Illuminated" --tags 'homework'
  ```

* Remove a note

  ```javascript
  node app remove --id "{NOTE_ID_GOES_HERE}"
  ```

* Find notes

  * Find notes by title

    ```javascript
    node app find -t "homework"
    ```

  * Find notes by id

    ```javascript
    node app find --id "{NOTE_ID_GOES_HERE}"
    ```

  * Find notes by tag

    ```javascript
    node app find --tag "programming"
    ```

* List all notes

  ```javascript
  node app list
  ```

* Tag a note

  ```javascript
  node app tag --id "{NOTE_ID_GOES_HERE}" --tag "{TAG_NAME_GOES_HERE}"
  ```

* Update a note

  ```javascript
  node app update --id "{NOTE_ID_GOES_HERE}" -t "Programming homework for weekend" -c "Read 'Computer Science Illuminated Pages 200-500" --tags "homework, compsci"
  ```

---

## Versioning

I use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/drminnaar/noteworx-cli-couchbase/tags).

## Authors

* **Douglas Minnaar** - *Initial work* - [drminnaar](https://github.com/drminnaar)

[noteworx-cli-fs]: https://github.com/drminnaar/noteworx-cli-fs
[noteworx-cli-mongodb]: https://github.com/drminnaar/noteworx-cli-mongodb
[noteworx-cli-mongoose]: https://github.com/drminnaar/noteworx-cli-mongoose