import { Component } from '@angular/core';
import { File, DirectoryEntry, Entry, IWriteOptions } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private currentDir: DirectoryEntry;
  fileTransfer: FileTransferObject;

  constructor(
    private file: File,
    private platform: Platform,
    private fileTransferService: FileTransfer,
  ) {
    this.platform.ready().then(() => {
      this.createMMADirectory();
      this.fileTransfer = this.fileTransferService.create();
    })
  }

  public async deleteAllCachedPdfs() {
    try {
      await this.file.removeRecursively(this.file.dataDirectory, 'mma');
    } catch (error) {
      console.error('Error while deleting all cached PDF files from file system');
    }
  }

  public async createMMADirectory() {
    try {
      this.currentDir = await this.file.createDir(this.file.dataDirectory, 'mma', true);
    } catch (error) {
      console.error('Error while creating the mma directory');
    }
  }

  public async shareFile() {
    this.downloadPdf().then(response => {
      console.log(response);

    }).catch(err => {
      console.error(err);
    })
  }

  public async downloadPdf(): Promise<any> {
    await this.deleteAllCachedPdfs();

    if (!this.currentDir) {
      await this.createMMADirectory();
    }

    const headers = {};

    const url = "https://www.bcbsm.com/content/dam/public/Consumer/Documents/help/calculators-tools/bcn-member-reimbursement-form.pdf";
    return this.fileTransfer.download(url, this.currentDir.nativeURL + "Test.pdf");
  }
}
