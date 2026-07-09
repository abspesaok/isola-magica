/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 7 · LA PALESTRA DELLA GRAMMATICA — POOL DI DATI (isole 62-71)
   Frasi per i motori `order` (tessere-parola) e `cloze` (riempi-il-buco) +
   l'esame del boss. Estratte da App.jsx in un modulo PURO così da poterle
   importare ANCHE nel generatore audio (voci vere) senza ri-trascriverle.
   La voce parlata è il campo `sayText` (order/cloze) e `q`/`a` (esame).
   ═══════════════════════════════════════════════════════════ */

// order: { key, en (canonica → tessere), it (senso mostrato), sayText (voce), accepted (permutazioni valide) }
export const GRAM_QUESTIONS = [
  { key: "q_pizza", en: "Do you like pizza", it: "Ti piace la pizza?", sayText: "Do you like pizza?", accepted: [] },
  { key: "q_live", en: "Where do you live", it: "Dove vivi?", sayText: "Where do you live?", accepted: [] },
  { key: "q_swim", en: "Can you swim", it: "Sai nuotare?", sayText: "Can you swim?", accepted: [] },
  { key: "q_name", en: "What is your name", it: "Come ti chiami?", sayText: "What is your name?", accepted: [] },
  { key: "q_tennis", en: "Does she play tennis", it: "Lei gioca a tennis?", sayText: "Does she play tennis?", accepted: [] },
  { key: "q_home", en: "Are they at home", it: "Sono a casa?", sayText: "Are they at home?", accepted: [] },
  { key: "q_getup", en: "When do you get up", it: "Quando ti alzi?", sayText: "When do you get up?", accepted: [] },
  { key: "q_old", en: "How old are you", it: "Quanti anni hai?", sayText: "How old are you?", accepted: [] },
];
export const GRAM_NEGATIVES = [
  { key: "n_fish", en: "I do not like fish", it: "Non mi piace il pesce", sayText: "I do not like fish.", accepted: [] },
  { key: "n_swim", en: "She cannot swim", it: "Lei non sa nuotare", sayText: "She cannot swim.", accepted: [] },
  { key: "n_tired", en: "They are not tired", it: "Loro non sono stanchi", sayText: "They are not tired.", accepted: [] },
  { key: "n_golf", en: "He does not play golf", it: "Lui non gioca a golf", sayText: "He does not play golf.", accepted: [] },
  { key: "n_ready", en: "We are not ready", it: "Noi non siamo pronti", sayText: "We are not ready.", accepted: [] },
  { key: "n_cold", en: "It is not cold today", it: "Oggi non fa freddo", sayText: "It is not cold today.", accepted: ["Today it is not cold"] },
  { key: "n_need", en: "You do not need it", it: "Non ti serve", sayText: "You do not need it.", accepted: [] },
  { key: "n_pen", en: "I do not have a pen", it: "Non ho una penna", sayText: "I do not have a pen.", accepted: [] },
];
export const GRAM_PAST = [
  { key: "pa_foot", en: "Yesterday I played football", it: "Ieri ho giocato a calcio", sayText: "Yesterday I played football.", accepted: ["I played football yesterday"] },
  { key: "pa_park", en: "She went to the park", it: "Lei è andata al parco", sayText: "She went to the park.", accepted: [] },
  { key: "pa_dog", en: "We saw a big dog", it: "Abbiamo visto un cane grande", sayText: "We saw a big dog.", accepted: [] },
  { key: "pa_pizza", en: "They ate some pizza", it: "Loro hanno mangiato un po' di pizza", sayText: "They ate some pizza.", accepted: [] },
  { key: "pa_book", en: "He read a good book", it: "Lui ha letto un bel libro", sayText: "He read a good book.", accepted: [] },
  { key: "pa_hmwk", en: "I did my homework", it: "Ho fatto i compiti", sayText: "I did my homework.", accepted: [] },
  { key: "pa_lunch", en: "We had lunch together", it: "Abbiamo pranzato insieme", sayText: "We had lunch together.", accepted: ["Together we had lunch"] },
  { key: "pa_hat", en: "She bought a new hat", it: "Lei ha comprato un cappello nuovo", sayText: "She bought a new hat.", accepted: [] },
];
// Comparativi: accepted azzerati (invertire i nomi cambierebbe il senso mostrato in italiano)
export const GRAM_COMPARE = [
  { key: "c_carbike", en: "A car is faster than a bike", it: "Una macchina è più veloce di una bici", sayText: "A car is faster than a bike.", accepted: [] },
  { key: "c_box", en: "This box is bigger than that box", it: "Questa scatola è più grande di quella scatola", sayText: "This box is bigger than that box.", accepted: [] },
  { key: "c_tall", en: "She is the tallest girl", it: "Lei è la ragazza più alta", sayText: "She is the tallest girl.", accepted: [] },
  { key: "c_lion", en: "A lion is stronger than a cat", it: "Un leone è più forte di un gatto", sayText: "A lion is stronger than a cat.", accepted: [] },
  { key: "c_winter", en: "Winter is colder than summer", it: "L'inverno è più freddo dell'estate", sayText: "Winter is colder than summer.", accepted: [] },
  { key: "c_cake", en: "This is the best cake", it: "Questa è la torta migliore", sayText: "This is the best cake.", accepted: [] },
  { key: "c_bag", en: "My bag is heavier than your bag", it: "La mia borsa è più pesante della tua borsa", sayText: "My bag is heavier than your bag.", accepted: [] },
  { key: "c_young", en: "He is the youngest boy", it: "Lui è il ragazzo più giovane", sayText: "He is the youngest boy.", accepted: [] },
];
export const GRAM_CONDITIONAL = [
  { key: "if_rain", en: "If it rains we will stay home", it: "Se piove staremo a casa", sayText: "If it rains, we will stay home.", accepted: ["We will stay home if it rains"] },
  { key: "if_study", en: "If you study you will pass", it: "Se studi passerai", sayText: "If you study, you will pass.", accepted: ["You will pass if you study"] },
  { key: "if_tired", en: "If I am tired I will sleep", it: "Se sono stanco dormirò", sayText: "If I am tired, I will sleep.", accepted: ["I will sleep if I am tired"] },
  { key: "if_run", en: "If we run we will be early", it: "Se corriamo saremo in anticipo", sayText: "If we run, we will be early.", accepted: ["We will be early if we run"] },
  { key: "if_ask", en: "If she asks I will help", it: "Se lei chiede la aiuterò", sayText: "If she asks, I will help.", accepted: ["I will help if she asks"] },
  { key: "if_sunny", en: "If it is sunny we will go out", it: "Se c'è il sole usciremo", sayText: "If it is sunny, we will go out.", accepted: ["We will go out if it is sunny"] },
];

