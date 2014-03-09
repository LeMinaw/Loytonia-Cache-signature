// ==UserScript==
// @name       Loytonia - On cache les signatures
// @namespace  http://github.com/Kocal
// @version    0.1
// @description  On cache les signatures du forum Loytonia, sauf celle de "Kocal"
// @match      http://forum.loytonia.com/*
// @match      https://forum.loytonia.com/*
// @copyright  2014+, Hugo Alliaume
// ==/UserScript==

var excludedPseudos = ['kocal'],
    posts = document.querySelectorAll('tr.post');

for(var i = 0, len = posts.length; i < len; i++) {
    var post   = posts[i],
        pseudo = post.querySelector('.name a[href^="/u"] span strong').innerText,
        signature = post.querySelector('.signature_div');

    if(excludedPseudos.indexOf(pseudo.toLowerCase()) === -1) {
        if(signature) {
            if(signature.parentNode.removeChild(signature)) {
                console.log('La signature de ' + pseudo + ' a bien été cachée');
            } else {
                console.warn('Impossible de cacher la signature de ' + pseudo);
            }
        }
    }
}