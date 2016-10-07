/**
 * str.js - string extensions from /utils
 */

export function getGreeting(helloee = "world", lang = "en") {
  // helloee get default value (es6), vs `helloee || "world"` (es5)
  // in es6: `let variable` is not hoisted
  let boxline = '----------------------------------------'
  let greeton = transGreeting(lang)
  let message = trimIndent `
    ${boxline}
     ${greeton}, ${helloee} !
    ${boxline}
    `
  return message
}

export function transGreeting(lang = "en") {
  return greetingLangs[lang] || "Hi"
}

export function trimIndent(strings, ...values) {
  // in es5: values = Array.prototype.slice.call(arguments, 1)
  var output = ''
  var regexp = /(\r\n|\n|\r)\s+/gm

  // find the first indent pattern
  if (values.length > 1 && /(\r\n|\n|\r)\s+/.test(strings[0])) {
    regexp = new RegExp(strings[0], "gi")
  }

  // for-of loop (es6) each value
  for (const [index, item] of values.entries()) {
    output += strings[index].replace(regexp, "\n") + item
  }

  return output.replace(/^(\r\n|\n|\r)/, "").trim() + "\n"
}


// Note: to export this greetings dictionary
// ```
//  export const greetings = greetingLangs
// ```
var greetingLangs = {
  "ar": "مرحبا / Marhaba",
  "bg": "Здравейте / Zdravei / Zdrasti",
  "cs": "Dobrý den / Ahoj",
  "cy": "Hylo / Sut Mae?",
  "da": "Goddag / Hej",
  "de": "Guten Tag",
  "ds": "Goddag / Hej",
  "el": "Χαίρετε / Gia'sou",
  "en": "Hello",
  "eo": "Saluton",
  "es": "Hola",
  "fi": "Hei",
  "fr": "Bonjour",
  "he": "שלום / Shalom",
  "hi": "नमस्ते / Namaste",
  "hr": "Zdravo",
  "hu": "Jó napot",
  "hw": "Aloha",
  "hy": "Բարեւ / Parev",
  "id": "Halo",
  "is": "Halló / Góðan daginn",
  "it": "Salve / Ciao",
  "ja": "こんにちは / Ohayo / Konnichiwa / Konban Wa",
  "ka": "Сәлеметсіз бе / Salemetsiz Be?",
  "ko": "여보세요 / Ahn-Young-Ha-Se-Yo",
  "mo": "Sain Bainuu",
  "nl": "Hallo / Goede dag",
  "pl": "Dzien' dobry",
  "pt": "Olá",
  "ro": "Bunã ziua",
  "ru": "Здравствуйте / Zdras-Tvuy-Te",
  "sa": "Salaam",
  "se": "Hallo",
  "sq": "Mirëdita",
  "sr": "Salve / Salvëte",
  "sw": "Jambo / Hujambo",
  "th": "สวัสดี / Sa-wat-dee",
  "tr": "Merhaba",
  "uk": "Здравствуйте / Vitayu",
  "vi": "Xin chào / Chào bạn",
  "yi": "Sholem Aleychem",
  "zh": "你好 / Nay Hoh / Nihao",
  "zu": "Sawubona"
}
