import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './loading'


const URL = "http://localhost:3300/admin/account";

const ROLE = localStorage.getItem('role')

const fullname = document.querySelector('.create-item input[name=fullname]');
const email = document.querySelector('.create-item input[name=email]');
const password = document.querySelector('.create-item input[name=password]');
const status = document.querySelector('.create-item select[name=status]');

const fullnameUpdate = document.querySelector('.create-update-item input[name=fullname]');
const emailUpdate = document.querySelector('.create-update-item input[name=email]');
const passwordUpdate = document.querySelector('.create-update-item input[name=password]');
const statusUpdate = document.querySelector('.create-update-item select[name=status]');

const btnAddItem = document.querySelector('#add-item');
const btnUpdateItem = document.querySelector('#update-item');

const addItemModal = $('#addItemModal');
const updateItemModal = $('#updateItemModal');
const deleteItemModal = $('#deleteItemModal');


// get roles
const roleId = document.querySelector('.create-item select[name=roleId]');
const roleIdUpdate = document.querySelector('.create-update-item select[name=roleId]');


function getRoles() {
    let items = []
    let markup
    axios.get(URL + "/roles", {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            items = res.data
            markup = generateRoleOption(items)
            roleId.innerHTML = markup;
            roleIdUpdate.innerHTML = markup;
        })
        .catch(err => {
            console.log(err);
        })
}

function generateRoleOption(items) {
    return items.map(item => {
        return `
            <option value="${item._id}"> ${item.name}</option>
        `
    }).join('')

}

getRoles();


// get items

const categoryTableBody = document.querySelector('#categoryTableBody')

function getItems() {
    loading.show();
    let items = []
    let markup
    axios.get(URL, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {

            addItemModal.modal('hide');
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
        let tr = ROLE == "admin" ?
            `
         <tr>
            <td>
                <p>${index + 1}</p>
            </td>
            <td><img style="width: 40px; border-radius: 50%" src="${item.avatar}"></td>
            <td>${item.email}</td>
            <td>${item.roleId.name}</td>
            <td>
                ${item.status === false ?
                `<span class="badge badge-pill badge-warning">không hoạt động</span>`
                : `<span class="badge badge-pill badge-info"> hoạt động</span>`
            }
            </td>
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
    ` :
            `
            <tr>
            <td>
                <p>${index + 1}</p>
            </td>
            <td><img style="width: 40px; border-radius: 50%" src="${item.avatar}"></td>
            <td>${item.email}</td>
            <td>${item.roleId.name}</td>
            <td>
                ${item.status === false ?
                `<span class="badge badge-pill badge-warning">không hoạt động</span>`
                : `<span class="badge badge-pill badge-info"> hoạt động</span>`
            }
            </td>
            <td>
                ${moment(item.createdAt).format(' hh:mm A DD/MM/yyyy')}
            </td>
            <td style="width:50px">
                <button data-item='${JSON.stringify(item)}' class="btn-update-item btn btn-warning btn-sm" data-toggle="modal" data-target="#updateItemModal">
                <i class="icon md-edit "></i>
                </button>
            </td>
        </tr>
    `
        return tr

    }).join('')
}

getItems();

// create item

btnAddItem.addEventListener('click', addItem)

function addItem() {
    const data = {
        fullname:fullname.value, 
        email: email.value,
        password: password.value,
        status: status.value,
        roleId: roleId.value
    };
    axios.post(URL, data)
        .then(res => {

            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'Thêm tài khoản thành công',
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

let idUpdate = null;

function showUpdateItem(item) {
    nameUpdate.value = item.name;
    statusUpdate.value = item.status ? 1 : 0;
    idUpdate = item._id;
}

function updateItem() {
    const data = {
        fullname:fullnameUpdate.value, 
        email: emailUpdate.value,
        password: passwordUpdate.value,
        status: statusUpdate.value,
        roleId: roleIdUpdate.value
    };
    axios.put(`${URL}/${idUpdate}`, data)
        .then(res => {
            updateItemModal.modal('hide');
            new Noty({
                type: 'success',
                timeout: 2000,
                text: 'Cập nhật tài khoản thành công',
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
                text: 'Xóa tài khoản thành công',
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