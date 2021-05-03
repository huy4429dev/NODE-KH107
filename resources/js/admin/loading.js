const eleLoading = document.querySelector('.box-loading');

function loading() {
    return {
        show() {
            eleLoading.style.display = "flex";
        },
        hide() {
            eleLoading.style.display = "none";
        }

    }
}

export default loading();