'use strict';

// package references
const couchbase = require('couchbase');

// initialization
const connectionUrl = 'couchbase://localhost';
const cluster = new couchbase.Cluster(connectionUrl);
cluster.authenticate('Administrator', 'Password123!');
const bucketName = 'noteworx';

class DbConnection {
    constructor() {
        this.Bucket = null;
    }

    close() {
        if (this.Bucket) {
            this.Bucket.disconnect();
        }
    }


    open() {
        return new Promise((resolve, reject) => {
            
            const bucket = cluster.openBucket(bucketName, error => {
                
                if (error) {
                    bucket.disconnect();
                    reject(error);
                    return;
                }

                this.Bucket = bucket;
                resolve();
            });
        });
    }
}

DbConnection.Buckets = {
    NoteWorx: bucketName
};

module.exports = DbConnection;