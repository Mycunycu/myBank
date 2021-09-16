import { IDeposit } from '../models/deposit_model';
import fs from 'fs';
import readline from 'readline';

export interface IDepositRepository {
  getById(id: number): Promise<IDeposit>;
  create(item: IDeposit): Promise<number>;
  deleteById(id: number): Promise<boolean>;
  updateAmountUSD(course: number): Promise<boolean>;
}

export class DepositRepository implements IDepositRepository {
  private readonly isWin: boolean = process.platform === 'win32';
  private readonly pathToDeposits: string = this.isWin
    ? __dirname + '../../../../src/repository/deposits.txt'
    : '/usr/src/app/src/repository/deposits.txt';
  private readonly pathToNewDeposits: string = this.isWin
    ? __dirname + '../../../../src/repository/_deposits.txt'
    : '/usr/src/app/src/repository/_deposits.txt';

  getById(id: number): Promise<IDeposit> {
    return new Promise((resolve) => {
      const readStream = readline.createInterface(fs.createReadStream(this.pathToDeposits));

      readStream.on('line', (row: string | Buffer) => {
        const deposit: IDeposit = JSON.parse(row.toString());

        if (deposit.id === id) {
          resolve(deposit);
          readStream.close();
        }
      });

      readStream.on('close', () => resolve(null));
    });
  }

  create(newDeposit: IDeposit): Promise<number> {
    return new Promise((resolve) => {
      const readStream = readline.createInterface(fs.createReadStream(this.pathToDeposits));
      const writeStream = fs.createWriteStream(this.pathToNewDeposits);

      let countRows = 0;
      readStream.on('line', (row: string | Buffer) => {
        countRows++;
        writeStream.write(row + '\n');
      });

      readStream.on('close', () => {
        newDeposit.id = countRows;

        writeStream.write(getStringToWrite(newDeposit));

        closeStreams(readStream, writeStream);
        deleteAndRenameFiles(this.pathToDeposits, this.pathToNewDeposits);

        resolve(newDeposit.id);
      });
    });
  }

  deleteById(id: number): Promise<boolean> {
    return new Promise((resolve) => {
      const readStream = readline.createInterface(fs.createReadStream(this.pathToDeposits));
      const writeStream = fs.createWriteStream(this.pathToNewDeposits);

      readStream.on('line', (row: string | Buffer) => {
        const deposit: IDeposit = JSON.parse(row.toString());

        if (deposit.id !== id) {
          writeStream.write(row + '\n');
        }
      });

      readStream.on('close', () => {
        closeStreams(readStream, writeStream);
        deleteAndRenameFiles(this.pathToDeposits, this.pathToNewDeposits);

        resolve(true);
      });
    });
  }

  updateAmountUSD(course: number): Promise<boolean> {
    return new Promise((resolve) => {
      const readStream = readline.createInterface(fs.createReadStream(this.pathToDeposits));
      const writeStream = fs.createWriteStream(this.pathToNewDeposits);

      readStream.on('line', (row: string | Buffer) => {
        const deposit: IDeposit = JSON.parse(row.toString());
        deposit.amountUSD = Number((deposit.amountRUR / course).toFixed(2));

        writeStream.write(getStringToWrite(deposit));
      });

      readStream.on('close', () => {
        closeStreams(readStream, writeStream);
        deleteAndRenameFiles(this.pathToDeposits, this.pathToNewDeposits);

        resolve(true);
      });
    });
  }
}

const getStringToWrite = (deposit: IDeposit): string => {
  return `{"id":${deposit.id},"ownerName":"${deposit.ownerName}","amountRUR":"${deposit.amountRUR}.00","amountUSD":"${deposit.amountUSD}"}\n`;
};

const closeStreams = (read: readline.Interface, write: fs.WriteStream): void => {
  read.close();
  write.close();
};

const deleteAndRenameFiles = (pathToPrev: string, pathToNew: string): void => {
  fs.unlinkSync(pathToPrev);
  fs.renameSync(pathToNew, pathToPrev);
};
