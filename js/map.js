'use strict';

// Возвращает случайное число из диапазона
var getRandomElement = function (min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
};

// Возвращает 1 случайное значение массива
var getRandomArrayValue = function (array) {
  return array[getRandomElement(0, array.length - 1)];
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
  var valuesQuantity = getRandomElement(1, source.length); // Генерирует количество значений массива
  var array = shuffleArray(source.slice()).slice(0, valuesQuantity);
  return array;
};

// Значения для генерация тестовых данных
var testDataSource = {
  avatarSrc: 'img/avatars/user{{xx}}.png',
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

// Генерирует массив тестовых данных
var renderTestData = function (testData, quantity) {
  var testdata = [];
  var titles = shuffleArray(testData.titleSrc);
  for (var i = 0; i < quantity; i++) {
    var locationX = getRandomElement(300, 900);
    var locationY = getRandomElement(150, 500);
    testdata.push({
      author: {
        avatar: testData.avatarSrc.replace('{{xx}}', new Intl.NumberFormat('ru-RU', {minimumIntegerDigits: 2, useGrouping: false}).format(i + 1)),
      },
      offer: {
        title: titles[i],
        address: locationX + ', ' + locationY,
        price: getRandomElement(1000, 1000000),
        type: getRandomArrayValue(testData.typeSrc),
        rooms: getRandomElement(1, 5),
        guests: getRandomElement(1, 10),
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
  var map = document.querySelector('.map');
  map.classList.remove('map--faded');
  var markList = createMarkList(dataSource, markFragmentTemplateSrc, markSizeSrc);
  map.querySelector('.map__pins').appendChild(markList);
};

// Создает фрагмент с объявлением
var createAdFragment = function (dataSourceItem, markFragmentTemplateSrc) {
  var fragment = markFragmentTemplateSrc.cloneNode(true);

  fragment.querySelector('.popup__title').textContent = dataSourceItem.offer.title;
  fragment.querySelector('.popup__text--address').textContent = dataSourceItem.offer.address;
  fragment.querySelector('.popup__text--price').textContent = dataSourceItem.offer.price + '₽/ночь';
  switch (dataSourceItem.offer.type) {
    case 'flat':
      fragment.querySelector('.popup__type').textContent = 'Квартира';
      break;
    case 'bungalo':
      fragment.querySelector('.popup__type').textContent = 'Бунгало';
      break;
    case 'house':
      fragment.querySelector('.popup__type').textContent = 'Дом';
      break;
    case 'palace':
      fragment.querySelector('.popup__type').textContent = 'Дворец';
      break;
  }
  fragment.querySelector('.popup__text--capacity').textContent = dataSourceItem.offer.rooms + ' комнаты для ' + dataSourceItem.offer.guests + ' гостей';
  fragment.querySelector('.popup__text--time').textContent = 'Заезд после ' + dataSourceItem.offer.checkin + ', выезд до ' + dataSourceItem.offer.checkout;

  // Добавляет доступные удобства
  fragment.querySelector('.popup__features').textContent = '';
  for (var i = 0; i < dataSourceItem.offer.features.length; i++) {
    fragment.querySelector('.popup__features').appendChild(document.createElement('li')).classList.add('popup__feature', 'popup__feature--' + dataSourceItem.offer.features[i]);
  }

  fragment.querySelector('.popup__description').textContent = dataSourceItem.offer.description;

  // Добавляет фото
  var imageFragment = fragment.querySelector('.popup__photo');
  fragment.querySelector('.popup__photos').textContent = '';
  for (i = 0; i < dataSourceItem.offer.photos.length; i++) {
    fragment.querySelector('.popup__photos').appendChild(imageFragment.cloneNode()).src = dataSourceItem.offer.photos[i];
  }

  return fragment;
};

// Генерирует и добавляет объявление на карту
var addAdToMap = function (dataSourceItem, adFragmentTemplateSrc) {
  var map = document.querySelector('.map');
  var ad = document.createDocumentFragment().appendChild(createAdFragment(dataSourceItem, adFragmentTemplateSrc));
  map.insertBefore(ad, map.querySelector('.map__filters-container'));
};

var testData = renderTestData(testDataSource, markQuantity);
addMarkListToMap(testData, markFragmentTemplate, markSize);
addAdToMap(testData[1], adFragmentTemplate);
