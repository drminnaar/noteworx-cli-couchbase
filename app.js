'use strict';

// package references

const yargs = require('yargs');


// project references

const NoteManager = require('./Services/NoteManager');
const noteManager = new NoteManager();


// build commands

const titleOptions = (demand) => {
    return {
        'alias': 't',
        'describe': 'A value that describes a note',
        'type': 'string',
        'demand': demand
    };
};

const idOptions = (demand) => {
    return {
        'describe': 'A value that uniquely identifies a note',
        'type': 'string',
        'demand': demand
    };
};

const contentOptions = {
    'alias': 'c',
    'describe': 'The body or content of the note',
    'type': 'string',
    'demand': true
};

const tagOptions = (demand) => {
    return {
        'describe': 'Tags that can be used to add metadata to a note',
        'type': 'string',
        'demand': demand
    };
};

const commands = yargs
    .command('add', 'Add new note', {
        title: titleOptions(true),
        content: contentOptions,
        tags: tagOptions(false)
    })
    .command('find', 'Find note', {        
        title: titleOptions(false),
        id: idOptions(false),
        tag: tagOptions(false)
    })
    .command('list', 'List all notes')
    .command('remove', 'Remove note', {
        id: idOptions(true)
    })
    .command('tag', 'Tag an existing note', {
        id: idOptions(true),
        tags: tagOptions(true)
    })
    .command('update', 'Update existing note', {
        id: idOptions(true),
        title: titleOptions(true),
        content: contentOptions,
        tags: tagOptions(false)
    })
    .help()
    .argv;


// process commands

const command = commands._[0];

switch (command) {

    case 'add':
    {
        noteManager
            .addNote(commands.title, commands.content, commands.tags)
            .then(id => {
                if (id) {
                    console.log(`Inserted note id : ${id}`);
                }
            })
            .catch(error => console.log(error.message));

        break;
    }

    case 'find':
    {
        if (commands.id) {            
            noteManager
                .findNoteById(commands.id)
                .then(note => console.log(JSON.stringify(note, null, 2)))
                .catch(error => console.log(error.message));
        } else if (commands.title) {
            noteManager
                .findNotesByTitle(commands.title)
                .then(notes => console.log(JSON.stringify(notes, null, 2)))
                .catch(error => console.log(error.message));
        } else if (commands.tag) {
            noteManager
                .findNotesByTag(commands.tag)
                .then(notes => console.log(JSON.stringify(notes, null, 2)))
                .catch(error => console.log(error.message));
        }

        break;
    }

    case 'list':
    {
        noteManager
            .listNotes()
            .then(notes => {

                if (notes) {
                    console.log(JSON.stringify(notes, null, 2));
                } else {
                    console.log('There are currently no notes to display');
                }

            })
            .catch(error => console.log(error));

        break;
    }

    case 'remove':
    {
        noteManager
            .removeNote(commands.id)
            .then(() => console.log('Note Removed'))
            .catch(error => console.log(error));

        break;
    }

    case 'tag':
    {
        noteManager
            .tagNote(commands.id, commands.tags)
            .then(() => console.log('Tagged ...'))
            .catch(error => console.log(error));

        break;
    }

    case 'update':
    {
        noteManager
            .updateNote(commands.id, commands.title, commands.content, commands.tags)
            .then(() => console.log('Updated ...'))
            .catch(error => console.log(error));
        
        break;
    }

    default:
    {
        console.log(`The command '${command}' is not supported`);
    }
}