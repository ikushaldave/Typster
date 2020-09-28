if(!localStorage.getItem('username')){
    window.open(chrome.extension.getURL('../pages/welcome.html'))
}else {
    window.open(chrome.extension.getURL('../index.html'))
}