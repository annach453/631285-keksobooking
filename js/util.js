'use strict';

(function () {

  var ESC_KEYCODE = 27;

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

  window.util = {
    'ESC_KEYCODE': ESC_KEYCODE,
    'getRandomValueFromRange': getRandomValueFromRange,
    'getRandomArrayValue': getRandomArrayValue,
    'shuffleArray': shuffleArray,
    'getRandomArrayValues': getRandomArrayValues
  };

})();
