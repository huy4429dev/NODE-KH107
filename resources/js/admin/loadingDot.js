const eleLoading = document.querySelector('#box-loading-dot');

function loading() {
    return {
        show() {
            eleLoading.style.display = "block";
        },
        hide() {
            eleLoading.style.display = "none";
        }

    }
}

export default loading();