import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './loading'

const URL = "http://localhost:3300/admin/notification/post";
const URLCategory = "http://localhost:3300/admin/notification/category";

// init ckeditor

let content = document.querySelector('.editorAdd');
ClassicEditor
    .create(content, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
            ]
        }
    })
    .then(editor => {
        content = editor;
    })
    .catch(error => {
        console.log(error);
    });

let contentUpdate = document.querySelector('.editorUpdate');
ClassicEditor
    .create(contentUpdate, {
        toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
            ]
        }
    })
    .then(editor => {
        contentUpdate = editor;
    })
    .catch(error => {
        console.log(error);
    });




// get items
const categoryId = document.querySelector('.create-item select[name=categoryId]');
const categoryIdUpdate = document.querySelector('.create-update-item select[name=categoryId]');

const title = document.querySelector('.create-item input[name=title]');
const description = document.querySelector('.create-item textarea[name=description]');
const status = document.querySelector('.create-item select[name=status]');
const categoryTableBody = document.querySelector('#categoryTableBody')


const addItemModal = $('#addItemModal');
const updateItemModal = $('#updateItemModal');
const deleteItemModal = $('#deleteItemModal');


// get all category 

function getCategory() {
    let items = []
    let markup
    axios.get(URLCategory, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            items = res.data
            markup = generateCategoryOption(items)
            categoryId.innerHTML = markup;
            categoryIdUpdate.innerHTML = markup;
        })
        .catch(err => {
            console.log(err);
        })
}

function generateCategoryOption(items) {
    return items.map(item => {
        return `
            <option value="${item._id}"> ${item.name}</option>
        `
    }).join('')

}

getCategory();

function getItems(q) {
    let url = URL;
    if(q != null){
        url += "/search?q=" + q 
    }
     
    loading.show();
    let items = []
    let markup
    axios.get(url, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            console.log(res.data, 'get items');
            setTimeout(() => {
                items = res.data
                markup = generateMarkup(items)
                categoryTableBody.innerHTML = markup;

                const btnUpdates = document.querySelectorAll('.btn-update-item')
                btnUpdates.forEach(btn => {
                    const item = JSON.parse(btn.dataset.item);
                    btn.addEventListener('click', () => showUpdateItem(item))
                })

                const btnDeleteItems = document.querySelectorAll('.btn-delete-item')
                btnDeleteItems.forEach(btn => {
                    const item = JSON.parse(btn.dataset.item);
                    btn.addEventListener('click', () => showDeleteItem(item))
                })

                loading.hide();

            }, 500);
        })
        .catch(err => {
            console.log(err);
            loading.hide();
        })



}

function generateMarkup(items) {
    return items.map((item, index) => {
        return `
         <tr>
            <td>
                <p>${index + 1}</p>
            </td>
            <td style="width: 30%">${item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title}</td>
            <td>
                ${item.status === false ?
                `<span class="badge badge-pill badge-warning text-center" style="width: 50px" >ẩn</span>`
                : `<span class="badge badge-pill badge-info text-center" style="width: 50px" >hiển thị</span>`
            }
            </td>
            <td>${item.userId.email}</td>

            <td>
                ${moment(item.createdAt).format(' hh:mm A DD/MM/yyyy')}
            </td>
            <td style="width:50px">
                <button data-item='${JSON.stringify(item)}' class="btn-update-item btn btn-warning btn-sm" data-toggle="modal" data-target="#updateItemModal">
                <i class="icon md-edit "></i>
                </button>
            </td>
            <td style="width:50px">
                <button data-item='${JSON.stringify(item)}' class="btn-delete-item btn btn-danger btn-sm"  data-toggle="modal" data-target="#deleteItemModal">
                <i class="icon md-delete "></i>
                </button>
           </td>
        </tr>
    `
    }).join('')
}

getItems();

// create item

const btnAddItem = document.querySelector('#add-item');
btnAddItem.addEventListener('click', addItem)

function addItem() {
    const data = {
        title: title.value,
        categoryId: categoryId.value,
        description: description.value,
        content: content.getData(),
        status: status.value,
    };

    axios.post(URL, data)
        .then(res => {
            addItemModal.modal('hide');
            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'Thêm thông báo thành công',
                progressBar: false,
            }).show();

            getItems();

        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 2000,
                text: 'Error',
                progressBar: false,
            }).show();
        })
}


// update items

const btnUpdateItem = document.querySelector('#update-item');
const titleUpdate = document.querySelector('.create-update-item input[name=title]');
const statusUpdate = document.querySelector('.create-update-item select[name=status]');
const desciptionUpdate = document.querySelector('.create-update-item textarea[name=description]');

let idUpdate = null;

function showUpdateItem(item) {
    titleUpdate.value = item.title;
    statusUpdate.value = item.status ? 1 : 0;
    categoryIdUpdate.value = item.categoryId;
    desciptionUpdate.innerHTML = item.description;
    contentUpdate.setData(item.content);
    idUpdate = item._id;
}


function updateItem() {
    const data = {
        title: titleUpdate.value,
        status: statusUpdate.value,
        categoryId: categoryIdUpdate.value,
        description: desciptionUpdate.innerHTML,
        content: contentUpdate.getData()
    };

    axios.put(`${URL}/${idUpdate}`, data)
        .then(res => {
            updateItemModal.modal('hide');
            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'Cập nhật thông bao thành công',
                progressBar: false,
            }).show();

            getItems();

        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 2000,
                text: 'Error',
                progressBar: false,
            }).show();
        })
}

btnUpdateItem.addEventListener('click', updateItem)

// delete item

const btnDeleteItem = document.querySelector('#delete-item');

let idDelete = null;
function showDeleteItem(item) {
    idDelete = item._id;
}

function deleteItem() {
    axios.delete(`${URL}/${idDelete}`)
        .then(res => {
            deleteItemModal.modal('hide');
            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'Xóa thông báo thành công',
                progressBar: false,
            }).show();

            getItems();

        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 2000,
                text: 'Error',
                progressBar: false,
            }).show();
        })
}

btnDeleteItem.addEventListener('click', deleteItem)


// search 

const eleSearch = document.querySelector('#input-search')

let timer;
let keySearch = "";

function searchItem(){
    eleSearch.addEventListener('keyup',function() {

        keySearch = this.value;
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            getItems(keySearch);
        }, 1000);
    })
}

searchItem();