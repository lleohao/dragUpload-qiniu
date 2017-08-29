import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Subscriber } from 'rxjs/subscriber';

import { BaseService } from './base.service';

export interface SelectedFile {
    localPath: string;
    fileName: string;
    size: number;
    ext: string;
}

export interface ProgressInterface {
    id: string;
    progress: number;
}

@Injectable()
export class FileService extends BaseService {
    constructor() {
        super();
    }

    selectFile() {
        return new Promise((reslove, reject) => {
            const uid = this.uuid();
            this.ipcRender.send('/file/select', uid);
            this.ipcRender.once(`/file/select/${uid}`, (e, filePath: SelectedFile[]) => {
                reslove(filePath);
            });
        });
    }

    uploadProgress(): Observable<ProgressInterface> {
        return Observable.create((observer: Subscriber<ProgressInterface>) => {
            electron.ipcRenderer.on('/file/upload/progress', (e, { id, progress }) => {
                observer.next({
                    id,
                    progress
                });
            });
        });
    }
}
