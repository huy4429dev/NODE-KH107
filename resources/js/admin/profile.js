import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './loading'

const URL = "http://localhost:3300/admin/profile";

// filter param profile 

const profileCounts = document.querySelectorAll('#profile-count strong')
const profileActivities = document.querySelector('#profile-activities');

const btnUpdateItem = document.querySelector('#update-item');
const nameUpdate = document.querySelector('.create-update-item input[name=fullname]');
const emailUpdate = document.querySelector('.create-update-item input[name=email]');
const oldPasswordUpdate = document.querySelector('.create-update-item input[name=oldPassword]');
const newPasswordUpdate = document.querySelector('.create-update-item input[name=newPassword]');
const phoneUpdate = document.querySelector('.create-update-item input[name=phone]');
const addressUpdate = document.querySelector('.create-update-item input[name=address]');
const noteUpdate = document.querySelector('.create-update-item textarea[name=note]');
const genderUpdate = document.querySelector('.create-update-item select[name=gender]');

// get items

let user;

function getItems() {
    loading.show();
    let markupActivities;
    axios.get(URL, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            let { comments, postCount,user } = res.data;
            setTimeout(() => {


                profileCounts[0].innerHTML = postCount
                profileCounts[1].innerHTML = comments.length;
                profileCounts[2].innerHTML = [...new Set(comments.map(item => item.postId._id))].length; // [ 'A', 'B']
                markupActivities = generateMarkupActivities(comments)
                profileActivities.innerHTML = markupActivities;
                showUpdateItem(user);
                loading.hide();

            }, 500);
        })
        .catch(err => {
            console.log(err);
            loading.hide();
        })



}

function generateMarkupActivities(items) {
    return items.map((item, index) => {

        return `<li class="list-group-item">
        <div class="media">
            <div class="media-body">
                <h5 class="mt-0 mb-5">
                    <small><a target="_blank" href="/chi-tiet/${item.postId._id}" class="link cursor-pointer"> ${item.postId.title} </a></small>
                </h5>
                <small>${moment(item.createdAt).locale('vi').fromNow()}</small>
                <div class="profile-brief">
                ${item.content}
                </div>
            </div>
        </div>
    </li>`

    }).join('')
}

getItems();


// update items

function showUpdateItem(item) {
    nameUpdate.value = item.fullname;
    genderUpdate.value = item.gender ? 1 : 0;
    emailUpdate.value = item.email;
    phoneUpdate.value = item.phone;
    addressUpdate.value = item.address;
    noteUpdate.value = item.note;
}

function updateItem() {


    const data = {
        fullname:nameUpdate.value, 
        email: emailUpdate.value,
        note: noteUpdate.value,
        phone: phoneUpdate.value,
        address: addressUpdate.value,
        note: noteUpdate.value,
        gender: genderUpdate.value,
        oldPassword: oldPasswordUpdate.value,
        newPassword: newPasswordUpdate.value
    };
    axios.put(URL, data)
        .then(res => {
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
                text: err.response.data?.err ??  'Error',
                progressBar: false,
            }).show();
        })
}


btnUpdateItem.addEventListener('click', updateItem)
