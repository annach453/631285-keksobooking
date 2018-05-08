'use strict';

(function () {

  /* Валидация полей формы */

  var adForm = document.querySelector('.ad-form');
  var adType = adForm.querySelector('#type');
  var adCheckIn = adForm.querySelector('#timein');
  var adCheckOut = adForm.querySelector('#timeout');
  var adPrice = adForm.querySelector('#price');
  var adRoomNumber = adForm.querySelector('#room_number');
  var adMinPrices = {
    flat: 1000,
    bungalo: 0,
    house: 5000,
    palace: 10000
  };
  var adCapacity = adForm.querySelector('#capacity');
  var adCapacityOptions = adForm.querySelectorAll('#capacity option');
  var adCapacityValues = {
    1: ['1'],
    2: ['2', '1'],
    3: ['3', '2', '1'],
    100: ['0']
  };
  var adFormValidatedFields = adForm.querySelectorAll('#title, #price, #capacity');

  var onAdTypeChange = function () {
    var minValue = adMinPrices[adType.value];
    adPrice.min = minValue;
    adPrice.placeholder = minValue;
  };

  var onCheckInChange = function () {
    adCheckOut.value = adCheckIn.value;
  };

  var onCheckOutChange = function () {
    adCheckIn.value = adCheckOut.value;
  };

  var onRoomNumberChange = function () {
    for (var i = 0; i < adCapacityOptions.length; i++) {
      var availableCapacityValues = adCapacityValues[adRoomNumber.value];
      if (availableCapacityValues.indexOf(adCapacityOptions[i].value) === -1) {
        adCapacityOptions[i].disabled = true;
      } else {
        adCapacityOptions[i].disabled = false;
      }
    }

    if (availableCapacityValues.indexOf(adCapacity.value) === -1) {
      adCapacity.value = availableCapacityValues[availableCapacityValues.length - 1];
    }

    if (adCapacityValues[adRoomNumber.value].indexOf(adCapacity.value) === -1) {
      adCapacity.setCustomValidity('Неверное количество гостей. Выберите один из доступных вариантов для указанного количества комнат.');
    }
  };

  var onSubmitBtnClick = function () {
    for (var i = 0; i < adFormValidatedFields.length; i++) {
      if (!adFormValidatedFields[i].validity.valid) {
        adFormValidatedFields[i].style.boxShadow = '0 0 0px 3px #ff0000';
      }
    }
  };

  var onValidatedFieldsChange = function (evt) {
    for (var i = 0; i < adFormValidatedFields.length; i++) {
      if (adFormValidatedFields[i] === evt.target && adFormValidatedFields[i].validity.valid) {
        adFormValidatedFields[i].style.boxShadow = '';
      }
    }
  };

  window.form = {
    'onAdTypeChange': onAdTypeChange,
    'onCheckInChange': onCheckInChange,
    'onCheckOutChange': onCheckOutChange,
    'onRoomNumberChange': onRoomNumberChange,
    'onSubmitBtnClick': onSubmitBtnClick,
    'onValidatedFieldsChange': onValidatedFieldsChange
  };

})();
