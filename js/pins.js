'use strict';

(function () {

  var pinsArea = document.querySelector('.map__pins');

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

  window.pins = {
    'addMarkListToMap': addMarkListToMap
  };

})();
