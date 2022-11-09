export enum FileReaderType {
  binary,
  arrayBuffer,
}

export const getFileData = (inputFile: File, type: FileReaderType) => {
  const fileReader = new FileReader();

  return new Promise<string | null>((resolve, reject) => {
    fileReader.onerror = () => {
      fileReader.abort();
      reject(Error('Parsing error.'));
    };

    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    if (type === FileReaderType.binary) {
      fileReader.readAsBinaryString(inputFile);
    } else {
      fileReader.readAsArrayBuffer(inputFile);
    }
  });
};
