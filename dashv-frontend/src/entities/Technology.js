export class Technology {
  name;
  versionNumber;
  versionLastDate;
  imageUrl;

  constructor(name, versionNumber, versionLastDate, imageUrl) {
    this.name = name;
    this.versionNumber = versionNumber;
    this.versionLastDate = versionLastDate;
    this.imageUrl = imageUrl;
  }
}