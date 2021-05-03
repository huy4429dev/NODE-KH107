import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './admin/loading'

const URL = "http://localhost:3300";
const ROLE = localStorage.getItem('role')
const categoryTableBody = document.querySelector('#categoryTableBody')
const postId = categoryTableBody.dataset.postid;


function getItems() {
    loading.show();
    let items = []
    let markup
    axios.get(URL + "/comment/" + postId , {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {

            setTimeout(() => {
                items = res.data
                markup = generateMarkup(items)
                categoryTableBody.innerHTML = markup;
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
        <li class="flex items-center space-x-2 mt-4">
            <img style="width: 30px; height: 30px;" src="${item.userId.avatar}" alt=""
                class="w-10 h-10 rounded-full">
            <dl class="text-sm font-medium leading-5 whitespace-no-wrap">
                <dt class="sr-only">Name</dt>
                <dd class="text-gray-600">
                    ${item.userId.fullname}
                    <span class="text-gray-400" style="font-weight: 300;">${moment(item.createdAt).locale('vi').fromNow()}</span>
                </dd>
                <p class="text-gray-400" style="font-weight: 600;">${item.content}</p>
            </dl>
        </li>
        `
    }).join('')
}

getItems();


// create item

const content = document.querySelector('textarea[name=content]'); 
const btnAddItem = document.querySelector('#add-item');
btnAddItem.addEventListener('click', addItem)

function addItem() {
    const data = {
        content: content.value,
    };
    axios.post(URL + "/comment/" + postId , data)
        .then(res => {
            content.value = "";
            getItems();
            

        }).catch(err => {
             console.log(err);
        })
}