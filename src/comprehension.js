/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 8 · LETTURA E ASCOLTO (isole 72-81)
   Comprensione in stile Cambridge A2 Key (Reading Parti 1-3 / Listening
   Parti 1&4). Motore `readscene`: uno stimolo condiviso (testo o audio) +
   domande a scelta multipla con distrattori autorati. Tutto CHIUSO e corretto
   sul dispositivo — zero AI, zero costi. Contenuti generati e ADVERSARIALMENTE
   validati (inglese naturale A2, una sola risposta giusta, distrattori
   plausibili, italiano corretto). NON è un livello/esame Cambridge ufficiale:
   è la nostra tappa interna "Lettore del Regno".
   ═══════════════════════════════════════════════════════════ */

export const ARC8_ISLANDS = [
  {
    "id": "readSigns",
    "name": "I Cartelli del Regno",
    "emoji": "🪧",
    "sub": "Cartelli e avvisi (A2)",
    "games": [
      {
        "key": "signs",
        "emoji": "🪧",
        "title": "Che Cosa Vuol Dire?",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi il cartello e scegli che cosa vuol dire!",
          "pool": [
            {
              "key": "library_quiet",
              "mode": "read",
              "it": "Su un cartello in biblioteca",
              "text": "Please be quiet. People are reading here.",
              "questions": [
                {
                  "key": "q_library",
                  "q": "What does this sign mean?",
                  "qit": "Cosa significa questo cartello?",
                  "options": [
                    "You must not make noise.",
                    "You can play football here.",
                    "You can bring your dog."
                  ],
                  "answer": "You must not make noise."
                }
              ]
            },
            {
              "key": "shop_closed",
              "mode": "read",
              "it": "Sulla porta di un negozio",
              "text": "Sorry, we are closed. Open again on Monday.",
              "questions": [
                {
                  "key": "q_shop",
                  "q": "What does this sign mean?",
                  "qit": "Cosa significa questo cartello?",
                  "options": [
                    "The shop is open now.",
                    "You cannot buy anything today.",
                    "The shop is closed forever."
                  ],
                  "answer": "You cannot buy anything today."
                }
              ]
            },
            {
              "key": "park_grass",
              "mode": "read",
              "it": "Su un cartello nel parco",
              "text": "Keep off the grass. New flowers are growing.",
              "questions": [
                {
                  "key": "q_park",
                  "q": "What does this sign mean?",
                  "qit": "Cosa significa questo cartello?",
                  "options": [
                    "You can pick the flowers.",
                    "Do not walk on the grass.",
                    "You can sit on the grass."
                  ],
                  "answer": "Do not walk on the grass."
                }
              ]
            },
            {
              "key": "fridge_note",
              "mode": "read",
              "it": "Un biglietto sul frigo di casa",
              "text": "Milk is in the fridge. Please drink it today.",
              "questions": [
                {
                  "key": "q_fridge",
                  "q": "What does this note mean?",
                  "qit": "Cosa significa questo biglietto?",
                  "options": [
                    "Buy some new milk.",
                    "Drink the milk today.",
                    "The milk is on the table."
                  ],
                  "answer": "Drink the milk today."
                }
              ]
            },
            {
              "key": "pool_run",
              "mode": "read",
              "it": "Su un cartello vicino alla piscina",
              "text": "Do not run near the pool. The floor is wet.",
              "questions": [
                {
                  "key": "q_pool",
                  "q": "What does this sign mean?",
                  "qit": "Cosa significa questo cartello?",
                  "options": [
                    "You must walk here.",
                    "You can swim in the sea.",
                    "You can run fast here."
                  ],
                  "answer": "You must walk here."
                }
              ]
            },
            {
              "key": "zoo_ticket",
              "mode": "read",
              "it": "Su un biglietto d'ingresso",
              "text": "Zoo ticket. One child. Enter before four o'clock.",
              "questions": [
                {
                  "key": "q_ticket",
                  "q": "Where can you use this ticket?",
                  "qit": "Dove puoi usare questo biglietto?",
                  "options": [
                    "At the zoo.",
                    "At the cinema.",
                    "At the swimming pool."
                  ],
                  "answer": "At the zoo."
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "readMessages",
    "name": "I Messaggi Segreti",
    "emoji": "💬",
    "sub": "Messaggi e bigliettini (A2)",
    "games": [
      {
        "key": "messages",
        "emoji": "💬",
        "title": "Perche Ha Scritto?",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi il messaggio e scopri perche lo ha scritto!",
          "pool": [
            {
              "key": "anna_park",
              "mode": "read",
              "it": "Un messaggio di Anna per la sua amica Lily",
              "text": "Hi Lily. I can play in the park at four o clock today. Please bring your new ball. See you there! Anna",
              "questions": [
                {
                  "key": "q_anna",
                  "q": "What must Lily bring?",
                  "qit": "Cosa deve portare Lily?",
                  "options": [
                    "Her new ball",
                    "Her new bike",
                    "Her new book"
                  ],
                  "answer": "Her new ball"
                }
              ]
            },
            {
              "key": "dad_note",
              "mode": "read",
              "it": "Un biglietto del papa per Tom",
              "text": "Tom, I am at the shop. Your lunch is in the kitchen. Please give the cat some water. Back soon. Dad",
              "questions": [
                {
                  "key": "q_dad",
                  "q": "What must Tom do?",
                  "qit": "Cosa deve fare Tom?",
                  "options": [
                    "Give the cat water",
                    "Wash the plates",
                    "Walk to the shop"
                  ],
                  "answer": "Give the cat water"
                }
              ]
            },
            {
              "key": "party_time",
              "mode": "read",
              "it": "Un messaggio di Sam per Ben sulla festa",
              "text": "Hi Ben. My birthday party is not at three now. It starts at five o clock on Saturday. Come to my house! Sam",
              "questions": [
                {
                  "key": "q_party",
                  "q": "What time is the party now?",
                  "qit": "A che ora e la festa adesso?",
                  "options": [
                    "At five o clock",
                    "At three o clock",
                    "At four o clock"
                  ],
                  "answer": "At five o clock"
                }
              ]
            },
            {
              "key": "grandma_visit",
              "mode": "read",
              "it": "Un messaggio della mamma per Emma",
              "text": "Emma, Grandma is coming for dinner tonight. Please put your toys away before six o clock. Thank you! Mum",
              "questions": [
                {
                  "key": "q_grandma",
                  "q": "Why did Mum write to Emma?",
                  "qit": "Perche la mamma ha scritto a Emma?",
                  "options": [
                    "To ask her to tidy her toys",
                    "To ask her to cook dinner",
                    "To ask her to go to school"
                  ],
                  "answer": "To ask her to tidy her toys"
                }
              ]
            },
            {
              "key": "swim_plan",
              "mode": "read",
              "it": "Un messaggio di Kate per Zoe",
              "text": "Hi Zoe. Do you want to go swimming tomorrow? Bring your towel and a hat. It is hot and sunny! Kate",
              "questions": [
                {
                  "key": "q_swim",
                  "q": "Where do they want to go?",
                  "qit": "Dove vogliono andare?",
                  "options": [
                    "Swimming",
                    "Shopping",
                    "Skating"
                  ],
                  "answer": "Swimming"
                }
              ]
            },
            {
              "key": "lost_pencil",
              "mode": "read",
              "it": "Un biglietto di Max per la maestra",
              "text": "Dear Miss Green. I cannot find my red pencil case. I think it is under my desk. Can you help me? Max",
              "questions": [
                {
                  "key": "q_pencil",
                  "q": "Why did Max write this note?",
                  "qit": "Perche Max ha scritto questo biglietto?",
                  "options": [
                    "He lost his pencil case",
                    "He is late for school",
                    "He is ill today"
                  ],
                  "answer": "He lost his pencil case"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "readStory",
    "name": "La Storia della Giornata",
    "emoji": "📖",
    "sub": "Capire un raccontino (A2)",
    "games": [
      {
        "key": "story",
        "emoji": "📖",
        "title": "Leggi e Rispondi",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi il raccontino, poi rispondi alle domande!",
          "pool": [
            {
              "key": "lucy_saturday",
              "mode": "read",
              "it": "La giornata di Lucy",
              "text": "On Saturday, Lucy went to the park with her brother Tom. They took their dog Max and a red ball. First they played football on the grass. Then they ate cheese sandwiches under a big tree. At three o clock it started to rain, so they walked home.",
              "questions": [
                {
                  "key": "who_with",
                  "q": "Who did Lucy go to the park with?",
                  "qit": "Con chi e andata al parco Lucy?",
                  "options": [
                    "Her brother Tom",
                    "Her friend Sam",
                    "Her mum"
                  ],
                  "answer": "Her brother Tom"
                },
                {
                  "key": "what_ate",
                  "q": "What did they eat?",
                  "qit": "Che cosa hanno mangiato?",
                  "options": [
                    "Cheese sandwiches",
                    "An apple",
                    "Chocolate cake"
                  ],
                  "answer": "Cheese sandwiches"
                },
                {
                  "key": "when_rain",
                  "q": "When did it start to rain?",
                  "qit": "Quando ha iniziato a piovere?",
                  "options": [
                    "At three o clock",
                    "At one o clock",
                    "At six o clock"
                  ],
                  "answer": "At three o clock"
                }
              ]
            },
            {
              "key": "ben_kitten",
              "mode": "read",
              "it": "Il gattino di Ben",
              "text": "Ben has a small white kitten. Her name is Snow and she is one year old. Every morning Ben gives her some milk and fish. Snow likes to sleep in a blue box near the window. In the afternoon she plays with a green toy mouse.",
              "questions": [
                {
                  "key": "kitten_colour",
                  "q": "What colour is the kitten?",
                  "qit": "Di che colore e il gattino?",
                  "options": [
                    "White",
                    "Black",
                    "Brown"
                  ],
                  "answer": "White"
                },
                {
                  "key": "kitten_age",
                  "q": "How old is Snow?",
                  "qit": "Quanti anni ha Snow?",
                  "options": [
                    "One year old",
                    "Two years old",
                    "Five years old"
                  ],
                  "answer": "One year old"
                },
                {
                  "key": "kitten_sleep",
                  "q": "Where does Snow sleep?",
                  "qit": "Dove dorme Snow?",
                  "options": [
                    "In a blue box",
                    "On the bed",
                    "Under the table"
                  ],
                  "answer": "In a blue box"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "listenMarket",
    "name": "Le Voci del Mercato",
    "emoji": "🎧",
    "sub": "Ascolto: frasi brevi (A2)",
    "games": [
      {
        "key": "market",
        "emoji": "🎧",
        "title": "Ascolta e Scegli",
        "type": "readscene",
        "cfg": {
          "hintIt": "Ascolta la voce e scegli la risposta giusta!",
          "pool": [
            {
              "key": "apples_price",
              "mode": "listen",
              "it": "Alla bancarella della frutta",
              "text": "How much are the red apples? — They are two pounds for six apples today.",
              "questions": [
                {
                  "key": "q_apples",
                  "q": "How much are six red apples?",
                  "qit": "Quanto costano sei mele rosse?",
                  "options": [
                    "Two pounds",
                    "Six pounds",
                    "Ten pounds"
                  ],
                  "answer": "Two pounds"
                }
              ]
            },
            {
              "key": "market_day",
              "mode": "listen",
              "it": "Un signore chiede quando c'e il mercato",
              "text": "Excuse me, when is the fish market open? — It is open every Friday morning.",
              "questions": [
                {
                  "key": "q_day",
                  "q": "When is the fish market open?",
                  "qit": "Quando e aperto il mercato del pesce?",
                  "options": [
                    "On Friday",
                    "On Monday",
                    "On Sunday"
                  ],
                  "answer": "On Friday"
                }
              ]
            },
            {
              "key": "balloon_colour",
              "mode": "listen",
              "it": "Una bambina compra un palloncino",
              "text": "Can I have a balloon, please? — Of course. Would you like the green one or the yellow one? — The yellow one, please.",
              "questions": [
                {
                  "key": "q_colour",
                  "q": "What colour balloon does the girl want?",
                  "qit": "Di che colore vuole il palloncino la bambina?",
                  "options": [
                    "Yellow",
                    "Green",
                    "Red"
                  ],
                  "answer": "Yellow"
                }
              ]
            },
            {
              "key": "bread_number",
              "mode": "listen",
              "it": "Al banco del pane",
              "text": "Hello, I would like some bread rolls, please. — How many? — Four rolls, please.",
              "questions": [
                {
                  "key": "q_number",
                  "q": "How many bread rolls does she want?",
                  "qit": "Quanti panini vuole?",
                  "options": [
                    "Four",
                    "Three",
                    "Eight"
                  ],
                  "answer": "Four"
                }
              ]
            },
            {
              "key": "market_place",
              "mode": "listen",
              "it": "Due amici si accordano su dove trovarsi",
              "text": "Where shall we meet at the market? — Let us meet next to the flower shop.",
              "questions": [
                {
                  "key": "q_place",
                  "q": "Where will they meet?",
                  "qit": "Dove si incontreranno?",
                  "options": [
                    "Next to the flower shop",
                    "Next to the fish stall",
                    "Next to the bus stop"
                  ],
                  "answer": "Next to the flower shop"
                }
              ]
            },
            {
              "key": "closing_time",
              "mode": "listen",
              "it": "Un cliente chiede l'orario di chiusura",
              "text": "What time does the market close today? — It closes at five o clock.",
              "questions": [
                {
                  "key": "q_time",
                  "q": "What time does the market close?",
                  "qit": "A che ora chiude il mercato?",
                  "options": [
                    "At five o clock",
                    "At nine o clock",
                    "At two o clock"
                  ],
                  "answer": "At five o clock"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "readWho",
    "name": "Chi Fa Cosa",
    "emoji": "👥",
    "sub": "Abbina le persone (A2)",
    "games": [
      {
        "key": "who",
        "emoji": "👥",
        "title": "Chi E?",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi cosa fa ognuno, poi rispondi: chi e?",
          "pool": [
            {
              "key": "friends_hobbies_1",
              "mode": "read",
              "it": "Tre amici e i loro hobby",
              "text": "Emma likes swimming at the big pool every Saturday. Jack plays football with his team after school. Lily paints pictures of flowers and cats.",
              "questions": [
                {
                  "key": "q_swim",
                  "q": "Who likes swimming?",
                  "qit": "Chi ama nuotare?",
                  "options": [
                    "Emma",
                    "Jack",
                    "Lily"
                  ],
                  "answer": "Emma"
                },
                {
                  "key": "q_football",
                  "q": "Who plays football?",
                  "qit": "Chi gioca a calcio?",
                  "options": [
                    "Emma",
                    "Jack",
                    "Lily"
                  ],
                  "answer": "Jack"
                },
                {
                  "key": "q_paint",
                  "q": "Who paints pictures?",
                  "qit": "Chi dipinge quadri?",
                  "options": [
                    "Emma",
                    "Jack",
                    "Lily"
                  ],
                  "answer": "Lily"
                }
              ]
            },
            {
              "key": "friends_hobbies_2",
              "mode": "read",
              "it": "Tre bambini e cosa amano fare",
              "text": "Tom reads books about animals every night. Mia rides her bike in the park with her dad. Ben sings songs in the school music club.",
              "questions": [
                {
                  "key": "q_read",
                  "q": "Who reads books?",
                  "qit": "Chi legge libri?",
                  "options": [
                    "Tom",
                    "Mia",
                    "Ben"
                  ],
                  "answer": "Tom"
                },
                {
                  "key": "q_bike",
                  "q": "Who rides a bike?",
                  "qit": "Chi va in bicicletta?",
                  "options": [
                    "Tom",
                    "Mia",
                    "Ben"
                  ],
                  "answer": "Mia"
                },
                {
                  "key": "q_sing",
                  "q": "Who sings songs?",
                  "qit": "Chi canta canzoni?",
                  "options": [
                    "Tom",
                    "Mia",
                    "Ben"
                  ],
                  "answer": "Ben"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "listenAnnounce",
    "name": "L’Annuncio del Castello",
    "emoji": "📣",
    "sub": "Ascolto: un annuncio (A2)",
    "games": [
      {
        "key": "announce",
        "emoji": "📣",
        "title": "Il Grande Annuncio",
        "type": "readscene",
        "cfg": {
          "hintIt": "Ascolta l’annuncio, poi rispondi!",
          "pool": [
            {
              "key": "museum_announcement",
              "mode": "listen",
              "it": "Un annuncio al museo del castello",
              "text": "Good morning, everyone, and welcome to the Castle Museum. The museum shop is open now and you can buy postcards there. Please remember, we close at five o clock today.",
              "questions": [
                {
                  "key": "q_where",
                  "q": "Where are the children?",
                  "qit": "Dove sono i bambini?",
                  "options": [
                    "At a museum",
                    "At a park",
                    "At a school"
                  ],
                  "answer": "At a museum"
                },
                {
                  "key": "q_buy",
                  "q": "What can you buy in the shop?",
                  "qit": "Cosa puoi comprare nel negozio?",
                  "options": [
                    "Postcards",
                    "Books",
                    "Toys"
                  ],
                  "answer": "Postcards"
                },
                {
                  "key": "q_close",
                  "q": "What time does the museum close?",
                  "qit": "A che ora chiude il museo?",
                  "options": [
                    "At five o clock",
                    "At four o clock",
                    "At six o clock"
                  ],
                  "answer": "At five o clock"
                }
              ]
            },
            {
              "key": "train_announcement",
              "mode": "listen",
              "it": "Un annuncio alla stazione dei treni",
              "text": "Hello, everyone. The train to Green Town leaves at ten o clock from platform two. It is going to be a sunny day, so please take some water with you.",
              "questions": [
                {
                  "key": "q_town",
                  "q": "Where does the train go?",
                  "qit": "Dove va il treno?",
                  "options": [
                    "To Green Town",
                    "To Blue Town",
                    "To Old Town"
                  ],
                  "answer": "To Green Town"
                },
                {
                  "key": "q_platform",
                  "q": "Which platform is the train on?",
                  "qit": "Da quale binario parte il treno?",
                  "options": [
                    "Platform two",
                    "Platform three",
                    "Platform ten"
                  ],
                  "answer": "Platform two"
                },
                {
                  "key": "q_weather",
                  "q": "What is the weather going to be like?",
                  "qit": "Come sarà il tempo?",
                  "options": [
                    "Sunny",
                    "Rainy",
                    "Windy"
                  ],
                  "answer": "Sunny"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "readLetter",
    "name": "La Lettera dell’Amico",
    "emoji": "✉️",
    "sub": "Capire una lettera (A2)",
    "games": [
      {
        "key": "letter",
        "emoji": "✉️",
        "title": "La Lettera",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi la lettera dell’amico e rispondi!",
          "pool": [
            {
              "key": "emma_letter",
              "mode": "read",
              "it": "Una lettera di Emma alla sua amica Lucy",
              "text": "Dear Lucy, How are you? I am having a great summer. Last week my family went to the beach for three days. I made a big sandcastle and I swam in the sea every morning. My little brother found a pretty green shell. Next Saturday it is my birthday and I am going to have a party in the garden. Can you come and play games with us? Write back soon. Love from Emma",
              "questions": [
                {
                  "key": "who_wrote",
                  "q": "Who wrote this letter?",
                  "qit": "Chi ha scritto questa lettera?",
                  "options": [
                    "Emma",
                    "Lucy",
                    "Sam"
                  ],
                  "answer": "Emma"
                },
                {
                  "key": "where_went",
                  "q": "Where did Emma's family go last week?",
                  "qit": "Dove e andata la famiglia di Emma la settimana scorsa?",
                  "options": [
                    "To the beach",
                    "To the mountains",
                    "To the zoo"
                  ],
                  "answer": "To the beach"
                },
                {
                  "key": "what_made",
                  "q": "What did Emma make?",
                  "qit": "Cosa ha costruito Emma?",
                  "options": [
                    "A big sandcastle",
                    "A little boat",
                    "A green kite"
                  ],
                  "answer": "A big sandcastle"
                },
                {
                  "key": "brother_found",
                  "q": "What did her brother find?",
                  "qit": "Cosa ha trovato suo fratello?",
                  "options": [
                    "A green shell",
                    "A small fish",
                    "A red ball"
                  ],
                  "answer": "A green shell"
                },
                {
                  "key": "birthday_when",
                  "q": "When is Emma's birthday?",
                  "qit": "Quando e il compleanno di Emma?",
                  "options": [
                    "Next Saturday",
                    "Next Monday",
                    "Next Sunday"
                  ],
                  "answer": "Next Saturday"
                },
                {
                  "key": "why_wrote",
                  "q": "Why did Emma write to Lucy?",
                  "qit": "Perche Emma ha scritto a Lucy?",
                  "options": [
                    "To ask her to the party",
                    "To say goodbye",
                    "To ask for help"
                  ],
                  "answer": "To ask her to the party"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "listenPhone",
    "name": "Al Telefono",
    "emoji": "☎️",
    "sub": "Ascolto: una telefonata (A2)",
    "games": [
      {
        "key": "phone",
        "emoji": "☎️",
        "title": "La Telefonata",
        "type": "readscene",
        "cfg": {
          "hintIt": "Ascolta la telefonata, poi rispondi!",
          "pool": [
            {
              "key": "phone_party",
              "mode": "listen",
              "it": "Sam telefona a Mia per la sua festa.",
              "text": "Hi Mia, it is Sam. Are you coming to my party on Saturday? — Yes, I am! What time does it start? — It starts at three o clock, at my house. — Great! Can I bring my little brother? — Yes, of course. And please bring your football, we can play in the garden. — Okay, see you on Saturday!",
              "questions": [
                {
                  "key": "day",
                  "q": "When is the party?",
                  "qit": "Quando e la festa?",
                  "options": [
                    "On Saturday",
                    "On Sunday",
                    "On Monday"
                  ],
                  "answer": "On Saturday"
                },
                {
                  "key": "time",
                  "q": "What time does the party start?",
                  "qit": "A che ora comincia la festa?",
                  "options": [
                    "At two o clock",
                    "At three o clock",
                    "At four o clock"
                  ],
                  "answer": "At three o clock"
                },
                {
                  "key": "bring",
                  "q": "What must Mia bring?",
                  "qit": "Cosa deve portare Mia?",
                  "options": [
                    "Her football",
                    "Her cat",
                    "Her books"
                  ],
                  "answer": "Her football"
                }
              ]
            },
            {
              "key": "phone_park",
              "mode": "listen",
              "it": "Lucy chiama il nonno per andare al parco.",
              "text": "Hello Grandpa, can we go to the park today? — Hello Lucy! Yes, but it is raining now. Let us go this afternoon. — Okay! Can we take the dog? — Yes, we can take Rex. Do not forget your jacket, it is cold. — I will bring it. Can we have ice cream too? — Yes, we can buy ice cream near the park.",
              "questions": [
                {
                  "key": "weather",
                  "q": "What is the weather like now?",
                  "qit": "Che tempo fa adesso?",
                  "options": [
                    "It is sunny",
                    "It is raining",
                    "It is snowing"
                  ],
                  "answer": "It is raining"
                },
                {
                  "key": "who",
                  "q": "Who are they taking to the park?",
                  "qit": "Chi portano al parco?",
                  "options": [
                    "The dog",
                    "The cat",
                    "A friend"
                  ],
                  "answer": "The dog"
                },
                {
                  "key": "buy",
                  "q": "What can they buy near the park?",
                  "qit": "Cosa possono comprare vicino al parco?",
                  "options": [
                    "Ice cream",
                    "A jacket",
                    "A ball"
                  ],
                  "answer": "Ice cream"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "readDiary",
    "name": "Il Diario di Viaggio",
    "emoji": "🗺️",
    "sub": "Capire un diario (A2)",
    "games": [
      {
        "key": "diary",
        "emoji": "🗺️",
        "title": "Il Diario",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi il diario di viaggio e rispondi!",
          "pool": [
            {
              "key": "seaside_day",
              "mode": "read",
              "it": "Lunedi al mare",
              "text": "On Monday my family went to the seaside. It was hot and sunny all day. We swam in the sea and made a big sandcastle on the beach. In the afternoon I ate an ice cream with my sister. We were very happy.",
              "questions": [
                {
                  "key": "where",
                  "q": "Where did the family go?",
                  "qit": "Dove e andata la famiglia?",
                  "options": [
                    "To the seaside",
                    "To the mountains",
                    "To a farm"
                  ],
                  "answer": "To the seaside"
                },
                {
                  "key": "weather",
                  "q": "What was the weather like?",
                  "qit": "Com era il tempo?",
                  "options": [
                    "Hot and sunny",
                    "Cold and windy",
                    "Rainy"
                  ],
                  "answer": "Hot and sunny"
                },
                {
                  "key": "ate",
                  "q": "What did the child eat in the afternoon?",
                  "qit": "Cosa ha mangiato la bambina nel pomeriggio?",
                  "options": [
                    "An ice cream",
                    "A pizza",
                    "An apple"
                  ],
                  "answer": "An ice cream"
                }
              ]
            },
            {
              "key": "mountain_day",
              "mode": "read",
              "it": "Sabato in montagna",
              "text": "On Saturday we visited the mountains with my grandma. We walked up a long green hill and saw many cows. It was cloudy and a bit cold, so I wore my warm coat. We had a picnic near a small river. I found a pretty stone and put it in my bag.",
              "questions": [
                {
                  "key": "who",
                  "q": "Who went with the family?",
                  "qit": "Chi e andato con la famiglia?",
                  "options": [
                    "Grandma",
                    "A teacher",
                    "A doctor"
                  ],
                  "answer": "Grandma"
                },
                {
                  "key": "saw",
                  "q": "What animals did the child see?",
                  "qit": "Quali animali ha visto la bambina?",
                  "options": [
                    "Cows",
                    "Sheep",
                    "Lions"
                  ],
                  "answer": "Cows"
                },
                {
                  "key": "found",
                  "q": "What did the child find?",
                  "qit": "Cosa ha trovato la bambina?",
                  "options": [
                    "A pretty stone",
                    "A gold coin",
                    "A little dog"
                  ],
                  "answer": "A pretty stone"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "comprMaster",
    "name": "GRAN BOSS: Il Grande Racconto",
    "emoji": "🏆",
    "sub": "La grande prova di comprensione e il diploma",
    "games": [
      {
        "key": "bossRead",
        "emoji": "🏆",
        "title": "La Grande Prova",
        "type": "readscene",
        "cfg": {
          "hintIt": "Leggi e ascolta la grande avventura, poi rispondi da campione!",
          "diploma": "Lettore del Regno",
          "pool": [
            {
              "key": "s1_read_park",
              "mode": "read",
              "it": "Leggi il racconto della giornata speciale di Mia. Poi rispondi alle domande.",
              "text": "Today is Mia's birthday. She is eight years old. In the morning, her dad says, We are going to the zoo! Mia is very happy. She puts on her red hat and takes her small blue bag. The sun is shining and the sky is blue. Mia and her dad go to the zoo by bus.",
              "questions": [
                {
                  "key": "q1_age",
                  "q": "How old is Mia today?",
                  "qit": "Quanti anni compie Mia oggi?",
                  "options": [
                    "Six",
                    "Eight",
                    "Ten"
                  ],
                  "answer": "Eight"
                },
                {
                  "key": "q2_where",
                  "q": "Where are they going?",
                  "qit": "Dove stanno andando?",
                  "options": [
                    "To the zoo",
                    "To school",
                    "To the beach"
                  ],
                  "answer": "To the zoo"
                }
              ]
            },
            {
              "key": "s2_listen_gate",
              "mode": "listen",
              "it": "Ascolta Mia e suo padre che parlano al cancello dello zoo.",
              "text": "Dad, can we see the elephants first? — Yes, but let's see the monkeys first. They are near the gate. Then we can find the elephants after lunch.",
              "questions": [
                {
                  "key": "q3_first",
                  "q": "What do they see first?",
                  "qit": "Cosa vedono per primo?",
                  "options": [
                    "The elephants",
                    "The monkeys",
                    "The lions"
                  ],
                  "answer": "The monkeys"
                },
                {
                  "key": "q4_when_eleph",
                  "q": "When can they find the elephants?",
                  "qit": "Quando possono trovare gli elefanti?",
                  "options": [
                    "After lunch",
                    "Before breakfast",
                    "At night"
                  ],
                  "answer": "After lunch"
                }
              ]
            },
            {
              "key": "s3_read_sign",
              "mode": "read",
              "it": "Mia vede un cartello vicino alla casa degli uccelli. Leggilo.",
              "text": "BIRD HOUSE. Open every day from ten o clock to five o clock. Please do not give food to the birds. You can buy bird pictures in the shop.",
              "questions": [
                {
                  "key": "q5_notfeed",
                  "q": "What must you NOT do?",
                  "qit": "Cosa NON devi fare?",
                  "options": [
                    "Give food to the birds",
                    "Take pictures",
                    "Go inside"
                  ],
                  "answer": "Give food to the birds"
                },
                {
                  "key": "q6_shop",
                  "q": "What can you buy in the shop?",
                  "qit": "Cosa puoi comprare nel negozio?",
                  "options": [
                    "Bird pictures",
                    "Hats",
                    "Toys"
                  ],
                  "answer": "Bird pictures"
                }
              ]
            },
            {
              "key": "s4_listen_announce",
              "mode": "listen",
              "it": "Ascolta un annuncio gentile allo zoo nel pomeriggio.",
              "text": "Hello everyone. It is now three o clock. Come to the big tent to see the birthday show. There is free cake for all the children today.",
              "questions": [
                {
                  "key": "q7_time",
                  "q": "What time is it now?",
                  "qit": "Che ore sono adesso?",
                  "options": [
                    "One o clock",
                    "Three o clock",
                    "Six o clock"
                  ],
                  "answer": "Three o clock"
                },
                {
                  "key": "q8_free",
                  "q": "What is free for the children?",
                  "qit": "Cosa è gratis per i bambini?",
                  "options": [
                    "Cake",
                    "Hats",
                    "Books"
                  ],
                  "answer": "Cake"
                }
              ]
            }
          ]
        }
      }
    ]
  },
];
