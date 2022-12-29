(()=>{"use strict";new class{constructor(e){this.serverUrl=e,this.fileContainer=document.querySelector(".file-container"),this.form=this.fileContainer.querySelector(".file-form"),this.fileInput=this.fileContainer.querySelector(".file-container__overlapped"),this.errors=document.querySelector(".errors-list"),this.images=document.querySelector(".images"),this.imagesList=this.images.querySelector(".images-list"),this.fileTypeError="This format of file do not suitable",this.connectionError="Connection error"}init(){this.events(),this.getImages()}events(){this.fileContainer.addEventListener("click",(()=>this.fileInput.dispatchEvent(new MouseEvent("click")))),this.fileContainer.addEventListener("dragover",(e=>e.preventDefault())),this.fileContainer.addEventListener("drop",(e=>{e.preventDefault(),this.validateFiles(e.dataTransfer.files)})),this.fileInput.addEventListener("change",(()=>{this.validateFiles(this.fileInput.files),this.fileInput.value=""})),this.images.addEventListener("click",this.deleteImage.bind(this))}validateFiles(e){this.errors.innerHTML="";const t=[...e],s=["image/jpeg","image/jpg","image/png","image/gif","image/bmp"];t.forEach(((e,t,i)=>{const{type:r}=e;-1===s.indexOf(r)&&(this.showError(e.name,this.fileTypeError),i.splice(t,1))})),0!==t.length&&this.addImages(t)}addImages(e){const t=new FormData,s=new URL(this.serverUrl);s.searchParams.set("method","addImage"),e.forEach((e=>{t.append("images",e,e.name)})),fetch(s,{method:"POST",body:t}).then((e=>e.json())).then((e=>{this.showImages(e)})).catch((e=>{this.showError(e,this.connectionError)}))}getImages(){const e=new URL(this.serverUrl);e.searchParams.set("method","getImages"),fetch(e).then((e=>e.json())).then((e=>{this.showImages(e)})).catch((e=>{this.showError(e,this.connectionError)}))}showImages(e){e.forEach((e=>{const t=document.createElement("img");t.classList.add("images-item__img"),t.alt=e.name,t.src=this.serverUrl+e.url;const s=document.createElement("li");s.dataset.id=e.id,s.classList.add("images-item");const i=document.createElement("span");i.classList.add("images-item__del"),i.textContent="x";const r=document.createElement("span");r.classList.add("images-item__name"),r.textContent=e.name,s.append(i),s.append(t),s.append(r),this.imagesList.append(s)}))}deleteImage(e){this.errors.innerHTML="";const t=e.target.closest(".images-item__del"),s=e.target.closest(".images-item");if(!t)return;const i=new URL(this.serverUrl);i.searchParams.set("method","deleteImage"),i.searchParams.set("id",s.dataset.id),fetch(i).catch((e=>{this.showError(e,this.connectionError)})),s.remove()}showError(e,t){const s=document.createElement("li");s.innerHTML=`${e}. ${t}`,this.errors.append(s)}}("http://localhost:7070").init()})();