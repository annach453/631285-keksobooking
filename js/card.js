'use strict';

(function () {

  var map = document.querySelector('.map');
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

  window.card = {
    'addAdToMap': addAdToMap
  };

})();