// cloze: { key, text (con ___), answer, bank (4 opzioni incl. risposta), it, sayText }
export const CLOZE_VERBFORMS = [
  { key: "vf_walk", text: "My sister ___ to school every day.", answer: "walks", bank: ["walk", "walks", "walking", "walked"], it: "Mia sorella va a piedi a scuola ogni giorno.", sayText: "My sister walks to school every day." },
  { key: "vf_climb", text: "Look! The cat ___ up the tree right now.", answer: "is climbing", bank: ["is climbing", "climbs", "climb", "climbed"], it: "Guarda! Il gatto sta salendo sull'albero proprio adesso.", sayText: "Look! The cat is climbing up the tree right now." },
  { key: "vf_make", text: "Yesterday we ___ a big cake.", answer: "made", bank: ["make", "makes", "making", "made"], it: "Ieri abbiamo fatto una grande torta.", sayText: "Yesterday we made a big cake." },
  { key: "vf_has", text: "My best friend ___ got two rabbits.", answer: "has", bank: ["have", "has", "having", "had"], it: "Il mio migliore amico ha due conigli.", sayText: "My best friend has got two rabbits." },
  { key: "vf_cook", text: "Dad ___ dinner in the kitchen now.", answer: "is cooking", bank: ["is cooking", "cooks", "cook", "cooked"], it: "Papà sta cucinando la cena in cucina adesso.", sayText: "Dad is cooking dinner in the kitchen now." },
  { key: "vf_went", text: "Last week I ___ to the zoo.", answer: "went", bank: ["go", "goes", "going", "went"], it: "La settimana scorsa sono andato allo zoo.", sayText: "Last week I went to the zoo." },
  { key: "vf_cry", text: "My baby brother ___ a lot at night.", answer: "cries", bank: ["cry", "cries", "crying", "cried"], it: "Il mio fratellino piange molto di notte.", sayText: "My baby brother cries a lot at night." },
  { key: "vf_have", text: "We ___ got a new red car.", answer: "have", bank: ["have", "has", "having", "had"], it: "Abbiamo una macchina nuova rossa.", sayText: "We have got a new red car." },
];
export const CLOZE_ARTICLES = [
  { key: "ar_eleph", text: "I can see ___ elephant at the zoo.", answer: "an", bank: ["a", "an", "the", "one"], it: "Vedo un elefante allo zoo.", sayText: "I can see an elephant at the zoo." },
  { key: "ar_car", text: "My mum has ___ new red car.", answer: "a", bank: ["a", "an", "the", "some"], it: "La mia mamma ha una nuova macchina rossa.", sayText: "My mum has a new red car." },
  { key: "ar_under", text: "The dog is ___ the table.", answer: "under", bank: ["under", "of", "behind", "between"], it: "Il cane è sotto il tavolo.", sayText: "The dog is under the table." },
  { key: "ar_in", text: "My books are ___ the bag.", answer: "in", bank: ["in", "on", "under", "between"], it: "I miei libri sono nella borsa.", sayText: "My books are in the bag." },
  { key: "ar_on", text: "The cat is sleeping ___ the bed.", answer: "on", bank: ["on", "in", "of", "from"], it: "Il gatto sta dormendo sul letto.", sayText: "The cat is sleeping on the bed." },
  { key: "ar_sat", text: "We play football ___ Saturday.", answer: "on", bank: ["on", "in", "at", "by"], it: "Giochiamo a calcio il sabato.", sayText: "We play football on Saturday." },
  { key: "ar_at", text: "My sister is ___ school now.", answer: "at", bank: ["at", "in", "on", "to"], it: "Mia sorella è a scuola adesso.", sayText: "My sister is at school now." },
  { key: "ar_july", text: "My birthday is ___ July.", answer: "in", bank: ["in", "on", "at", "by"], it: "Il mio compleanno è a luglio.", sayText: "My birthday is in July." },
];
export const CLOZE_TOBE = [
  { key: "tb_am", text: "I ___ seven years old.", answer: "am", bank: ["am", "is", "are", "be"], it: "Ho sette anni.", sayText: "I am seven years old." },
  { key: "tb_isfriend", text: "She ___ my best friend.", answer: "is", bank: ["am", "is", "are", "be"], it: "Lei è la mia migliore amica.", sayText: "She is my best friend." },
  { key: "tb_cats", text: "The cats ___ on the sofa.", answer: "are", bank: ["am", "is", "are", "be"], it: "I gatti sono sul divano.", sayText: "The cats are on the sofa." },
  { key: "tb_dad", text: "My dad ___ a teacher.", answer: "is", bank: ["am", "is", "are", "be"], it: "Mio papà è un insegnante.", sayText: "My dad is a teacher." },
  { key: "tb_we", text: "We ___ in the classroom.", answer: "are", bank: ["am", "is", "are", "be"], it: "Noi siamo in aula.", sayText: "We are in the classroom." },
  { key: "tb_book", text: "The book ___ on the table.", answer: "is", bank: ["am", "is", "are", "be"], it: "Il libro è sul tavolo.", sayText: "The book is on the table." },
  { key: "tb_you", text: "You ___ my friends.", answer: "are", bank: ["am", "is", "are", "be"], it: "Voi siete i miei amici.", sayText: "You are my friends." },
  { key: "tb_sunny", text: "It ___ a sunny day.", answer: "is", bank: ["am", "is", "are", "be"], it: "È una giornata di sole.", sayText: "It is a sunny day." },
];
export const CLOZE_QUANTIFIERS = [
  { key: "qt_apples", text: "There are ___ apples on the table.", answer: "some", bank: ["some", "any", "much", "a"], it: "Ci sono alcune mele sul tavolo.", sayText: "There are some apples on the table." },
  { key: "qt_money", text: "I do not have ___ money.", answer: "any", bank: ["any", "some", "many", "a"], it: "Non ho soldi.", sayText: "I do not have any money." },
  { key: "qt_water", text: "How ___ water do you want?", answer: "much", bank: ["much", "many", "some", "any"], it: "Quanta acqua vuoi?", sayText: "How much water do you want?" },
  { key: "qt_books", text: "How ___ books have you got?", answer: "many", bank: ["many", "much", "some", "any"], it: "Quanti libri hai?", sayText: "How many books have you got?" },
  { key: "qt_pets", text: "Have you got ___ pets at home?", answer: "any", bank: ["any", "some", "much", "a"], it: "Hai degli animali domestici a casa?", sayText: "Have you got any pets at home?" },
  { key: "qt_milk", text: "There is not ___ milk in the fridge.", answer: "much", bank: ["much", "many", "some", "a"], it: "Non c'è molto latte in frigorifero.", sayText: "There is not much milk in the fridge." },
  { key: "qt_friends", text: "We have got ___ friends at school.", answer: "many", bank: ["many", "much", "any", "a"], it: "Abbiamo molti amici a scuola.", sayText: "We have got many friends at school." },
  { key: "qt_juice", text: "Would you like ___ juice?", answer: "some", bank: ["some", "a", "many", "much"], it: "Vuoi un po' di succo?", sayText: "Would you like some juice?" },
];

