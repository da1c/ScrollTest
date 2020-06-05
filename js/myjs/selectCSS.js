


/**
 *メニュー部分のCSS読み込み
 *
 */
function SelectMenuHaderCSS(){

    let userArgent = navigator.userAgent;
    if (userArgent.indexOf('iPhone') > -1 || userArgent.indexOf('iPod') > -1) {
        document.write('<link rel="stylesheet" href="./css/common/menuheader/iphone.css?DATE=20200529a">');
    }else if(userArgent.indexOf('Android') > -1){
        document.write('<link rel="stylesheet" href="./css/common/menuheader/android.css?DATE=20200529c">');
    }else{
        document.write('<link rel="stylesheet" href="./css/common/menuheader/iphone.css?DATE=20200529a">');
    }
}