// ==UserScript==
// @name        Minecraft.fr - NoSign
// @namespace   http://github.com/LeMinaw
// @version     1.0.1
// @description Système de backlisting de signature sur le forum de Minecraft.fr.
// @match       http://minecraft.fr/forum/*
// @match       https://minecraft.fr/forum/*
// @copyright   2016+, LeMinaw
// ==/UserScript==

'use strict';

Node.prototype.prependChild = function(child) { 
    this.insertBefore(child, this.firstChild);
};

function init() {
    var posts = document.querySelectorAll('.uix_message');

    insertCSS();

    for (var i = 0, len = posts.length; i < len; i++) {
        var post = posts[i],
            pseudo = getPseudoFromPost(post),
            minibar = getMinibarFromPost(post);

        if(isBanned(pseudo)) {
            hideSignature(post);
            minibar.prependChild(makeButton('to show'));
        }
        else {
            showSignature(post);
            minibar.prependChild(makeButton('to hide'));
        }
    }
}

function getPseudoFromPost(post) {
    return post.querySelector('.username').textContent.toLowerCase();
}

function getPostsFromPseudo(pseudo) {
    var _posts = document.querySelectorAll('.uix_message'),
        posts = [];

    for(var i = 0, len = _posts.length; i < len; i++) {
        if(getPseudoFromPost(_posts[i]) == pseudo.toLowerCase())
            posts.push(_posts[i]);
    }

    return posts;
}

function getMinibarFromPost(post) {
    return post.querySelector('.publicControls');
}

function getSignature(post) {
    return post.querySelector('.signature') || document.querySelector('div');
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
    var pseudos = localStorage.getItem('leminaw-bannedPseudos');

    if(!pseudos) {
        pseudos = [];
    } else {
        pseudos = JSON.parse(pseudos);
    }

    return pseudos;
}

function setBannedPseudos(pseudos) {
    localStorage.setItem('leminaw-bannedPseudos', JSON.stringify(pseudos));
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

    a.className = 'item control leminaw leminaw-' + state.replace(' ', '-');
    
    a.textContent = 'Cacher la signature';

    if(state == 'to show')
        a.textContent = 'Montrer la signature';

    a.addEventListener('click', updateState, false);
    
    return a;
}

function insertCSS() {
    var style = document.createElement('style');

    style.textContent = "\
        a.leminaw.leminaw-to-hide { \
            background : #E94747; \
        } \
        \
        \
        a.leminaw.leminaw-to-show { \
            background : #4FB122; \
        } \
        \
    ";

    document.head.appendChild(style);
}

function updateState(e) {
    var post = this.parentNode.parentNode.parentNode.parentNode,
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
            button = post.querySelector('a.leminaw');

        button.className = 'item control leminaw leminaw-' + state.replace(' ', '-');

        button.textContent = 'Cacher la signature';

        if(state == 'to show')
            button.textContent = 'Montrer la signature';
    }
}

init();
