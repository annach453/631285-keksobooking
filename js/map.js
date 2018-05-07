'use strict';

// Возвращает случайное число из диапазона
var getRandomValueFromRange = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Возвращает 1 случайное значение массива
var getRandomArrayValue = function (array) {
  return array[getRandomValueFromRange(0, array.length - 1)];
};

// Перетасовывает значения массива в случайном порядке
var shuffleArray = function (source) {
  var array = source.slice();
  return array.sort(function () {
    return Math.random() - 0.5;
  });
};

// Возвращает случайное количество значений массива
var getRandomArrayValues = function (source) {
  var valuesQuantity = getRandomValueFromRange(1, source.length); // Генерирует количество значений массива
  var array = shuffleArray(source).slice(0, valuesQuantity);
  return array;
};

// Значения для генерация тестовых данных
var testDataSource = {
  avatarSrc: function (avatarNumber) {
    var avatarAddress = 'img/avatars/user{{xx}}.png';
    var avatarAddressNumber = new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2}).format(avatarNumber);
    return avatarAddress.replace('{{xx}}', avatarAddressNumber);
  },
  titleSrc: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  typeSrc: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  checkinChecoutTimeSrc: [
    '12:00',
    '13:00',
    '14:00'
  ],
  featuresSrc: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  photosSrc: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ],
};
var ESC_KEYCODE = 27;
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
var adPrice = adForm.querySelector('#price');
var adMinPrices = {
  flat: 1000,
  bungalo: 0,
  house: 5000,
  palace: 10000
};
var adCheckIn = adForm.querySelector('#timein');
var adCheckOut = adForm.querySelector('#timeout');
var adRoomNumber = adForm.querySelector('#room_number');
var adCapacity = adForm.querySelector('#capacity');
var adCapacityOptions = adForm.querySelectorAll('#capacity option');
var adCapacityValues = {
  1: ['1'],
  2: ['2', '1'],
  3: ['3', '2', '1'],
  100: ['0']
};
var adFormValidatedFields = adForm.querySelectorAll('#title, #price, #capacity');
var adFormSubmitBtn = adForm.querySelector('.ad-form__submit');

