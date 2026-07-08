import { useState, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   ISOLA MAGICA — Generatore Audio Batch (ElevenLabs)
   Costruisce ~670 clip MP3 da tutte le frasi del gioco (isole 1-20)
   e le scarica in un unico ZIP (+ manifest.json).
   La API key vive solo in memoria: mai salvata, mai loggata.
   ═══════════════════════════════════════════════════════════ */

/* ─── Game data (must mirror the game exactly) ─── */
const COLORS = ["red","blue","green","yellow","purple","pink","orange","brown","white","black"];
const ANIMALS = ["cat","dog","horse","fish","bird","elephant","lion","monkey","mouse","sheep","cow","duck","frog","bee"];
const FAMILY = ["mother","father","sister","brother","baby","grandmother","grandfather"];
const BODY = ["eyes","ear","nose","mouth","hand","foot","arm","leg","face"];
const FOOD = ["apple","banana","orange","egg","bread","milk","water","cake","ice cream","pizza","chicken","rice","carrot","grapes"];
const VEGETABLES = ["carrot","tomato","potato","onion","peas","corn","pepper","cucumber","mushroom","broccoli"]; // Isola 5 · L'Orto Reale
const HOUSE = ["bed","chair","door","window","lamp","clock","key","sofa","television","cup"];
const SCHOOL = ["book","pen","pencil","bag","ruler","scissors","crayon","notebook"];
const NUMBER_WORDS = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"];
const PRAISE = ["Great job!","Wonderful!","Perfect!","Amazing!","Well done!","Fantastic!"];
const PREP_SUBJECTS = ["cat","dog","ball","mouse"];
const PREP_OBJECTS = ["box","chair","bed"];
const PREPS = ["in","on","under"];

/* Isole 7-10 (resto Arcipelago 1) */
const VERBS = ["run","jump","swim","walk","dance","sing","clap","sleep","eat","drink","read","draw"];
const WEATHER = ["sunny","rainy","cloudy","windy","snowy","stormy"];
const NATURE = ["sun","moon","star","tree","flower","rainbow","cloud","leaf"];
const CLOTHES = ["shirt","trousers","dress","shoes","socks","hat","coat","shorts","boots","gloves","scarf","cap"];

/* Isole 11-20 (Arcipelago 2 · Movers) */
const JOBS = ["doctor","teacher","farmer","cook","pilot","police officer","firefighter","singer","painter","astronaut"];
const PLACES = ["school","hospital","shop","park","house","station","farm","beach","castle","church"];
const MARKET = ["apple","banana","orange","grapes","carrot","tomato","potato","cheese","bread","lemon"];
const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const ROUTINE = ["get up","wash","eat breakfast","go to school","play","go to bed"];
const PAST_VERBS = ["played","ate","ran","jumped","slept","sang","danced","swam","drew","flew"];
const SEASONS = ["spring","summer","autumn","winter"];
const HEALTH = ["headache","tummy ache","cold","cough","fever","toothache","sore throat","earache"];
const SPORTS = ["football","basketball","tennis","swimming","running","cycling","skiing","baseball","volleyball","dancing"];
const TRANSPORT = ["car","bus","train","plane","boat","bike","taxi","helicopter","scooter","truck"];
const DIRECTIONS = ["left","right","straight on","back","up","down"];

/* Isole 21-30 (Arcipelago 3 · Flyers) — devono rispecchiare esattamente App.jsx */
const WORLD = ["Italy","France","Spain","Germany","China","America","Brazil","Egypt","Japan","Australia"];
const LANDSCAPE = ["mountain","river","desert","forest","island","volcano","jungle","cave","waterfall","sea"];
const FEELINGS = ["happy","sad","angry","scared","tired","excited","surprised","bored","hungry","thirsty"];
const MATERIALS = ["wood","glass","metal","plastic","gold","paper","stone","wool","ice","cloth"];
const TECH = ["computer","phone","camera","robot","keyboard","television","headphones","game","printer","mouse"];
const SEA = ["dolphin","whale","shark","octopus","crab","jellyfish","seal","turtle","fish","shell"];
const SPACE = ["star","moon","sun","planet","rocket","astronaut","alien","Earth","comet","telescope"];
const FUTURE_ACTIONS = ["travel","fly","swim","read","win","paint","dance","sing","cook","explore"];
const SEEN_THINGS = ["dragon","castle","rainbow","dolphin","mountain","star","robot","snake","whale","lion"];
const ADJECTIVES = ["big","small","tall","fast","slow","strong","hot","cold","happy","scary"];
const FLYERS_POOL = [
  ...LANDSCAPE.slice(0, 3), ...FEELINGS.slice(0, 3), ...SEA.slice(0, 3),
  ...SPACE.slice(0, 3), ...TECH.slice(0, 3), ...MATERIALS.slice(0, 2),
];

/* Isole 31-40 (Arcipelago 4 · Explorers, verso il B1) — rispecchiano App.jsx */
const ENVIRONMENT = ["bottle","can","paper","box","jar","battery","plastic","bag","newspaper","carton"];
const SCHOOL_SUBJECTS = ["maths","science","history","geography","art","music","English","sport","drama","computers"];
const HABITS = ["drink water","eat fruit","eat vegetables","do exercise","sleep well","wash your hands","brush your teeth","go outside","eat salad","rest"];
const TRAVEL_HOLIDAY = ["airport","hotel","ticket","map","beach","camera","gift","passport","suitcase","tent"];
const RESTAURANT_FOOD = ["rice","noodles","steak","soup","salad","pasta","juice","curry","sushi","chips"];
const ENTERTAINMENT = ["movie","popcorn","guitar","drum","song","circus","magic","clown","balloon","cartoon"];
const DIGITAL = ["email","photo","video","chat","wifi","app","screen","link","website","download"];
const PERSONALITY = ["friendly","funny","clever","kind","shy","brave","quiet","polite","calm","tidy"];
const AMBITIONS = ["vet","scientist","dancer","chef","writer","nurse","sailor","builder","gardener","waiter"];
const CONDITIONAL = [
  "If I study, I will learn","If I run, I will be fast","If I try, I will win","If I practise, I will play well",
  "If I read, I will be clever","If I help, I will be kind","If I train, I will be strong","If I dream, I will fly",
];
const EXPLORERS_POOL = ["bottle","paper","hotel","airport","beach","juice","salad","movie","guitar","email","photo","map"];

/* ═══ ARCIPELAGO 5 · LA VOCE (isole 41-50) — frasi di conversazione ═══ */
const GREET_SAY_G = ["Nice to meet you","How's it going?","Where are you from?","How old are you?","What is your name?","This is my friend","See you soon","Have a nice day","Welcome","Glad to meet you"];
const GREET_PHRASES_G = ["Nice to meet you","How are you?","Where are you from?","How old are you?","See you later","What is your name?"];
const OPINION_SAY_G = ["I think so","In my opinion","I agree","I don't agree","I prefer this","I'd rather not","That is true","I love it","I can't stand it","You are right"];
const OPINION_PHRASES_G = ["I think so","I agree","I don't agree","In my opinion","I prefer tea","I'd rather stay","You are right","I like it"];
const INVITE_SAY_G = ["Would you like to come?","Shall we go?","Let's play","How about pizza?","Come to my party","I'd love to","Yes, please","I'm afraid I can't","Maybe later","Sounds great"];
const INVITE_PHRASES_G = ["I'd love to","Yes, please","No, thanks","I'm afraid I can't","Good idea","Why not"];
const PLANS_SAY_G = ["Are you free today?","When shall we meet?","Let's meet at six","See you at the park","See you tomorrow","What time is it?","I am busy","I am free","That's settled","See you later"];
const PLANS_PHRASES_G = ["on Friday","at six","this afternoon","tomorrow","next week","at the park"];
const SHOP_NOUNS_G = ["money","coin","wallet","price tag","basket","trolley","card","receipt","sale","cash"];
const HELP_SAY_G = ["Excuse me","Can you help me?","How do I get there?","Where is the station?","Go straight on","Turn left","Turn right","Is it far?","It's near","Thank you for your help"];
const HELP_PHRASES_G = ["Excuse me","Can you help me?","Go straight on","Turn left","Turn right","Is it far?"];
const FEELINGS_ADV_G = ["nervous","worried","relieved","proud","confused","sleepy","sick","lonely","curious"];
const ADVICE_SAY_G = ["You should rest","You should relax","Don't worry","Cheer up","Take it easy","You can do it","If I were you","Get some sleep","Everything's fine","Good luck"];
const MANNERS_SAY_G = ["I'm sorry","It's my fault","I apologise","Don't worry about it","Thank you so much","You're welcome","Excuse me","After you","Please","No problem"];
const MANNERS_PHRASES_G = ["I'm sorry","Thank you","You're welcome","Excuse me","Don't worry","No problem"];
const RECOUNT_PHRASES_G = ["Guess what","Yesterday","first","then","after that","finally","in the end","suddenly"];
const RECOUNT_SAY_G = ["Guess what!","Yesterday I played","First we ate","Then we ran","After that we swam","We saw a dog","It was fun","Suddenly it rained","In the end","What a day"];
const VOICE_POOL_G = ["money","coin","wallet","card","basket","receipt","sale","cash","party","trolley"];
// battute non-conversazionali delle chat/storie (senza {name}) per voce reale
const CHAT5_REPLIES_G = [
  "Nice to meet you too!","Hi Mia, I'm happy to meet you.","Hello! I'm glad to meet you.","I'm great, thanks!","Not bad, and you?","Pretty good, thank you.","I'm from Italy.","I come from Rome.","I'm Italian, from Italy.","I'm nine years old.","I'm ten.","I'm eight, and you?","Nice to meet you, Leo!","Hi Leo, nice to meet you!","Hello Leo!",
  "I think they're great!","In my opinion, films are fun.","I love films!","I prefer films to books.","I'd rather read books.","I like both, actually.","I'm really into cartoons.","I love adventure films.","I prefer funny films.","I totally agree!","I see your point, but I'm not sure.","I don't really agree.","Good idea!","Yes, I'd love to!","Sure, why not!",
  "I'd love to, thanks!","Yes, that sounds great!","Sorry, I'm afraid I can't.","Sure, I'll bring one.","Why not!","Yes, let's do it!","I love pizza!","Great plan!","Yes, let's invite him!","Sure, the more the better!","Four is perfect!","That works for me.","Sounds good!","Of course!","Yes, I'd love to help.","No problem!",
  "Yes, I'm free!","Sorry, I'm busy on Friday.","Let me check... yes!","Yes, the park is perfect.","Sure, let's meet there.","Let's meet at four.","How about three o'clock?","Any time is fine.","Let's play football!","How about a bike ride?","We could have a picnic.","Yes, please!","Good idea, thanks!","Sure, I'll bring drinks.","Can't wait!",
  "Yes, please.","I'm just looking, thanks.","Hello! Yes, I'd like a jacket.","How much is it?","Can I try it on?","I like it! What's the price?","Sure, thank you.","Yes, I'll take it!","Do you have a bigger size?","Yes, please, I love it.","Here you are.","Here's the money.","Can I pay with a card?","Thank you so much!","Thanks a lot!","Great, thank you!",
  "Excuse me, could you help me?","Thank you, yes.","How do I get to the station?","I'm looking for the park.","Where is the library, please?","Straight on, then left. Got it!","Thank you!","Is it far?","Great, thank you!","Perfect!","That's close, thanks.","No, thank you.","That's all, thanks!","No, you've helped a lot.",
  "What's the matter?","Don't worry!","Oh no, why are you worried?","You should study tonight.","If I were you, I'd read your notes.","You'd better start now.","You should get some rest.","Why don't you take a break?","You'd better sleep early.","Yes, don't worry!","Everything will be fine.","You can do it!","I'm glad!","That's great!","You'll be great tomorrow.",
  "Don't worry about it!","It doesn't matter.","It's okay, really.","It's fine, don't worry.","Accidents happen!","No problem at all.","You're welcome!","Anytime!","That's very kind!","You don't have to, but thanks!","That's polite of you!","How kind, thanks!",
  "Yesterday I went to the beach!","I played football with friends.","I visited my grandma.","First we had lunch.","Then we went swimming.","After that, we played games.","Then we ate ice cream.","After that, we walked home.","We took lots of photos.","Yes! My dog jumped in the water!","We all laughed a lot.","I fell over, but it was funny!","In the end, we were tired but happy.","Finally, we went home.","At last, we said goodbye.","Thanks for listening!","It was a good day!","Tell me about yours!",
  "Very well, thank you!","I think it's fun!","In my opinion, it's great.","I love it!","Yes, let's!","Yes, let's meet Saturday!","That's settled!","Yes, here you are.","You are very kind.","Yesterday I played outside.","I read a great book.","I helped my family.",
];
const CHAT5_NPC_G = [
  "Hi! I'm Mia. Nice to meet you!","How's it going today?","Cool! Where are you from?","Nice! How old are you?","Let me introduce you to my friend Leo!",
  "Me too! Do you prefer films or books?","Interesting! What's your favourite kind of film?","Nice. I think science-fiction is the best. Do you agree?","Ha! That's a good point. Shall we watch one together?",
  "Great! How about bringing a game to play?","Perfect. Why don't we make some pizza too?","Cool! Shall we invite Leo as well?","Awesome. How about starting at four o'clock?","Can you help me decorate?",
  "Great! Shall we meet at the park?","Cool. What time shall we meet?","Four o'clock works for me. What shall we do?","Perfect plan! Shall I bring the ball?",
  "Hello! Welcome to my shop. Can I help you?","Of course! How about this blue jacket?","It's twenty euros. Would you like to try it on?","It looks great on you! Do you want it?","Wonderful. That's twenty euros, please.","Thank you! Here's your change and your bag.",
  "Hi there! You look a bit lost. Can I help you?","Of course! Where do you want to go?","No problem. Go straight on, then turn left.","It's not far, just five minutes. You can't miss it!","Do you need anything else?",
  "I'm nervous because I haven't studied enough.","That's a good idea. But I'm also very tired.","You're right. Maybe I should relax a little.","Thank you. I feel much better now.",
  "Thanks. Oh no, I think I broke your pencil. It's my fault.","You're so kind. Thank you for being patient.","Let me buy you a new pencil to say sorry.","After you — please go first.",
  "Wow, sounds fun! And what happened next?","Cool! Then what did you do?","Amazing! Did anything funny happen?","Ha ha! And how did it end?","What a great story! I love hearing about your day.",
  "Wonderful! Tell me — what do you think about learning English?","I agree! Would you like to play a game with me?","Great! Shall we meet again on Saturday to play more?","Perfect. Oh, I dropped my book. Could you help me?","Thank you so much! You are very kind.","By the way — guess what! Yesterday I found a magic word. What did you do yesterday?",
];
const STORY5_G = [
  "Now, would you like to come to the word party?","Someone is lost! How do we help them?",
  "Hello! Nice to meet you!","Nice to meet you!","I'd love to, thank you!","Yes, please!","Turn left, then go straight on!","Turn right, it is not far!",
];

/* ═══ ARCIPELAGO 6 · IL MONDO REALE (isole 51-60) — arricchimento B1+ ═══ */
const SCIENCE_TOOLS_G = ["magnet","thermometer","microscope","magnifier","compass","gear","lightbulb","test tube","scale"];
const MADE_OF_G = ["fork","spoon","ring","brick","mirror","screw","rope","diamond"];
const WILD_ANIMALS_G = ["fox","bear","wolf","deer","owl","panda","tiger","penguin","koala","hedgehog"];
const HABITATS_G = ["nest","web","pond","meadow","reef","iceberg","burrow","branch"];
const BODY_ADV_G = ["heart","brain","bone","lungs","tooth","muscle","blood","tongue"];
const HEALTH_ACTIONS_G = ["stretch","jog","relax","drink milk","eat fish","wear a hat","see a doctor","stay warm","take a bath","drink tea"];
const FESTIVALS_G = ["Christmas","Halloween","Diwali","Carnival","Easter","birthday","wedding","fireworks","New Year","parade"];
const SYMBOLS_G = ["flag","ribbon","lantern","mask","crown","candle","trophy","feast","firework"];
const FUTURE_JOBS_G = ["engineer","inventor","explorer","detective","photographer","judge","reporter","coder","diver","baker"];
const FUTURE_GOALS_G = ["study","invent","build","discover","explore space","help people","lead","create","teach","save the world"];
const MONEY_NOUNS_G = ["coin","money","wallet","piggy bank","bank","card","receipt","price tag","safe","diamond"];
const MONEY_SAY_G = ["save my money","buy a gift","pay with a card","count my coins","check the price","get the receipt","open my wallet","spend a little"];
const HISTORY_NOUNS_G = ["king","queen","sword","shield","dinosaur","scroll","torch","temple","helmet"];
const PAST_HABITS_G = ["ride a horse","write letters","light a fire","hunt","sail","farm the land","wear a crown","carry water","tell stories","live in caves"];
const STORY_POOL_G = ["wizard","witch","fairy","crystal","ghost","mermaid","potion","wand","unicorn","troll"];
const DEEP_FEELINGS_G = ["jealous","grateful","hopeful","cheerful","anxious","frustrated","embarrassed","amazed","upset"];
const FRIEND_ACTIONS_G = ["share","listen","help","forgive","smile","say sorry","cheer up","be honest","wait","hug"];
const COMFORT_SAY_G = ["talk to a friend","take a deep breath","ask for help","be kind","stay calm","try again","say sorry","smile"];
const FINAL_REVIEW_G = ["magnet","microscope","fox","panda","heart","brain","lantern","crown","coin","ghost","wizard","compass"];
const STORY6_G = [
  // Festa nel Mondo
  "At Christmas, presents are given!","At Halloween, costumes are worn!","At Carnival, masks are worn!","Lanterns are lit everywhere!","Fireworks light the sky!","We dance together!","We eat a big feast!","We celebrate all night!",
  "Wonderful! Now we are in India for Diwali. What do people light?","Amazing! Every festival ends with a party. What do we do?",
  // La Grande Avventura
  "While you were walking in a forest, you heard a noise!","While you were climbing a mountain, you heard a noise!","While you were near a castle, you heard a noise!","It was a wizard! He said he was lost.","It was a fairy! She said she needed help.","It was a dragon! It said it was hungry.","You found a magic wand!","You found the treasure!","You found a golden key!","The story ended happily!","You saved the day and won!",
  "Suddenly you met someone! Who was it?","You had never seen magic before! What did you find next?",
  // Maestro delle Parole
  "Yes! A microscope is used for science!","Hmm, try science! A microscope is used for science.","Right! People used to ride horses!","Not then! People used to ride horses.","Yes! If we help, the planet will be happy!","Exactly! The planet will be clean and green!","You will be a great engineer!","You will be a brave explorer!","You will be a wonderful writer!",
  "Good! Long ago, what did people ride?","Wonderful! If we recycle and save energy, what will happen to our planet?","Last question! When you grow up, what will you be?",
];

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_");

function buildManifest() {
  const M = [];
  const add = (file, text) => M.push({ file: `${file}.mp3`, text });
  // addN = come add, ma marca la clip come "nuova" (isole 41-60): serve a
  // generare SOLO le nuove senza rifare le 671 già esistenti. Se una frase
  // nuova coincide con una vecchia, il dedup tiene quella vecchia (già incisa).
  const addN = (file, text) => M.push({ file: `${file}.mp3`, text, isNew: true });

  /* system */
  add("sys_welcome", "Welcome to the Magic Kingdom, Silvana!");
  PRAISE.forEach((p, i) => add(`praise_${i + 1}`, p));
  add("sys_howmany", "How many stars?");
  add("sys_tryagain", "Try again! How many stars?");
  add("sys_pairs_intro", "Find the pairs! Match the word and the picture.");
  add("sys_pairs_done", "You found all the pairs!");

  /* single words */
  COLORS.forEach((w) => add(`word_${slug(w)}`, w));
  ANIMALS.forEach((w) => add(`word_${slug(w)}`, w));
  FAMILY.forEach((w) => add(`word_${slug(w)}`, w));
  BODY.forEach((w) => add(`word_${slug(w)}`, w));
  FOOD.forEach((w) => add(`word_${slug(w)}`, w));
  HOUSE.forEach((w) => { if (!M.some((m) => m.file === `word_${slug(w)}.mp3`)) add(`word_${slug(w)}`, w); });
  SCHOOL.forEach((w) => { if (!M.some((m) => m.file === `word_${slug(w)}.mp3`)) add(`word_${slug(w)}`, w); });
  PREPS.forEach((w) => add(`word_${slug(w)}`, w));
  for (let n = 1; n <= 20; n++) add(`word_num_${n}`, NUMBER_WORDS[n]);

  /* prompts — Isola 1 */
  COLORS.forEach((c) => add(`prompt_gem_${slug(c)}`, `Find the ${c} gem!`));
  for (let n = 1; n <= 20; n++) add(`yes_${n}`, `Yes! ${NUMBER_WORDS[n]} stars.`);

  /* prompts — Isola 2 */
  ANIMALS.forEach((a) => add(`prompt_animal_${slug(a)}`, `Find the ${a}!`));
  const usable = COLORS.filter((c) => !["white","black","brown"].includes(c));
  ANIMALS.slice(0, 10).forEach((a, i) => {
    [usable[i % usable.length], usable[(i + 3) % usable.length]].forEach((c) => {
      add(`prompt_combo_${slug(c)}_${slug(a)}`, `Find the ${c} ${a}!`);
      add(`name_combo_${slug(c)}_${slug(a)}`, `the ${c} ${a}`);
    });
  });

  /* prompts — Isola 3 */
  FAMILY.forEach((f) => add(`prompt_family_${slug(f)}`, `Find the ${f}!`));
  BODY.forEach((b) => add(`prompt_body_${slug(b)}`, `Touch the ${b}!`));

  /* prompts — Isola 4 */
  FOOD.forEach((f) => add(`prompt_food_${slug(f)}`, `I like ${f}! Give me the ${f}, please!`));

  /* Isola 5 · L'Orto Reale — verdure (NUOVE, da incidere) */
  VEGETABLES.forEach((v) => { if (!M.some((m) => m.file === `word_${slug(v)}.mp3`)) addN(`word_${slug(v)}`, v); });
  VEGETABLES.forEach((v) => addN(`prompt_veg_${slug(v)}`, `Find the ${v}!`));

  /* prompts — Isola 5 */
  HOUSE.forEach((h) => add(`prompt_house_${slug(h)}`, `Find the ${h}!`));
  PREP_SUBJECTS.forEach((s) =>
    PREP_OBJECTS.forEach((o) =>
      PREPS.forEach((p) => add(`prompt_prep_${slug(s)}_${slug(p)}_${slug(o)}`, `The ${s} is ${p} the ${o}!`))
    )
  );
  PREPS.forEach((p) => PREP_OBJECTS.forEach((o) => add(`name_prep_${slug(p)}_${slug(o)}`, `${p} the ${o}`)));

  /* prompts — Isola 6 */
  SCHOOL.forEach((s) => add(`prompt_school_${slug(s)}`, `Put the ${s} in the bag!`));
  SCHOOL.slice(0, 6).forEach((o, i) => {
    [usable[i % usable.length], usable[(i + 3) % usable.length]].forEach((c) => {
      add(`prompt_scombo_${slug(c)}_${slug(o)}`, `Find the ${c} ${o}!`);
      add(`name_scombo_${slug(c)}_${slug(o)}`, `the ${c} ${o}`);
    });
  });

  /* ─── Isola 7 · Ballo (verbi) ─── */
  VERBS.forEach((v) => {
    add(`word_${slug(v)}`, v);
    add(`prompt_simon_${slug(v)}`, `Simon says: ${v}!`);
    add(`say_ican_${slug(v)}`, `I can ${v}!`);
  });

  /* ─── Isola 8 · Giardino (meteo, natura) ─── */
  WEATHER.forEach((w) => {
    add(`word_${slug(w)}`, w);
    add(`prompt_weather_${slug(w)}`, `It's ${w}!`);
    add(`prompt_wasweather_${slug(w)}`, `It was ${w}!`); // Isola 16
  });
  NATURE.forEach((n) => {
    add(`word_${slug(n)}`, n);
    add(`prompt_nature_${slug(n)}`, `Find the ${n}!`);
  });

  /* ─── Isola 9 · Guardaroba (vestiti, colore+capo) ─── */
  CLOTHES.forEach((c) => {
    add(`word_${slug(c)}`, c);
    add(`prompt_clothes_${slug(c)}`, `Put on the ${c}!`);
  });
  CLOTHES.slice(0, 8).forEach((o, i) => {
    [usable[i % usable.length], usable[(i + 2) % usable.length]].forEach((c) => {
      add(`prompt_fashion_${slug(c)}_${slug(o)}`, `She's wearing a ${c} ${o}!`);
      add(`name_fashion_${slug(c)}_${slug(o)}`, `the ${c} ${o}`);
    });
  });

  /* ─── Isola 10 · Drago (ripasso + storia) ─── */
  const bossWords = [
    ...ANIMALS.slice(0, 5), ...FOOD.slice(0, 4), ...HOUSE.slice(0, 3),
    ...SCHOOL.slice(0, 3), ...CLOTHES.slice(0, 4), ...NATURE.slice(0, 3), ...VERBS.slice(0, 4),
  ];
  bossWords.forEach((w) => add(`prompt_find_${slug(w)}`, `Find the ${w}!`));
  [
    "Hello! I am the dragon. I am very hungry! What can I eat?",
    "Thank you! Now let's fly. How is the weather today?",
    "Who comes with us on the adventure?",
    "We found the treasure! Which gem do you want?",
  ].forEach((t, i) => add(`story_dragon_n${i + 1}`, t));
  [
    "Yum! I like apples!", "Yum! I like pizza!", "Yum! I like cake!",
    "It's sunny! Let's fly high!", "It's rainy! Take an umbrella!",
    "The unicorn! Hello unicorn!", "The lion! Roar!", "The cat! Meow!",
    "The red gem! Beautiful!", "The blue gem! Beautiful!", "The green gem! Beautiful!",
  ].forEach((t, i) => add(`story_dragon_c${i + 1}`, t));

  /* ─── Isola 11 · Villaggio (mestieri, luoghi) ─── */
  JOBS.forEach((j) => { add(`word_${slug(j)}`, j); add(`prompt_job_${slug(j)}`, `He's a ${j}!`); });
  PLACES.forEach((p) => { add(`word_${slug(p)}`, p); add(`prompt_place_${slug(p)}`, `Let's go to the ${p}!`); });

  /* ─── Isola 12 · Mercato ─── */
  MARKET.forEach((m) => { add(`word_${slug(m)}`, m); add(`prompt_market_${slug(m)}`, `Can I have some ${m}, please?`); });

  /* ─── Isola 13 · Tempo (giorni, routine) ─── */
  DAYS.forEach((d) => { add(`word_${slug(d)}`, d); add(`prompt_day_${slug(d)}`, `Today is ${d}!`); });
  ROUTINE.forEach((r) => { add(`word_${slug(r)}`, r); add(`prompt_routine_${slug(r)}`, `Every day I ${r}.`); });

  /* ─── Isola 14 · Confronti ─── */
  add("sys_bigger", "Which one is bigger?");
  add("sys_smaller", "Which one is smaller?");

  /* ─── Isola 15 · Storie (passato) ─── */
  PAST_VERBS.forEach((v) => { add(`word_${slug(v)}`, v); add(`prompt_past_${slug(v)}`, `Yesterday I ${v}.`); });

  /* ─── Isola 16 · Stagioni ─── */
  SEASONS.forEach((s) => { add(`word_${slug(s)}`, s); add(`prompt_season_${slug(s)}`, `It's ${s}!`); });

  /* ─── Isola 17 · Ospedale (salute) ─── */
  HEALTH.forEach((h) => { add(`word_${slug(h)}`, h); add(`prompt_health_${slug(h)}`, `I have a ${h}!`); });

  /* ─── Isola 18 · Hobby (sport) ─── */
  SPORTS.forEach((s) => { add(`word_${slug(s)}`, s); add(`prompt_sport_${slug(s)}`, `I like ${s}!`); });

  /* ─── Isola 19 · Porto (trasporti, direzioni) ─── */
  TRANSPORT.forEach((t) => { add(`word_${slug(t)}`, t); add(`prompt_transport_${slug(t)}`, `Let's go by ${t}!`); });
  DIRECTIONS.forEach((d) => { add(`word_${slug(d)}`, d); add(`prompt_direction_${slug(d)}`, `Go ${d}!`); });

  /* ─── Isola 20 · Strega (ripasso Movers + storia) ─── */
  const moversWords = [
    ...JOBS.slice(0, 4), ...PLACES.slice(0, 3), ...SPORTS.slice(0, 4),
    ...TRANSPORT.slice(0, 4), ...SEASONS, ...HEALTH.slice(0, 3),
  ];
  moversWords.forEach((w) => add(`prompt_find_${slug(w)}`, `Find the ${w}!`));
  [
    "I am the Witch of the Past. Yesterday I lost my magic! Where did you go yesterday?",
    "And what did you do there?",
    "What was the weather like?",
  ].forEach((t, i) => add(`story_witch_n${i + 1}`, t));
  [
    "You went to school!", "You went to the beach!", "You went to the park!",
    "You played! Great!", "You swam! Great!", "You sang! Great!",
    "It was sunny!", "It was rainy!",
  ].forEach((t, i) => add(`story_witch_c${i + 1}`, t));

  /* ═══════════ ARCIPELAGO 3 · FLYERS (isole 21-30) — GIÀ INCISE ═══════════ */

  /* ─── Isola 21 · Mappamondo (paesi, paesaggi) ─── */
  WORLD.forEach((c) => { add(`word_country_${slug(c)}`, c); add(`prompt_country_${slug(c)}`, `Let's fly to ${c}!`); });
  LANDSCAPE.forEach((l) => { add(`word_${slug(l)}`, l); add(`prompt_land_${slug(l)}`, `Look at the ${l}!`); });

  /* ─── Isola 22 · Emozioni ─── */
  FEELINGS.forEach((f) => { add(`word_${slug(f)}`, f); add(`prompt_feel_${slug(f)}`, `I feel ${f}!`); add(`say_feel_${slug(f)}`, `I feel ${f}.`); });

  /* ─── Isola 23 · Materiali ─── */
  MATERIALS.forEach((m) => { add(`word_${slug(m)}`, m); add(`prompt_material_${slug(m)}`, `It's made of ${m}!`); add(`say_material_${slug(m)}`, `It's made of ${m}.`); });

  /* ─── Isola 24 · Tecnologia ─── */
  TECH.forEach((t) => { add(`word_${slug(t)}`, t); add(`prompt_tech_${slug(t)}`, `Find the ${t}!`); add(`say_tech_${slug(t)}`, `I can use the ${t}.`); });

  /* ─── Isola 25 · Mare ─── */
  SEA.forEach((s) => { add(`word_${slug(s)}`, s); add(`prompt_sea_${slug(s)}`, `Find the ${s}!`); add(`say_sea_${slug(s)}`, `I can see a ${s}.`); });

  /* ─── Isola 26 · Spazio (il conteggio riusa "How many stars?" già inciso) ─── */
  SPACE.forEach((s) => { add(`word_${slug(s)}`, s); add(`prompt_space_${slug(s)}`, `Find the ${s}!`); });

  /* ─── Isola 27 · Futuro (I will…) ─── */
  FUTURE_ACTIONS.forEach((v) => { add(`word_${slug(v)}`, v); add(`prompt_future_${slug(v)}`, `Tomorrow I will ${v}!`); add(`say_future_${slug(v)}`, `Tomorrow I will ${v}.`); });

  /* ─── Isola 28 · Present perfect (I have seen…) ─── */
  SEEN_THINGS.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_seen_${slug(w)}`, `I have seen a ${w}!`); add(`say_seen_${slug(w)}`, `I have seen a ${w}.`); });

  /* ─── Isola 29 · Opposti (i confronti riusano "Which one is bigger/smaller?") ─── */
  ADJECTIVES.forEach((a) => { add(`word_${slug(a)}`, a); add(`prompt_adj_${slug(a)}`, `It is ${a}!`); });

  /* ─── Isola 30 · Gran Mago dei Cieli (ripasso Flyers + storia) ─── */
  FLYERS_POOL.forEach((w) => add(`prompt_find_${slug(w)}`, `Find the ${w}!`));
  [
    "Welcome, brave flyer! I am the Sky Wizard. Where will you fly tomorrow?",
    "Amazing! And what have you seen on your journey?",
    "Wonderful! How do you feel now?",
  ].forEach((t, i) => add(`story_wizard_n${i + 1}`, t));
  [
    "You will fly over the sea!", "You will fly over the mountain!", "You will fly over the volcano!",
    "You have seen a dolphin!", "You have seen a dragon!", "You have seen a star!",
    "You feel happy!", "You feel excited!",
  ].forEach((t, i) => add(`story_wizard_c${i + 1}`, t));

  /* ═══════════ ARCIPELAGO 4 · EXPLORERS (isole 31-40) — GIÀ INCISE ═══════════ */
  // 31 Ambiente e riciclo (should)
  ENVIRONMENT.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_recycle_${slug(w)}`, `We should recycle the ${w}!`); });
  // 32 Materie di scuola
  SCHOOL_SUBJECTS.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_subject_${slug(w)}`, `My favourite subject is ${w}.`); });
  // 33 Abitudini sane (should)
  HABITS.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_habit_${slug(w)}`, `You should ${w}!`); add(`say_habit_${slug(w)}`, `You should ${w}.`); });
  // 34 Viaggi e vacanze
  TRAVEL_HOLIDAY.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_travel_${slug(w)}`, `Find the ${w}!`); });
  // 35 Ristorante (would like)
  RESTAURANT_FOOD.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_order_${slug(w)}`, `I would like some ${w}.`); add(`say_order_${slug(w)}`, `I would like some ${w}, please.`); });
  // 36 Spettacolo e musica
  ENTERTAINMENT.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_show_${slug(w)}`, `Find the ${w}!`); });
  // 37 Comunicare e internet
  DIGITAL.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_digital_${slug(w)}`, `Find the ${w}!`); });
  // 38 Descrivere le persone (be + aggettivo)
  PERSONALITY.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_person_${slug(w)}`, `She is ${w}.`); add(`say_person_${slug(w)}`, `He is ${w}.`); });
  // 39 Ambizioni + first conditional
  AMBITIONS.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_ambition_${slug(w)}`, `I want to be a ${w}!`); });
  CONDITIONAL.forEach((s, i) => add(`say_cond_${i + 1}`, `${s}.`));
  // 40 BOSS · ripasso Explorers
  EXPLORERS_POOL.forEach((w) => add(`prompt_find_${slug(w)}`, `Find the ${w}!`));
  // Storie 38-40 (i nodi con {name} restano voce sintetica, come per il Gran Mago)
  [
    "Welcome to the portrait gallery! Look at this girl. What is she like?",
    "Wonderful! And this boy — what is he like?",
    "Great! And you — what are you like?",
    "Welcome, dreamer! If you work hard, what will you be?",
    "Wonderful! And if you try your best, what will you win?",
    "Amazing! How do you feel about your dream?",
    "Wonderful! And what have you seen on the way?",
    "Amazing! What will you explore next?",
  ].forEach((t, i) => add(`story_exp_n${i + 1}`, t));
  [
    "She is friendly!", "She is clever!", "She is funny!", "He is brave!", "He is kind!", "He is quiet!",
    "You are friendly!", "You are clever!",
    "You will be a vet!", "You will be a dancer!", "You will be a writer!",
    "You will win a cup!", "You will win a medal!", "You will win a prize!",
    "You feel happy!", "You feel excited!",
    "You have been to the sea!", "You have been to the mountains!", "You have been to the city!",
    "You have seen a dolphin!", "You have seen a castle!", "You have seen a rainbow!",
    "You will explore the stars!", "You will explore the ocean!",
  ].forEach((t, i) => add(`story_exp_c${i + 1}`, t));

  /* ═══════════ ARCIPELAGO 5 · LA VOCE (isole 41-50) — GIÀ INCISE ═══════════ */
  // 41 Presentarsi (chat + ripeti il saluto + ascolta la frase)
  GREET_SAY_G.forEach((w) => add(`say_greet_${slug(w)}`, w));
  GREET_PHRASES_G.forEach((w) => { add(`phr_greet_${slug(w)}`, w); add(`prompt_greet_${slug(w)}`, `Someone says: "${w}"`); });
  // 42 Opinioni
  OPINION_SAY_G.forEach((w) => add(`say_opinion_${slug(w)}`, w));
  OPINION_PHRASES_G.forEach((w) => { add(`phr_opinion_${slug(w)}`, w); add(`prompt_opinion_${slug(w)}`, `Choose: "${w}"`); });
  // 43 Inviti
  INVITE_SAY_G.forEach((w) => add(`say_invite_${slug(w)}`, w));
  INVITE_PHRASES_G.forEach((w) => { add(`phr_invite_${slug(w)}`, w); add(`prompt_invite_${slug(w)}`, `Reply: "${w}"`); });
  // 44 Piani (il prompt è solo la frase)
  PLANS_SAY_G.forEach((w) => add(`say_plans_${slug(w)}`, w));
  PLANS_PHRASES_G.forEach((w) => add(`phr_plans_${slug(w)}`, w));
  // 45 Comprare (nomi + prezzo)
  SHOP_NOUNS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_shop_${slug(w)}`, `Find the ${w}!`); });
  // 46 Chiedere aiuto
  HELP_SAY_G.forEach((w) => add(`say_help_${slug(w)}`, w));
  HELP_PHRASES_G.forEach((w) => add(`phr_help_${slug(w)}`, w));
  // 47 Sentimenti e consigli
  FEELINGS_ADV_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_feeladv_${slug(w)}`, `I feel ${w}.`); });
  ADVICE_SAY_G.forEach((w) => add(`say_advice_${slug(w)}`, w));
  // 48 Scuse e grazie
  MANNERS_SAY_G.forEach((w) => add(`say_manners_${slug(w)}`, w));
  MANNERS_PHRASES_G.forEach((w) => add(`phr_manners_${slug(w)}`, w));
  // 49 Raccontare
  RECOUNT_PHRASES_G.forEach((w) => add(`phr_recount_${slug(w)}`, w));
  RECOUNT_SAY_G.forEach((w) => add(`say_recount_${slug(w)}`, w));
  // 50 BOSS La Voce (esame + memory)
  VOICE_POOL_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_find_${slug(w)}`, `Find the ${w}!`); });
  // Battute chat + storia dell'Arcipelago 5 senza {name} (le battute con {name} restano voce sintetica)
  CHAT5_REPLIES_G.forEach((t, i) => add(`chat5_r${i + 1}`, t));
  CHAT5_NPC_G.forEach((t, i) => add(`chat5_n${i + 1}`, t));
  STORY5_G.forEach((t, i) => add(`story5_${i + 1}`, t));

  /* ═══════════ ARCIPELAGO 6 · IL MONDO REALE (isole 51-60) — GIÀ INCISE ═══════════ */
  // 51 Scienza (passivo/funzione)
  SCIENCE_TOOLS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_science_${slug(w)}`, `It is used for science. Find the ${w}!`); add(`say_science_${slug(w)}`, `A ${w} is used in science.`); });
  MADE_OF_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_madeof_${slug(w)}`, `It is made of something. Find the ${w}!`); });
  // 52 Natura e habitat
  WILD_ANIMALS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_wild_${slug(w)}`, `Look in the wild! Find the ${w}!`); });
  HABITATS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_habitat_${slug(w)}`, `Animals live here. Find the ${w}!`); });
  // 53 Corpo e salute (should)
  BODY_ADV_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_body_${slug(w)}`, `It is part of your body. Find the ${w}!`); });
  HEALTH_ACTIONS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_health_${slug(w)}`, `You should ${w}!`); add(`say_health_${slug(w)}`, `You should ${w} to stay healthy.`); });
  // 54 Culture e feste
  FESTIVALS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_festival_${slug(w)}`, `People celebrate. Find the ${w}!`); });
  SYMBOLS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_symbol_${slug(w)}`, `It's a tradition. Find the ${w}!`); });
  // 55 Lavori e futuro
  FUTURE_JOBS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_job_${slug(w)}`, `When I grow up, I want this job: ${w}!`); add(`say_job_${slug(w)}`, `When I grow up, I want this job: ${w}.`); });
  FUTURE_GOALS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_goal_${slug(w)}`, `One day I will ${w}!`); });
  // 56 Soldi e risparmio
  MONEY_NOUNS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_money_${slug(w)}`, `It's about money. Find the ${w}!`); });
  MONEY_SAY_G.forEach((w) => add(`say_money_${slug(w)}`, `At the shop I will ${w}.`));
  // 57 Storia / used to
  HISTORY_NOUNS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_history_${slug(w)}`, `Long ago there was a ${w}. Find it!`); });
  PAST_HABITS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_usedto_${slug(w)}`, `People used to ${w}!`); add(`say_usedto_${slug(w)}`, `Long ago, people used to ${w}.`); });
  // 58 Libri e racconti
  STORY_POOL_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_tale_${slug(w)}`, `In the story there is a ${w}. Find it!`); });
  // 59 Amicizia e sentimenti
  DEEP_FEELINGS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_deepfeel_${slug(w)}`, `How do you feel? Find ${w}!`); });
  FRIEND_ACTIONS_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_friend_${slug(w)}`, `A good friend should ${w}!`); });
  COMFORT_SAY_G.forEach((w) => add(`say_comfort_${slug(w)}`, `If you feel sad, you should ${w}.`));
  // 60 GRAN BOSS (sfida + esame)
  FINAL_REVIEW_G.forEach((w) => { add(`word_${slug(w)}`, w); add(`prompt_find_${slug(w)}`, `Find the ${w}!`); });
  // Battute delle storie dell'Arcipelago 6 senza {name}
  STORY6_G.forEach((t, i) => add(`story6_${i + 1}`, t));

  /* dedup per TESTO normalizzato: ogni frase distinta = una sola clip
     (stessa normalizzazione del gioco → nessuno spreco di crediti) */
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const seen = new Set();
  return M.filter((m) => {
    const k = norm(m.text);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* ─── Minimal ZIP writer (store, no compression — MP3s don't compress) ─── */
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();
function crc32(u8) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < u8.length; i++) c = CRC_TABLE[(c ^ u8[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function makeZip(files) {
  const enc = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;
  for (const f of files) {
    const nameB = enc.encode(f.name);
    const crc = crc32(f.data);
    const size = f.data.length;
    const lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
    lh.setUint32(14, crc, true); lh.setUint32(18, size, true); lh.setUint32(22, size, true);
    lh.setUint16(26, nameB.length, true);
    parts.push(new Uint8Array(lh.buffer), nameB, f.data);
    const ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
    ch.setUint32(16, crc, true); ch.setUint32(20, size, true); ch.setUint32(24, size, true);
    ch.setUint16(28, nameB.length, true); ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), nameB);
    offset += 30 + nameB.length + size;
  }
  const centralSize = central.reduce((s, c) => s + c.length, 0);
  const eocd = new DataView(new ArrayBuffer(22));
  eocd.setUint32(0, 0x06054b50, true);
  eocd.setUint16(8, files.length, true); eocd.setUint16(10, files.length, true);
  eocd.setUint32(12, centralSize, true); eocd.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(eocd.buffer)], { type: "application/zip" });
}

/* ─── ElevenLabs API ─── */
async function ttsCall({ apiKey, voiceId, model, text, settings }) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({
        model_id: model,
        text,
        voice_settings: {
          stability: settings.stability,
          similarity_boost: settings.similarity,
          style: settings.style,
          use_speaker_boost: true,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 140)}`);
  return new Uint8Array(await res.arrayBuffer());
}

