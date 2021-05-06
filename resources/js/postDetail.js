import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './admin/loading'

const URL = "http://localhost:3300";
const ROLE = localStorage.getItem('role')
const categoryTableBody = document.querySelector('#categoryTableBody')
const postId = categoryTableBody.dataset.postid;

let pageComment = 1;
let sizeComment = 5;
let items = [];
let totalComment = 0;
let markupComments = '';

function getItems() {
    loading.show();
    const urlGetComment = `${URL}/comment/${postId.trim()}?pageComment=${pageComment}&sizeComment=${sizeComment}`;
    axios.get(urlGetComment, {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => {
            setTimeout(() => {

                pageComment++
                items.push(...res.data.comments)
                totalComment = res.data.total
                markupComments = generateMarkup(items)
                let markupMoreBtn = generateLinkSeeMore(totalComment, items.length)

                categoryTableBody.innerHTML = markupComments + markupMoreBtn;
                if (markupMoreBtn != '') {
                    const btnMoreComments = document.querySelector('#btn-get-more-comment');
                    btnMoreComments.addEventListener('click', getItems)
                }

                loading.hide();

            }, 500);
        })
        .catch(err => {
            loading.hide();
        })
}

function generateMarkup(items) {
    return items.map((item, index) => {
        return `
        <li class="flex items-center space-x-2 mt-6">
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


// get more comments

function generateLinkSeeMore(total, size) {
    if (total > size) {
        return `<div class="mt-6 text-gray-500 cursor-pointer"> <a id="btn-get-more-comment"> Xem thêm bình luận </a> </div>`
    }
    return "";
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
    axios.post(URL + "/comment/" + postId, data)
        .then(res => {
            
            content.value = "";
            items.unshift(res.data);
            markupComments = generateMarkup(items);
            let markupMoreBtn = generateLinkSeeMore(totalComment, items.length);
            categoryTableBody.innerHTML = markupComments + markupMoreBtn;
            if (markupMoreBtn != '') {
                const btnMoreComments = document.querySelector('#btn-get-more-comment');
                btnMoreComments.addEventListener('click', getItems)
            }


        }).catch(err => {
            console.log(err);
            new Noty({
                type: 'error',
                timeout: 2000,
                text: 'Error',
                progressBar: false,
            }).show();
        })
}