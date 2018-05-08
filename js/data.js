'use strict';

(function () {

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

  // Генерирует массив тестовых данных
  var renderTestData = function (testData, quantity) {
    var testdata = [];
    var titles = window.util.shuffleArray(testData.titleSrc);
    for (var i = 0; i < quantity; i++) {
      var locationX = window.util.getRandomValueFromRange(300, 900);
      var locationY = window.util.getRandomValueFromRange(150, 500);
      var checkTime = window.util.getRandomArrayValue(testData.checkinChecoutTimeSrc);
      testdata.push({
        author: {
          avatar: testData.avatarSrc(i + 1),
        },
        offer: {
          title: titles[i],
          address: locationX + ', ' + locationY,
          price: window.util.getRandomValueFromRange(1000, 1000000),
          type: window.util.getRandomArrayValue(testData.typeSrc),
          rooms: window.util.getRandomValueFromRange(1, 5),
          guests: window.util.getRandomValueFromRange(1, 10),
          checkin: checkTime,
          checkout: checkTime,
          features: window.util.getRandomArrayValues(testData.featuresSrc),
          description: '',
          photos: window.util.shuffleArray(testData.photosSrc)
        },
        location: {
          x: locationX,
          y: locationY
        }
      });
    }
    return testdata;
  };

  window.data = {
    'testDataSource': testDataSource,
    'renderTestData': renderTestData
  };

})();
