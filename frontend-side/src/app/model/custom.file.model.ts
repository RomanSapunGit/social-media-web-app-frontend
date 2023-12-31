export class CustomFile {
    identifier?: string;
    file: File;
    source: 'existed' | 'new';

    constructor( file: File, source: 'existed' | 'new', identifier?: string,) {
        if(identifier)
            this.identifier = identifier;
        this.file = file;
        this.source = source;
    }
}