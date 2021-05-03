import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'
import loading from './admin/loading'

const URL = "http://localhost:3300/";
const ROLE = localStorage.getItem('role')
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
        <li class="py-12">
        <article class="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
            <dl>
                <dt class="sr-only">Published on</dt>
                <dd class="text-base leading-6 font-medium text-gray-500">
                    <time
                        datetime="${moment(item.createdAt)}"> ${moment(item.createdAt).format(' hh:mm A DD/MM/yyyy')}
                    </time></dd>
            </dl>
            <div class="space-y-5 xl:col-span-3">
                <div class="space-y-6">
                    <h2 class="text-2xl leading-8 font-bold tracking-tight"><a class="text-gray-900"
                            href="/chi-tiet/${item._id}">
                                ${item.title}                            
                            </a></h2>
                    <div class="prose max-w-none text-gray-500">
                        ${item.description}
                    </div>
                </div>
                <div class="text-base leading-6 font-medium"><a
                        class="text-teal-500 hover:text-teal-600"
                        style="color: #0694a2"
                        aria-label="Read &quot;Tailwind UI: Now with React + Vue support&quot;"
                        href="/chi-tiet/${item._id}">Chi tiết →</a></div>
            </div>
        </article>
    </li>
        `
    }).join('')
}

getItems();