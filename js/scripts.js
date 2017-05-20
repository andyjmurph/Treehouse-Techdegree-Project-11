'use strict';

// Global variables

var modal = $('#modal');
var modalImg = $('#modal > img');
var imgSrc = '';
var avatar = '';

$('.image img').click(function (event) {
  event.preventDefault;
  imgSrc = $(event.target).attr('src').replace('/thumbnails', '');
  avatar = event.target.parentNode.nextElementSibling.firstElementChild.getAttribute('class');
  $('#modal .avatar').addClass(avatar);
  modalImg.attr('src', imgSrc);
});