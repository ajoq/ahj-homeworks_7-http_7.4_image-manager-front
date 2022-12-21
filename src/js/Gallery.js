export default class Gallery {
  constructor(url) {
    this.serverUrl = url;
    this.fileContainer = document.querySelector('.file-container');
    this.form = this.fileContainer.querySelector('.file-form');
    this.fileInput = this.fileContainer.querySelector('.file-container__overlapped');
    this.errors = document.querySelector('.errors-list');
    this.images = document.querySelector('.images');
    this.imagesList = this.images.querySelector('.images-list');
    this.fileTypeError = 'This format of file do not suitable';
    this.connectionError = 'Connection error';
  }

  init() {
    this.events();
    this.getImages();
  }

  events() {
    this.fileContainer.addEventListener('click', () => this.fileInput.dispatchEvent(new MouseEvent('click')));
    this.fileContainer.addEventListener('dragover', (e) => e.preventDefault());
    this.fileContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      this.validateFiles(e.dataTransfer.files);
    });
    this.fileInput.addEventListener('change', () => {
      this.validateFiles(this.fileInput.files);
      this.fileInput.value = '';
    });
    this.images.addEventListener('click', this.deleteImage.bind(this));
  }

  validateFiles(files) {
    this.errors.innerHTML = '';
    const arrFiles = [...files];

    const allowedExtension = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];

    arrFiles.forEach((item, index, array) => {
      const { type } = item;

      if (allowedExtension.indexOf(type) === -1) {
        this.showError(item.name, this.fileTypeError);
        array.splice(index, 1);
      }
    });

    if (arrFiles.length === 0) return;

    this.addImages(arrFiles);
  }

  addImages(fileList) {
    const form = new FormData();

    const url = new URL(this.serverUrl);
    url.searchParams.set('method', 'addImage');

    fileList.forEach((item) => {
      form.append('images', item, item.name);
    });

    fetch(url, {
      method: 'POST',
      body: form,
    })
      .then((response) => response.json())
      .then((files) => {
        this.showImages(files);
      })
      .catch((err) => {
        this.showError(err, this.connectionError);
      });
  }

  getImages() {
    const url = new URL(this.serverUrl);
    url.searchParams.set('method', 'getImages');

    fetch(url)
      .then((response) => response.json())
      .then((files) => {
        this.showImages(files);
      })
      .catch((err) => {
        this.showError(err, this.connectionError);
      });
  }

  showImages(fileList) {
    fileList.forEach((item) => {
      const img = document.createElement('img');
      img.classList.add('images-item__img');
      img.alt = item.name;
      img.src = this.serverUrl + item.url;

      const li = document.createElement('li');
      li.dataset.id = item.id;
      li.classList.add('images-item');

      const del = document.createElement('span');
      del.classList.add('images-item__del');
      del.textContent = 'x';

      const nameSpan = document.createElement('span');
      nameSpan.classList.add('images-item__name');
      nameSpan.textContent = item.name;

      li.append(del);
      li.append(img);
      li.append(nameSpan);
      this.imagesList.append(li);
    });
  }

  deleteImage(e) {
    this.errors.innerHTML = '';
    const del = e.target.closest('.images-item__del');
    const img = e.target.closest('.images-item');

    if (!del) return;

    const url = new URL(this.serverUrl);
    url.searchParams.set('method', 'deleteImage');
    url.searchParams.set('id', img.dataset.id);

    fetch(url)
      .catch((err) => {
        this.showError(err, this.connectionError);
      });

    img.remove();
  }

  showError(errorText, addText) {
    const li = document.createElement('li');
    li.innerHTML = `${errorText}. ${addText}`;
    this.errors.append(li);
  }
}