export default function App() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [voiceId, setVoiceId] = useState("");
  const [voices, setVoices] = useState([]);
  const [model, setModel] = useState("eleven_turbo_v2_5");
  const [settings, setSettings] = useState({ stability: 0.55, similarity: 0.8, style: 0.3 });
  const [status, setStatus] = useState("idle"); // idle | testing | running | done
  const [doneCount, setDoneCount] = useState(0);
  const [errors, setErrors] = useState([]);
  const [log, setLog] = useState("");
  const [zipUrl, setZipUrl] = useState(null);
  const [genAll, setGenAll] = useState(false); // false = solo isole 41-60 (nuove)
  const resultsRef = useRef({});
  const abortRef = useRef(false);
  const audioRef = useRef(null);

  const manifest = useMemo(buildManifest, []);
  const newCount = useMemo(() => manifest.filter((m) => m.isNew).length, [manifest]);
  // Coda di generazione: solo le clip nuove (isole 41-60), oppure tutte se genAll.
  const genQueue = useMemo(() => manifest.filter((m) => genAll || m.isNew), [manifest, genAll]);
  const totalChars = useMemo(() => genQueue.reduce((s, m) => s + m.text.length, 0), [genQueue]);

  const loadVoices = async () => {
    try {
      const res = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": apiKey } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setVoices(data.voices || []);
      setLog(`✅ ${data.voices?.length || 0} voci caricate dal tuo account`);
    } catch (e) {
      setLog(`❌ Errore nel caricare le voci: ${e.message} — controlla la API key`);
    }
  };

  const playTest = async () => {
    if (!apiKey || !voiceId) { setLog("⚠️ Inserisci API key e scegli una voce"); return; }
    setStatus("testing");
    setLog("🎧 Genero una frase di prova…");
    try {
      const data = await ttsCall({ apiKey, voiceId, model, settings, text: "Welcome to the Magic Kingdom, Silvana! Find the red gem!" });
      const url = URL.createObjectURL(new Blob([data], { type: "audio/mpeg" }));
      if (audioRef.current) { audioRef.current.src = url; audioRef.current.play(); }
      setLog("✅ Prova generata: ascoltala. Se la voce ti piace, lancia la generazione completa.");
    } catch (e) {
      setLog(`❌ Test fallito: ${e.message}`);
    }
    setStatus("idle");
  };

  const runAll = async () => {
    if (!apiKey || !voiceId) { setLog("⚠️ Inserisci API key e scegli una voce"); return; }
    setStatus("running"); setErrors([]); setZipUrl(null); abortRef.current = false;
    const todo = genQueue.filter((m) => !resultsRef.current[m.file]);
    setDoneCount(genQueue.length - todo.length);
    let idx = 0;
    const failed = [];
    const WORKERS = 3;
    const worker = async () => {
      while (!abortRef.current) {
        const i = idx++;
        if (i >= todo.length) return;
        const item = todo[i];
        try {
          const data = await ttsCall({ apiKey, voiceId, model, settings, text: item.text });
          resultsRef.current[item.file] = data;
        } catch (e1) {
          await new Promise((r) => setTimeout(r, 1500)); // one retry
          try {
            const data = await ttsCall({ apiKey, voiceId, model, settings, text: item.text });
            resultsRef.current[item.file] = data;
          } catch (e2) {
            failed.push({ file: item.file, err: e2.message });
          }
        }
        setDoneCount((d) => d + 1);
      }
    };
    await Promise.all(Array.from({ length: WORKERS }, worker));
    setErrors(failed);
    if (!abortRef.current && failed.length === 0) {
      buildZip();
      setStatus("done");
      setLog("🎉 Tutti gli audio generati! Scarica lo ZIP qui sotto.");
    } else if (failed.length > 0) {
      setStatus("idle");
      setLog(`⚠️ ${failed.length} clip fallite — premi di nuovo Genera: riprende solo dalle mancanti.`);
    } else {
      setStatus("idle");
      setLog("⏸️ Fermato. Premi Genera per riprendere da dove eri.");
    }
  };

  const buildZip = () => {
    const files = manifest
      .filter((m) => resultsRef.current[m.file])
      .map((m) => ({ name: `audio/${m.file}`, data: resultsRef.current[m.file] }));
    files.push({
      name: "audio/manifest.json", // dentro audio/: così l'intera cartella va in public/
      // manifest COMPLETO (vecchie + nuove), senza il flag interno isNew
      data: new TextEncoder().encode(JSON.stringify(manifest.map(({ isNew, ...r }) => r), null, 2)),
    });
    const blob = makeZip(files);
    setZipUrl(URL.createObjectURL(blob));
  };

  const pct = genQueue.length ? Math.round((doneCount / genQueue.length) * 100) : 0;
  const generated = Object.keys(resultsRef.current).length;

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 12, border: "2px solid #ffffff26", background: "#ffffff10", color: "#F6F1FF", fontSize: 15, outline: "none" };
  const btnStyle = (primary) => ({ padding: "12px 22px", borderRadius: 999, border: "none", fontWeight: 800, fontSize: 15, cursor: "pointer", color: primary ? "#2D1B4E" : "#E7DBFF", background: primary ? "linear-gradient(180deg,#F8D978,#E0AC3C)" : "#ffffff18", boxShadow: primary ? "0 4px 0 #B8892E" : "none", border: primary ? "none" : "2px solid #ffffff28" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#1E1440,#2D1B4E 55%,#45307A)", fontFamily: "'Nunito', system-ui, sans-serif", display: "flex", justifyContent: "center", padding: "28px 16px" }}>
      <div style={{ width: "100%", maxWidth: 560, display: "flex", flexDirection: "column", gap: 18 }}>
        <h1 style={{ color: "#F6F1FF", fontSize: 26, fontWeight: 800, margin: 0, textAlign: "center" }}>
          🎙️ Isola Magica — <span style={{ color: "#F5C64F" }}>Generatore Audio</span>
        </h1>
        <p style={{ color: "#CDBBF2", fontSize: 14, textAlign: "center", margin: 0 }}>
          {manifest.length} clip totali · {genAll ? `rigenero tutte le ${genQueue.length}` : `${newCount} nuove (Isola 5 · L'Orto Reale) da incidere`} · {totalChars.toLocaleString("it-IT")} caratteri · la API key resta solo in memoria
        </p>

        {/* credentials */}
        <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <label style={{ color: "#9F8CC9", fontSize: 13, fontWeight: 700 }}>API KEY ELEVENLABS</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input type={showKey ? "text" : "password"} value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk_…" style={inputStyle} autoComplete="off" />
            <button onClick={() => setShowKey(!showKey)} style={btnStyle(false)}>👁</button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={loadVoices} style={btnStyle(false)} disabled={!apiKey}>Carica le tue voci</button>
            {voices.length > 0 && (
              <select value={voiceId} onChange={(e) => setVoiceId(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
                <option value="">— scegli la voce —</option>
                {voices.map((v) => (
                  <option key={v.voice_id} value={v.voice_id} style={{ color: "#222" }}>
                    {v.name} {v.labels?.gender ? `(${v.labels.gender})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
          {voices.length === 0 && (
            <input value={voiceId} onChange={(e) => setVoiceId(e.target.value)} placeholder="…oppure incolla direttamente un Voice ID" style={inputStyle} />
          )}
        </div>

        {/* settings */}
        <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: "#9F8CC9", fontSize: 13, fontWeight: 700 }}>IMPOSTAZIONI VOCE (preset "gioco per bambini")</label>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ color: "#CDBBF2", fontSize: 14, width: 110 }}>Modello</span>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              <option value="eleven_turbo_v2_5" style={{ color: "#222" }}>Turbo v2.5 (veloce, metà crediti)</option>
              <option value="eleven_multilingual_v2" style={{ color: "#222" }}>Multilingual v2 (massima qualità)</option>
            </select>
          </div>
          {[["stability", "Stability"], ["similarity", "Similarity"], ["style", "Style"]].map(([k, label]) => (
            <div key={k} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: "#CDBBF2", fontSize: 14, width: 110 }}>{label}</span>
              <input type="range" min="0" max="1" step="0.05" value={settings[k]} onChange={(e) => setSettings({ ...settings, [k]: parseFloat(e.target.value) })} style={{ flex: 1 }} />
              <span style={{ color: "#F0D98C", fontWeight: 700, width: 44, textAlign: "right" }}>{settings[k].toFixed(2)}</span>
            </div>
          ))}
          <p style={{ color: "#7A68A8", fontSize: 12, margin: 0 }}>
            Consiglio: voce femminile calda e allegra · Stability 0.55 (vivace ma stabile) · Style 0.30 (espressiva, da fiaba).
          </p>
        </div>

        {/* scope della generazione */}
        <label style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", color: "#CDBBF2", fontSize: 14, cursor: "pointer" }}>
          <input type="checkbox" checked={genAll} onChange={(e) => setGenAll(e.target.checked)} disabled={status === "running"} style={{ width: 18, height: 18 }} />
          Rigenera <b>anche</b> le isole 1-60 (di default incide solo le <b>{newCount} nuove</b>)
        </label>

        {/* actions */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={playTest} style={btnStyle(false)} disabled={status === "running"}>🎧 Prova la voce</button>
          {status !== "running" ? (
            <button onClick={runAll} style={btnStyle(true)}>
              ⚡ Genera {generated > 0 ? `le ${genQueue.length - generated} mancanti` : `le ${genQueue.length} clip`}
            </button>
          ) : (
            <button onClick={() => { abortRef.current = true; }} style={btnStyle(false)}>⏸️ Ferma</button>
          )}
        </div>
        <audio ref={audioRef} controls style={{ width: "100%", display: status === "idle" && !log.startsWith("✅ Prova") ? "none" : "block" }} />

        {/* progress */}
        {(status === "running" || generated > 0) && (
          <div style={{ background: "#ffffff0d", border: "2px solid #ffffff1e", borderRadius: 20, padding: 18 }}>
            <div style={{ height: 16, borderRadius: 999, background: "#ffffff14", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#F5C64F,#F27EB6)", transition: "width .3s" }} />
            </div>
            <p style={{ color: "#CDBBF2", fontSize: 14, margin: "10px 0 0", textAlign: "center" }}>
              {doneCount}/{genQueue.length} clip ({pct}%)
            </p>
          </div>
        )}

        {log && <p style={{ color: "#E7DBFF", fontSize: 14, textAlign: "center", margin: 0 }}>{log}</p>}

        {errors.length > 0 && (
          <div style={{ background: "#E8455A22", border: "2px solid #E8455A55", borderRadius: 16, padding: 14, color: "#FFD9DE", fontSize: 13 }}>
            {errors.slice(0, 5).map((e) => (<div key={e.file}>❌ {e.file}: {e.err}</div>))}
            {errors.length > 5 && <div>…e altre {errors.length - 5}</div>}
          </div>
        )}

        {(zipUrl || (status !== "running" && generated > 0)) && (
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            {!zipUrl && <button onClick={buildZip} style={btnStyle(false)}>📦 Prepara ZIP con le {generated} pronte</button>}
            {zipUrl && (
              <a href={zipUrl} download="isola-magica-audio.zip" style={{ ...btnStyle(true), textDecoration: "none", display: "inline-block" }}>
                ⬇️ Scarica isola-magica-audio.zip
              </a>
            )}
          </div>
        )}

        <p style={{ color: "#7A68A8", fontSize: 12, textAlign: "center" }}>
          Dentro lo ZIP: la cartella <b>audio/</b> con gli MP3 <b>appena generati</b> + il <b>manifest.json completo</b> (tutte le {manifest.length} clip). Copia il contenuto di <b>audio/</b> dentro <b>public/audio/</b> del progetto (i nuovi MP3 si aggiungono ai vecchi e il manifest.json va sostituito).
        </p>
      </div>
    </div>
  );
}