// Boss: ripasso costruzione + esame grammaticale (diploma "Campione di Grammatica")
export const GRAM_BOSS_ORDER = [
  { key: "bo_icecream", en: "Do you like ice cream", it: "Ti piace il gelato?", sayText: "Do you like ice cream?", accepted: [] },
  { key: "bo_snakes", en: "I do not like snakes", it: "Non mi piacciono i serpenti", sayText: "I do not like snakes.", accepted: [] },
  { key: "bo_school", en: "Yesterday we went to school", it: "Ieri siamo andati a scuola", sayText: "Yesterday we went to school.", accepted: ["We went to school yesterday"] },
  { key: "bo_dogcat", en: "A dog is bigger than a cat", it: "Un cane è più grande di un gatto", sayText: "A dog is bigger than a cat.", accepted: [] },
  { key: "bo_play", en: "If you are good we will play", it: "Se sei bravo giocheremo", sayText: "If you are good, we will play.", accepted: ["We will play if you are good"] },
  { key: "bo_player", en: "He is the best player", it: "Lui è il giocatore migliore", sayText: "He is the best player.", accepted: [] },
];
export const GRAM_EXAM = [
  { key: "ex_went", q: "What is the past of the verb go?", a: "went" },
  { key: "ex_has", q: "She blank a new bike. Have got: have or has?", a: "has" },
  { key: "ex_am", q: "I blank happy today. Am, is or are?", a: "am" },
  { key: "ex_some", q: "There are blank apples. Some or any?", a: "some" },
  { key: "ex_an", q: "I have blank orange. A or an?", a: "an" },
  { key: "ex_are", q: "The dogs blank big. Is or are?", a: "are" },
  { key: "ex_many", q: "How blank books have you got? Much or many?", a: "many" },
  { key: "ex_plays", q: "He blank football every day. Play or plays?", a: "plays" },
];
