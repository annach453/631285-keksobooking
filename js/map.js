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
var markQuantity = 8; // Количество меток на карте
var markFragmentTemplate = document.querySelector('template').content.querySelector('.map__pin'); // Фрагмент для вывода меток
var adFragmentTemplate = document.querySelector('template').content.querySelector('.map__card'); // Фрагмент для вывода объявления
var markSize = { /* Размер метки */
  width: 50,
  height: 70
};
var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormFieldset = document.querySelectorAll('.ad-form fieldset');
var mainMark = document.querySelector('.map__pin--main');
var initialMarkSize = {
  width: 65,
  height: 65
};
var mainMarkSize = {
  width: 65,
  height: 87
};
var addressInput = document.querySelector('#address');
var ESC_KEYCODE = 27;

// Генерирует массив тестовых данных
var renderTestData = function (testData, quantity) {
  var testdata = [];
  var titles = shuffleArray(testData.titleSrc);
  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomValueFromRange(300, 900);
    var locationY = getRandomValueFromRange(150, 500);
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
        checkin: getRandomArrayValue(testData.checkinChecoutTimeSrc),
        checkout: getRandomArrayValue(testData.checkinChecoutTimeSrc),
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
  map.querySelector('.map__pins').appendChild(markList);
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
  mainMark.addEventListener('mouseup', setActiveMode);
  map.removeEventListener('click', onCloseAdBtnClick);
  document.removeEventListener('keydown', onEscPress);
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

  /* Добваляет слушатели */
  mainMark.removeEventListener('mouseup', setActiveMode);
  map.addEventListener('click', onCloseAdBtnClick);
  document.addEventListener('keydown', onEscPress);
};

var getMainMarkCoords = function (evt) {
  if (evt) {
    addressInput.value = evt.clientX + Math.round(mainMarkSize.width / 2) + ', ';
    addressInput.value += evt.clientY + mainMarkSize.height;
  } else {
    var initialMainMarkCoords = mainMark.getBoundingClientRect();
    addressInput.value = initialMainMarkCoords.left + Math.round(initialMarkSize.width / 2) + ', ';
    addressInput.value += initialMainMarkCoords.top + Math.round(initialMarkSize.height / 2);
  }
};

var addListenersToMarks = function (testDataSrc) {
  var marks = map.querySelectorAll('.map__pin[type="button"]');
  for (var i = 0; i < marks.length; i++) {
    (function (mark, number) {
      mark.addEventListener('click', function () {
        addAdToMap(testDataSrc[number], adFragmentTemplate);
      });
    })(marks[i], i);
  }
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

setSleepMode();
getMainMarkCoords();
mainMark.addEventListener('mouseup', getMainMarkCoords);
