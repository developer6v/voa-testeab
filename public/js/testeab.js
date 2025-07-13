function testeAB() {
    const pageA = "https://fabiocostaonline.com/workshop-voa";
    const pageB = "https://fabiocostaonline.com/workshop-voa-b";
    const pageC = "https://fabiocostaonline.com/workshop-voa-c";

    const urlParams = new URLSearchParams(window.location.search);
    const utmParams = {};
    for (const [key, value] of urlParams.entries()) {
        if (key.startsWith("utm_")) {
        utmParams[key] = value;
        }
    }

    function createUrl(targetUrl) {
        const newUrl = new URL(targetUrl);
        for (const [key, value] of Object.entries(utmParams)) {
            newUrl.searchParams.append(key, value);
        }
        return newUrl.toString();
    }

    function redirect() {
        const pages = [pageA, pageB, pageC];
        const randomIndex = Math.floor(Math.random() * pages.length);
        window.location.href = createUrl(pages[randomIndex]);
    }


    redirect(); 
}

document.addEventListener("DOMContentLoaded", function(){
    alert("chamou a função");
    testeAB(); 

})
