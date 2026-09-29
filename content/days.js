/*
 * Содержимое адвент-календаря.
 *
 * Для каждого дня можно задать:
 * - title   — заголовок
 * - text    — строка или массив строк
 * - image   — путь к картинке (например "images/day-01.jpg")
 * - imageAlt — альтернативный текст для картинки
 * - video   — путь к MP4 (например "videos/day-01.mp4")
 * - link    — объект { label: "...", url: "https://..." }
 *
 * Можно использовать одновременно text + image + video.
 */

window.ADVENT_DAYS = [
  {
    day: 1,
    title: "Тут можно узнать больше о себе",
    text: [
      "Приветик!",
      "Начинается наш маленький марафон сюрпризов.",
      "Узнай о себе немного больше тут:"
    ],
    link: {
      label: "Какая ты сегодня?",
      url: "https://uquiz.com/quiz/LxOSuF"
    }
  },
  {
    day: 2,
    title: "Тут лежит старый прикол",
    text: "Мы вспомнили одну о-о-очень старую штуку, надеемся ты тоже её помнишь:",
    link: {
      label: "Посмотреть на древний мем",
      url: "https://drive.google.com/drive/folders/1LsHPsmOjimhtsnwHJEoVMTnEYVeybv5y?usp=drive_link"
    }
  },
  {
    day: 3,
    title: "Тут можно выиграть в Бинго",
    text: "Никогда не думала о том, насколько ты Соня? А насколько мы - Соня??",
    link: {
      label: "Узнать, насколько мы Сони",
      url: "https://drive.google.com/drive/folders/1EsasPVe8gteLfaCt5E6TSdhJFQ_B-yeK?usp=sharing"
    }
  },
  {
    day: 4,
    title: "Тут за нас говорит музыка",
    text: "Музыкаааа - это дивная странааа, все векааа принимала всех онаааа",
    link: {
      label: "Услышать, что  хочет сказать музыка",
      url: "https://spotify.com"
    }
  },
  {
    day: 5,
    title: "Тут можно узнать, что о тебе думают",
    text: "Мы поностальгировали по детству и выдали это:",
    link: {
      label: "Посмотреть на анкету для девочек",
      url: "https://drive.google.com/drive/folders/1xyeJV8o9JQOQ6El7uUpr-wsHIfva8eXf?usp=sharing"
    }
  },
  {
    day: 6,
    title: "Шестой день",
    text: "Здесь можно добавить фотографию.",
    // image: "images/day-06.jpg",
    imageAlt: "Изображение шестого дня"
  },
  {
    day: 7,
    title: "Седьмой день",
    text: "А здесь можно показать видео.",
    // video: "videos/day-07.mp4"
  },
  {
    day: 8,
    title: "Восьмой день",
    text: "Ещё один маленький сюрприз."
  },
  {
    day: 9,
    title: "Тут мы - попаданцы",
    text: "Мы куда-то попали...",
    link: {
      label: "Узнать, куда",
      url: "https://drive.google.com/drive/folders/11x0K7IUqOJbWWCbs8Zp2uz3XJ1IykH_V?usp=drive_link"
    }
  },
  {
    day: 10,
    title: "Десятый день",
    text: "Почти финал — осталось совсем немного!"
  },
  {
    day: 11,
    title: "Тут можно послушать нас",
    text: "Нам ещё так много хочется тебе сказать:",
    link: {
      label: "Послушать нас (и посмотреть)",
      url: "https://drive.google.com/drive/folders/1eU8fYkrSL2oLZTunLxrSFGExtvyAuqtB?usp=sharing"
    }
  },
  {
    day: 12,
    title: "Тут будет неожиданный бонус",
    text: "К нам в руки попал один эксклюзивный обзор...",
    link: {
      label: "Посмотреть обзор",
      url: "https://drive.google.com/drive/folders/1oywlws-tjhIWl-Eiim3StIBeLWqWUnNU?usp=drive_link"
    }
  }
];