// Генерирует массив тестовых данных
var renderTestData = function (testData, quantity) {
  var testdata = [];
  var titles = shuffleArray(testData.titleSrc);
  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomValueFromRange(300, 900);
    var locationY = getRandomValueFromRange(150, 500);
    var checkTime = getRandomArrayValue(testData.checkinChecoutTimeSrc);
    testdata.push({
      author: {
        avatar: testData.avatarSrc(i + 1),
      },
      offer: {
        title: titles[i],
        address: locationX + ', ' + locationY,
        price: getRandomValueFromRange(1000, 1000000),
        type: getRandomArrayValue(testData.typeSrc),
        rooms: getRandomValueFromRange(1, 5),
        guests: getRandomValueFromRange(1, 10),
        checkin: checkTime,
        checkout: checkTime,
        features: getRandomArrayValues(testData.featuresSrc),
        description: '',
        photos: shuffleArray(testData.photosSrc)
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
  return testdata;
};

// Получает тип объявления
var getAdType = function (type) {
  if (type === 'flat') {
    return 'Квартира';
  } else if (type === 'bungalo') {
    return 'Бунгало';
  } else if (type === 'house') {
    return 'Дом';
  } else {
    return 'Дворец';
  }
};

// Создает фрагмент c 1 меткой
var createMarkFragment = function (dataSourceItem, markFragmentTemplateSrc, markSizeSrc) {
  var fragment = markFragmentTemplateSrc.cloneNode(true);
  fragment.style.left = dataSourceItem.location.x - markSizeSrc.width / 2 + 'px';
  fragment.style.top = dataSourceItem.location.y - markSizeSrc.height + 'px';
  fragment.querySelector('img').src = dataSourceItem.author.avatar;
  fragment.querySelector('img').alt = dataSourceItem.offer.title;
  return fragment;
};

// Генерирует список меток
var createMarkList = function (dataSource, markFragmentTemplateSrc, markSizeSrc) {
  var itemList = document.createDocumentFragment();
  for (var i = 0; i < dataSource.length; i++) {
    itemList.appendChild(createMarkFragment(dataSource[i], markFragmentTemplateSrc, markSizeSrc));
  }
  return itemList;
};

// Добавляет метки на карту
var addMarkListToMap = function (dataSource, markFragmentTemplateSrc, markSizeSrc) {
  var markList = createMarkList(dataSource, markFragmentTemplateSrc, markSizeSrc);
  pinsArea.appendChild(markList);
};

// Создает фрагмент с объявлением
var createAdFragment = function (dataSourceItem, markFragmentTemplateSrc) {
  var fragment = markFragmentTemplateSrc.cloneNode(true);

  fragment.querySelector('.popup__title').textContent = dataSourceItem.offer.title;
  fragment.querySelector('.popup__text--address').textContent = dataSourceItem.offer.address;
  fragment.querySelector('.popup__text--price').textContent = dataSourceItem.offer.price + '₽/ночь';
  fragment.querySelector('.popup__type').textContent = getAdType(dataSourceItem.offer.type);
  var capacityText = dataSourceItem.offer.rooms + ' комнаты для ' + dataSourceItem.offer.guests + ' гостей';
  fragment.querySelector('.popup__text--capacity').textContent = capacityText;
  var timeText = 'Заезд после ' + dataSourceItem.offer.checkin + ', выезд до ' + dataSourceItem.offer.checkout;
  fragment.querySelector('.popup__text--time').textContent = timeText;

  // Добавляет доступные удобства
  fragment.querySelector('.popup__features').textContent = '';
  for (var i = 0; i < dataSourceItem.offer.features.length; i++) {
    var feature = fragment.querySelector('.popup__features').appendChild(document.createElement('li'));
    feature.classList.add('popup__feature');
    feature.classList.add('popup__feature--' + dataSourceItem.offer.features[i]);
  }

  fragment.querySelector('.popup__description').textContent = dataSourceItem.offer.description;

  // Добавляет фото
  var imageFragment = fragment.querySelector('.popup__photo');
  fragment.querySelector('.popup__photos').textContent = '';
  for (i = 0; i < dataSourceItem.offer.photos.length; i++) {
    var photo = fragment.querySelector('.popup__photos').appendChild(imageFragment.cloneNode());
    photo.src = dataSourceItem.offer.photos[i];
  }

  // Добавляет аватар
  fragment.querySelector('.popup__avatar').src = dataSourceItem.author.avatar;

  return fragment;
};

// Генерирует и добавляет объявление на карту
var addAdToMap = function (dataSourceItem, adFragmentTemplateSrc) {
  var existedCard = document.querySelector('.map__card');
  if (existedCard) {
    map.removeChild(existedCard);
  }
  var ad = document.createDocumentFragment()
      .appendChild(createAdFragment(dataSourceItem, adFragmentTemplateSrc));
  map.insertBefore(ad, map.querySelector('.map__filters-container'));
};

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
  adType.removeEventListener('input', onAdTypeChange);
  adCheckIn.removeEventListener('input', onCheckInChange);
  adCheckOut.removeEventListener('input', onCheckOutChange);
  adRoomNumber.removeEventListener('input', onRoomNumberChange);
  adFormSubmitBtn.removeEventListener('invalid', onSubmitBtnClick);
  adForm.removeEventListener('input', onValidatedFieldsChange);
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
  var testData = renderTestData(testDataSource, markQuantity);
  addMarkListToMap(testData, markFragmentTemplate, markSize);
  addListenersToMarks(testData);

  /* Добавляет слушатели */
  mainMark.removeEventListener('mousedown', onInitialMarkMouseDown);
  map.addEventListener('click', onCloseAdBtnClick);
  document.addEventListener('keydown', onEscPress);
  adType.addEventListener('input', onAdTypeChange);
  adCheckIn.addEventListener('input', onCheckInChange);
  adCheckOut.addEventListener('input', onCheckOutChange);
  adRoomNumber.addEventListener('input', onRoomNumberChange);
  adFormSubmitBtn.addEventListener('click', onSubmitBtnClick);
  adForm.addEventListener('input', onValidatedFieldsChange);

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
    addAdToMap(testDataSrc[number], adFragmentTemplate);
  });
};

var onCloseAdBtnClick = function (evt) {
  var closeAdBtn = map.querySelector('.popup__close');
  if (evt.target === closeAdBtn) {
    map.removeChild(map.querySelector('.map__card'));
  }
};

var onEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && map.querySelector('.map__card')) {
    map.removeChild(map.querySelector('.map__card'));
  }
};

/* Валидация полей формы */
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

