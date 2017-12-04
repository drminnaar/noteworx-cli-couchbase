'use strict';

// package references
const couchbase = require('couchbase');

// application references
const DbConnection = require('./DbConnection');

// initialization
const connection = new DbConnection();
const query = couchbase.N1qlQuery;
const bucketName = DbConnection.Buckets.NoteWorx;

const determineKey = (id) => {
    return `note:${id}`;
};

class NoteRepository {

    addNote(note) {

        const key = determineKey(note.id);

        return new Promise((resolve, reject) => {

            connection.open()
                .then(() => {
                    connection.Bucket.insert(key, note, error => {
                        connection.close();
                        if (error) {                            
                            reject(error);
                        } else {
                            resolve({ id: note.id });
                        }
                    });

                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });
        });
    }


    findNoteById(id) {
        
        return new Promise((resolve, reject) => {
        
            connection.open()
                .then(() => {
                    const statement = `SELECT * FROM \`${bucketName}\` WHERE id = '${id}';`;
                    const selectQuery = query.fromString(statement);
                    connection.Bucket.query(selectQuery, (error, result) => {
                        connection.close();
                
                        if (error) {
                            reject(error);
                            return;
                        }
                        
                        if (result.length === 1) {
                            resolve(result[0].noteworx);
                            return;
                        } else {
                            reject(Error('Note not found'));
                            return;
                        }
                    });
                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });            
        });
    }


    findNotesByTag(tag) {
        
        return new Promise((resolve, reject) => {
        
            connection.open()
                .then(() => {
                    const statement = `SELECT * FROM \`${bucketName}\` UNNEST noteworx.tags t WHERE LOWER(t) = '${tag}';`;
                    const selectQuery = query.fromString(statement);
                    connection.Bucket.query(selectQuery, (error, result) => {
                        connection.close();
                
                        if (error) {
                            reject(error);
                            return;
                        }
                        
                        resolve(result.map(n => n.noteworx));
                    });
                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });            
        });
    }


    findNotesByTitle(title) {

        return new Promise((resolve, reject) => {

            connection.open()
                .then(() => {
                    const statement = `SELECT * FROM \`${bucketName}\` WHERE LOWER(title) LIKE '%${title}%';`;
                    const selectQuery = query.fromString(statement);
                    connection.Bucket.query(selectQuery, (error, result) => {
                        connection.close();
        
                        if (error) {
                            reject(error);
                            return;
                        }
        
                        resolve(result.map(n => n.noteworx));
                    });
                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });            
        });
    }


    listNotes() {
        return new Promise((resolve, reject) => {

            connection.open()
                .then(() => {
                    const statement = `SELECT * FROM \`${bucketName}\`;`;                    
                    const selectQuery = query.fromString(statement);

                    connection.Bucket.query(selectQuery, (error, result) => {
                        connection.close();
        
                        if (error) {
                            reject(error);
                            return;
                        }
        
                        resolve(result.map(n => n.noteworx));
                    });
                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });    
        });
    }


    removeNote(id) {
        
        return new Promise((resolve, reject) => {
        
            connection.open()
                .then(() => {
                    const statement = `DELETE FROM \`${bucketName}\` WHERE id = '${id}';`;
                    const selectQuery = query.fromString(statement);
                    connection.Bucket.query(selectQuery, (error, result) => {
                        connection.close();
                
                        if (error) {
                            reject(error);
                            return;
                        }
                        
                        resolve(result);
                        return;
                    });
                })
                .catch(error => {
                    connection.close();
                    reject(error);
                });            
        });
    }

    
    tagNote(id, tags) {
        
        return new Promise((resolve, reject) => {

            this.findNoteById(id)
                .then(note => {
                    
                    if (!note) {
                        reject('Note does not exist');
                        return;
                    }
        
                    const combinedTags = Array.from(new Set(tags.concat(note.tags))).map(tag => `'${tag}'`);
                
                    connection.open()
                        .then(() => {
        
                            const statement = `UPDATE \`${bucketName}\` SET noteworx.tags = [${combinedTags}] WHERE id = '${id}';`;
                            const selectQuery = query.fromString(statement);
                            
                            connection.Bucket.query(selectQuery, (error, result) => {
                                connection.close();
                        
                                if (error) {
                                    reject(error);
                                    return;
                                }
                                
                                resolve(result);
                                return;
                            });
                        })
                        .catch(error => {
                            connection.close();
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });            
        });
    }


    updateNote(id, noteUpdate) {
        
        return new Promise((resolve, reject) => {
        
            this.findNoteById(id)
                .then(note => {
                
                    if (!note) {
                        reject('Note does not exist');
                        return;
                    }
    
                    const combinedTags = Array.from(new Set(noteUpdate.tags.concat(note.tags))).map(tag => `'${tag}'`);
            
                    connection.open()
                        .then(() => {
    
                            const statement = `UPDATE \`${bucketName}\` 
                                SET 
                                    noteworx.tags = [${combinedTags}],
                                    title = '${noteUpdate.title}',
                                    content = '${noteUpdate.content}',
                                    updated_date = CLOCK_TZ('UTC')
                                WHERE id = '${id}';`;
                            console.log(statement);
                            const selectQuery = query.fromString(statement);
                        
                            connection.Bucket.query(selectQuery, (error, result) => {
                                connection.close();
                    
                                if (error) {
                                    reject(error);
                                    return;
                                }
                            
                                resolve(result);
                                return;
                            });
                        })
                        .catch(error => {
                            connection.close();
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
}

module.exports = NoteRepository;
