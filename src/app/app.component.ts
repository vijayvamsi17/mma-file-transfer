import { Component } from '@angular/core';
import { File, DirectoryEntry, Entry, IWriteOptions } from '@ionic-native/File/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

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
    private socialShare: SocialSharing
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
    this.downloadPdf().then(async resp => {
      const localURL = resp.toURL();
      const benefitDocumentShared = await this.share({
        subject: "Test subject",
        fileToShare: localURL
      });

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

  async share({ message = null, subject = "Test subject", fileToShare, url = null }: {
    message?: string, subject?: string,
    fileToShare?: string | string[], url?: string
  } = {}): Promise<any> {
    return await this.socialShare.share(message, subject, fileToShare, url);
  }
}
