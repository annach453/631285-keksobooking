'use strict';

(function () {

  var markQuantity = 8; // Количество меток на карте
  var markFragmentTemplate = document.querySelector('template').content.querySelector('.map__pin'); // Фрагмент для вывода меток
  var adFragmentTemplate = document.querySelector('template').content.querySelector('.map__card'); // Фрагмент для вывода объявления
  var markSize = { /* Размер метки */
    width: 50,
    height: 70
  };
  var map = document.querySelector('.map');
  var pinsArea = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = document.querySelectorAll('.ad-form fieldset');
  var mainMark = document.querySelector('.map__pin--main');
  var initialMarkSize = {
    width: 65,
    height: 65
  };
  var mainMarkSize = {
    width: 65,
    height: 84
  };
  var adAddress = adForm.querySelector('#address');
  var adType = adForm.querySelector('#type');
  var adCheckIn = adForm.querySelector('#timein');
  var adCheckOut = adForm.querySelector('#timeout');
  var adRoomNumber = adForm.querySelector('#room_number');
  var adFormSubmitBtn = adForm.querySelector('.ad-form__submit');

  // Переводит в спящий режим
  var setSleepMode = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    for (var i = 0; i < adFormFieldset.length; i++) {
      adFormFieldset[i].disabled = true;
    }
    mainMark.addEventListener('mousedown', onInitialMarkMouseDown);
    map.removeEventListener('click', onCloseAdBtnClick);
    document.removeEventListener('keydown', onEscPress);
    adType.removeEventListener('input', window.form.onAdTypeChange);
    adCheckIn.removeEventListener('input', window.form.onCheckInChange);
    adCheckOut.removeEventListener('input', window.form.onCheckOutChange);
    adRoomNumber.removeEventListener('input', window.form.onRoomNumberChange);
    adFormSubmitBtn.removeEventListener('invalid', window.form.onSubmitBtnClick);
    adForm.removeEventListener('input', window.form.onValidatedFieldsChange);
    initialMainMark = true;
  };

  // Переводит в активный режим
  var setActiveMode = function () {
    /* Подготавливает карту и форму для использования */
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldset.length; i++) {
      adFormFieldset[i].disabled = false;
    }

    /* Выводит на карту метки */
    var testData = window.data.renderTestData(window.data.testDataSource, markQuantity);
    window.pins.addMarkListToMap(testData, markFragmentTemplate, markSize);
    addListenersToMarks(testData);

    /* Добавляет слушатели */
    mainMark.removeEventListener('mousedown', onInitialMarkMouseDown);
    map.addEventListener('click', onCloseAdBtnClick);
    document.addEventListener('keydown', onEscPress);
    adType.addEventListener('input', window.form.onAdTypeChange);
    adCheckIn.addEventListener('input', window.form.onCheckInChange);
    adCheckOut.addEventListener('input', window.form.onCheckOutChange);
    adRoomNumber.addEventListener('input', window.form.onRoomNumberChange);
    adFormSubmitBtn.addEventListener('click', window.form.onSubmitBtnClick);
    adForm.addEventListener('input', window.form.onValidatedFieldsChange);

    initialMainMark = false;
  };

  var getMainMarkCoords = function (initialMarkSrc) {
    var mainMarkCoords = mainMark.getBoundingClientRect();
    if (initialMarkSrc) {
      adAddress.value = Math.round(mainMarkCoords.left + initialMarkSize.width / 2) + pageXOffset + ', ';
      adAddress.value += Math.round(mainMarkCoords.top + initialMarkSize.height / 2) + pageYOffset;
    } else {
      adAddress.value = Math.round(mainMarkCoords.left + mainMarkSize.width / 2) + pageXOffset + ', ';
      adAddress.value += Math.round(mainMarkCoords.top + mainMarkSize.height) + pageYOffset;
    }
  };

  var addListenersToMarks = function (testDataSrc) {
    var marks = map.querySelectorAll('.map__pin[type="button"]');
    for (var i = 0; i < marks.length; i++) {
      addListenerToMark(marks[i], i, testDataSrc);
    }
  };

  var addListenerToMark = function (mark, number, testDataSrc) {
    mark.addEventListener('click', function () {
      window.card.addAdToMap(testDataSrc[number], adFragmentTemplate);
    });
  };

  var onCloseAdBtnClick = function (evt) {
    var closeAdBtn = map.querySelector('.popup__close');
    if (evt.target === closeAdBtn) {
      map.removeChild(map.querySelector('.map__card'));
    }
  };

  var onEscPress = function (evt) {
    if (evt.keyCode === window.util.ESC_KEYCODE && map.querySelector('.map__card')) {
      map.removeChild(map.querySelector('.map__card'));
    }
  };

  /* Перемещение метки */
  var onMainMarkMove = function (evt) {
    evt.preventDefault();
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (mouseMoveEvt) {
      mouseMoveEvt.preventDefault();
      var pinsAreaCoords = pinsArea.getBoundingClientRect();
      var shift = {
        x: startCoords.x - mouseMoveEvt.clientX,
        y: startCoords.y - mouseMoveEvt.clientY
      };
      startCoords = {
        x: mouseMoveEvt.clientX,
        y: mouseMoveEvt.clientY
      };
      var newCoords = {
        x: mainMark.offsetLeft - shift.x,
        y: mainMark.offsetTop - shift.y
      };
      if (newCoords.x < -mainMarkSize.width / 2) {
        newCoords.x = -mainMarkSize.width / 2;
      }
      if (newCoords.x > pinsAreaCoords.width - mainMarkSize.width / 2) {
        newCoords.x = pinsAreaCoords.width - mainMarkSize.width / 2;
      }
      if (newCoords.y < 150 - mainMarkSize.height) {
        newCoords.y = 150 - mainMarkSize.height;
      }
      if (newCoords.y > 500 - mainMarkSize.height) {
        newCoords.y = 500 - mainMarkSize.height;
      }
      mainMark.style.top = newCoords.y + 'px';
      mainMark.style.left = newCoords.x + 'px';
      getMainMarkCoords();
    };

    var onMouseUp = function (mouseUpEvt) {
      mouseUpEvt.preventDefault();
      getMainMarkCoords();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onInitialMarkMouseMove = function () {
    document.removeEventListener('mousemove', onInitialMarkMouseMove);
  };
  var onInitialMarkMouseUp = function () {
    setActiveMode();
    document.removeEventListener('mouseup', onInitialMarkMouseUp);
  };
  var onInitialMarkMouseDown = function () {
    document.addEventListener('mousemove', onInitialMarkMouseMove);
    document.addEventListener('mouseup', onInitialMarkMouseUp);
  };

  var initialMainMark;
  setSleepMode();
  getMainMarkCoords(initialMainMark);
  mainMark.addEventListener('mousedown', onMainMarkMove);

})();
