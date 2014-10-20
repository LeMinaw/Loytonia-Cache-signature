// ==UserScript==
// @name       Loytonia - On cache les signatures
// @namespace  http://github.com/Kocal
// @version    0.4
// @description  Système de backlisting de signature sur le forum http://forum.loytonia.com
// @match      http://forum.loytonia.com/*
// @match      https://forum.loytonia.com/*
// @copyright  2014+, Hugo Alliaume
// ==/UserScript==

'use strict';

Node.prototype.prependChild = function(child) { 
    this.insertBefore(child, this.firstChild);
};

function init() {
    var posts = document.querySelectorAll('tr[class^="post"].post');

    insertCSS();

    for(var i = 0, len = posts.length; i < len; i++) {
        var post = posts[i],
            pseudo = getPseudoFromPost(post),
            minibar = getMinibarFromPost(post);

        if(isBanned(pseudo))
            hideSignature(post)
        else
            showSignature(post);

        // Pour pas que ça fasse des trucs chelous avec le script "Valou je t'emmerde"
        if(post.style.display != 'none') {
            minibar.prependChild(makeButton((isBanned(pseudo) ? 'to show' : 'to hide')));
        }
    }
}

function getPseudoFromPost(post) {
    return post.querySelector('.name').textContent.toLowerCase();
}

function getPostsFromPseudo(pseudo) {
    var _posts = document.querySelectorAll('tr[class^="post"].post'),
        posts = [];

    for(var i = 0, len = _posts.length; i < len; i++) {
        if(getPseudoFromPost(_posts[i]) == pseudo.toLowerCase())
            posts.push(_posts[i]);
    }

    return posts;
}

function getMinibarFromPost(post) {
    return post.nextSibling.querySelector('.post-options');
}

function getSignature(post) {
    return post.querySelector('.signature_div') || document.querySelector('div');
}

function hideSignature(post) {
    getSignature(post).style.display = 'none';
}

function hideSignatures(posts) {
    for(var i = 0, len = posts.length; i < len; i++) {
        hideSignature(posts[i]);
    }
}

function showSignature(post) {
    getSignature(post).style.display = 'block';
}

function showSignatures(posts) {
    for(var i = 0, len = posts.length; i < len; i++) {
        showSignature(posts[i]);    
    }
}

function getBannedPseudos() {
    var pseudos = localStorage.getItem('kocal-bannedPseudos');

    if(!pseudos) {
        pseudos = [];
    } else {
        pseudos = JSON.parse(pseudos);
    }

    return pseudos;
}

function setBannedPseudos(pseudos) {
    localStorage.setItem('kocal-bannedPseudos', JSON.stringify(pseudos));
}

function isBanned(pseudo) {
    return getBannedPseudos().indexOf(pseudo) !== -1;
}

function banPseudo(pseudo) {
    var pseudos = getBannedPseudos();

    pseudos.push(pseudo);

    setBannedPseudos(pseudos);
}

function debanPseudo(pseudo) {
    var pseudos = getBannedPseudos();

    pseudos.splice(pseudos.indexOf(pseudo), 1);

    setBannedPseudos(pseudos);
}

function makeButton(state) {
    var a = document.createElement('a');

    a.className = 'kocal kocal-' + state.replace(' ', '-');
    
    a.textContent = 'Cacher la signature';

    if(state == 'to show')
        a.textContent = 'Montrer la signature';

    a.addEventListener('click', updateState, false);

    return a;
}

function insertCSS() {
    var style = document.createElement('style');

    style.textContent = "\
        a.kocal { \
            background : #8B8B8B; \
            border : 1px solid #000; \
            color : #fff; \
            cursor : pointer; \
            font-size : 0.9em; \
            padding : 0 3px; \
        } \
        a.kocal:hover { \
            text-decoration : none !important; \
        } \
        \
        a.kocal.kocal-to-hide { \
            background : #E94747; \
        } \
        \
        a.kocal.kocal-to-hide:hover { \
            background : #EC5E5E; \
        } \
        \
        a.kocal.kocal-to-show { \
            background : #4FB122; \
        } \
        \
        a.kocal.kocal-to-show:hover { \
            background : #5FBB35; \
        } \
    ";

    document.head.appendChild(style);
}

function updateState(e) {
    var post = this.parentNode.parentNode.previousSibling,
        pseudo = getPseudoFromPost(post),
        posts = getPostsFromPseudo(pseudo);

    if(isBanned(pseudo)) {
        debanPseudo(pseudo);
        showSignatures(posts);
        updateButtonState(posts, 'to hide');
    } else {
        banPseudo(pseudo);
        hideSignatures(posts)
        updateButtonState(posts, 'to show');
    }
}

function updateButtonState(posts, state) {
    for(var i = 0, len = posts.length; i < len; i++) {
        var post = posts[i],
            button = post.nextSibling.querySelector('a.kocal');

        button.className = 'kocal kocal-' + state.replace(' ', '-');

        button.textContent = 'Cacher la signature';

        if(state == 'to show')
            button.textContent = 'Montrer la signature';
    }
}

init();