/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 9 · L'ACCADEMIA DEGLI ESAMI (isole 82-91)
   Prove in stile Cambridge A2 Key con il motore `matching`: una colonna di
   indizi + una di figure/risposte, con UNA sola corrispondenza corretta per
   coppia (Listening Part 5 / abbinamenti di lettura). Include gap-fill
   (completa la frase) come abbinamento parola↔spazio. Tutto CHIUSO e corretto
   sul dispositivo — zero AI, zero costi. Contenuti generati e ADVERSARIALMENTE
   validati (inglese naturale A2, match unico, distrattori plausibili, italiano
   corretto). NON è un esame Cambridge ufficiale: è la nostra "Accademia".
   ═══════════════════════════════════════════════════════════ */

export const ARC9_ISLANDS = [
  {
    "id": "matchPlaces",
    "name": "Ogni Cosa al Suo Posto",
    "emoji": "🧩",
    "sub": "Abbina oggetti e luoghi (A2)",
    "games": [
      {
        "key": "matchPlaces_g1",
        "emoji": "🏠",
        "title": "Dentro Casa",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca l'oggetto, poi la stanza giusta!",
          "pool": [
            {
              "key": "matchPlaces_g1_r1",
              "it": "In quale stanza si trova?",
              "intro": "Metti ogni cosa nella stanza giusta!",
              "listen": false,
              "pairs": [
                {
                  "l": "bed",
                  "r": "bedroom",
                  "emoji": "🛏️",
                  "say": "The bed is in the bedroom."
                },
                {
                  "l": "pan",
                  "r": "kitchen",
                  "emoji": "🍳",
                  "say": "The pan is in the kitchen."
                },
                {
                  "l": "car",
                  "r": "garage",
                  "emoji": "🚗",
                  "say": "The car is in the garage."
                },
                {
                  "l": "soap",
                  "r": "bathroom",
                  "emoji": "🛁",
                  "say": "The soap is in the bathroom."
                }
              ],
              "extra": [
                {
                  "r": "garden",
                  "emoji": "🌳"
                }
              ]
            },
            {
              "key": "matchPlaces_g1_r2",
              "it": "Dove va questa cosa?",
              "intro": "Trova il posto giusto per ogni oggetto!",
              "listen": false,
              "pairs": [
                {
                  "l": "sofa",
                  "r": "living room",
                  "emoji": "🛋️",
                  "say": "The sofa is in the living room."
                },
                {
                  "l": "plate",
                  "r": "kitchen",
                  "emoji": "🍽️",
                  "say": "The plate is in the kitchen."
                },
                {
                  "l": "towel",
                  "r": "bathroom",
                  "emoji": "🚿",
                  "say": "The towel is in the bathroom."
                }
              ],
              "extra": [
                {
                  "r": "bedroom",
                  "emoji": "🛏️"
                }
              ]
            }
          ]
        }
      },
      {
        "key": "matchPlaces_g2",
        "emoji": "🌍",
        "title": "Fuori nel Mondo",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca la parola, poi il luogo giusto!",
          "pool": [
            {
              "key": "matchPlaces_g2_r1",
              "it": "In quale luogo si trova?",
              "intro": "Metti ogni cosa nel luogo giusto!",
              "listen": false,
              "pairs": [
                {
                  "l": "doctor",
                  "r": "hospital",
                  "emoji": "🏥",
                  "say": "The doctor is in the hospital."
                },
                {
                  "l": "slide",
                  "r": "park",
                  "emoji": "🛝",
                  "say": "The slide is in the park."
                },
                {
                  "l": "book",
                  "r": "library",
                  "emoji": "📚",
                  "say": "The book is in the library."
                },
                {
                  "l": "cow",
                  "r": "farm",
                  "emoji": "🚜",
                  "say": "The cow is on the farm."
                }
              ],
              "extra": [
                {
                  "r": "beach",
                  "emoji": "🏖️"
                }
              ]
            },
            {
              "key": "matchPlaces_g2_r2",
              "it": "Dove lo trovi?",
              "intro": "Ascolta e trova il luogo giusto!",
              "listen": true,
              "pairs": [
                {
                  "l": "teacher",
                  "r": "school",
                  "emoji": "🏫",
                  "say": "The teacher is at school."
                },
                {
                  "l": "lion",
                  "r": "zoo",
                  "emoji": "🦓",
                  "say": "The lion is at the zoo."
                },
                {
                  "l": "bread",
                  "r": "shop",
                  "emoji": "🏪",
                  "say": "The bread is in the shop."
                }
              ],
              "extra": [
                {
                  "r": "beach",
                  "emoji": "🏖️"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchJobs",
    "name": "Chi Fa Che Lavoro",
    "emoji": "👷",
    "sub": "Abbina persone e lavori (A2)",
    "games": [
      {
        "key": "matchJobs_g1",
        "emoji": "👷",
        "title": "Chi Fa Che Lavoro",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca la persona, poi tocca il suo lavoro!",
          "pool": [
            {
              "key": "matchJobs_g1_r1",
              "it": "Che lavoro fa?",
              "intro": "Who does this job?",
              "listen": false,
              "pairs": [
                {
                  "l": "She helps sick people in a hospital.",
                  "r": "doctor",
                  "emoji": "👩‍⚕️",
                  "say": "She helps sick people in a hospital. She is a doctor."
                },
                {
                  "l": "He teaches children at school.",
                  "r": "teacher",
                  "emoji": "👨‍🏫",
                  "say": "He teaches children at school. He is a teacher."
                },
                {
                  "l": "She cooks food in a restaurant.",
                  "r": "cook",
                  "emoji": "👩‍🍳",
                  "say": "She cooks food in a restaurant. She is a cook."
                },
                {
                  "l": "He grows food on a farm.",
                  "r": "farmer",
                  "emoji": "👨‍🌾",
                  "say": "He grows food on a farm. He is a farmer."
                }
              ],
              "extra": [
                {
                  "r": "pilot",
                  "emoji": "👨‍✈️"
                }
              ]
            },
            {
              "key": "matchJobs_g1_r2",
              "it": "Che lavoro fa?",
              "intro": "Who does this job?",
              "listen": false,
              "pairs": [
                {
                  "l": "She flies a plane.",
                  "r": "pilot",
                  "emoji": "👩‍✈️",
                  "say": "She flies a plane. She is a pilot."
                },
                {
                  "l": "He drives a bus.",
                  "r": "bus driver",
                  "emoji": "🚌",
                  "say": "He drives a bus. He is a bus driver."
                },
                {
                  "l": "She sings songs on stage.",
                  "r": "singer",
                  "emoji": "🎤",
                  "say": "She sings songs on stage. She is a singer."
                },
                {
                  "l": "He catches robbers.",
                  "r": "police officer",
                  "emoji": "👮",
                  "say": "He catches robbers. He is a police officer."
                }
              ],
              "extra": [
                {
                  "r": "nurse",
                  "emoji": "👩‍⚕️"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchQA",
    "name": "Domanda e Risposta",
    "emoji": "💬",
    "sub": "Abbina domande e risposte (A2)",
    "games": [
      {
        "key": "matchQA_g1",
        "emoji": "🙋",
        "title": "Facciamo amicizia",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca la domanda, poi tocca la risposta giusta!",
          "pool": [
            {
              "key": "matchQA_g1_r1",
              "it": "Parliamo di te!",
              "intro": "Abbina ogni domanda alla risposta giusta.",
              "listen": false,
              "pairs": [
                {
                  "l": "What is your name?",
                  "r": "My name is Tom.",
                  "emoji": "",
                  "say": "What is your name? My name is Tom."
                },
                {
                  "l": "How old are you?",
                  "r": "I'm eight.",
                  "emoji": "",
                  "say": "How old are you? I'm eight."
                },
                {
                  "l": "How are you?",
                  "r": "I'm fine, thanks.",
                  "emoji": "",
                  "say": "How are you? I'm fine, thanks."
                },
                {
                  "l": "Where are you from?",
                  "r": "I'm from Italy.",
                  "emoji": "",
                  "say": "Where are you from? I'm from Italy."
                }
              ]
            },
            {
              "key": "matchQA_g1_r2",
              "it": "Ancora domande su di te!",
              "intro": "Ogni domanda ha una sola risposta.",
              "listen": false,
              "pairs": [
                {
                  "l": "Have you got a pet?",
                  "r": "Yes, I have a dog.",
                  "emoji": "🐶",
                  "say": "Have you got a pet? Yes, I have a dog."
                },
                {
                  "l": "What is your favourite food?",
                  "r": "I like pizza.",
                  "emoji": "🍕",
                  "say": "What is your favourite food? I like pizza."
                },
                {
                  "l": "When is your birthday?",
                  "r": "It's in May.",
                  "emoji": "🎂",
                  "say": "When is your birthday? It's in May."
                }
              ],
              "extra": [
                {
                  "r": "I have a brother.",
                  "emoji": "👦"
                }
              ]
            }
          ]
        }
      },
      {
        "key": "matchQA_g2",
        "emoji": "🔎",
        "title": "Domande curiose",
        "type": "matching",
        "cfg": {
          "hintIt": "Leggi la domanda e trova la risposta giusta!",
          "pool": [
            {
              "key": "matchQA_g2_r1",
              "it": "Che cosa rispondi?",
              "intro": "Ogni domanda ha una sola risposta giusta.",
              "listen": false,
              "pairs": [
                {
                  "l": "What's this?",
                  "r": "It's a cat.",
                  "emoji": "🐱",
                  "say": "What's this? It's a cat."
                },
                {
                  "l": "What colour is the sun?",
                  "r": "It's yellow.",
                  "emoji": "🟡",
                  "say": "What colour is the sun? It's yellow."
                },
                {
                  "l": "What time is it?",
                  "r": "It's three o'clock.",
                  "emoji": "🕒",
                  "say": "What time is it? It's three o'clock."
                },
                {
                  "l": "How many apples?",
                  "r": "There are two.",
                  "emoji": "🍎",
                  "say": "How many apples? There are two."
                }
              ],
              "extra": [
                {
                  "r": "It's Monday.",
                  "emoji": "📅"
                }
              ]
            },
            {
              "key": "matchQA_g2_r2",
              "it": "Rispondi sì o dai la risposta!",
              "intro": "Leggi bene: c'è una risposta in più!",
              "listen": false,
              "pairs": [
                {
                  "l": "Where is the ball?",
                  "r": "It's on the table.",
                  "emoji": "⚽",
                  "say": "Where is the ball? It's on the table."
                },
                {
                  "l": "Can you swim?",
                  "r": "Yes, I can.",
                  "emoji": "🏊",
                  "say": "Can you swim? Yes, I can."
                },
                {
                  "l": "What's the weather like?",
                  "r": "It's sunny.",
                  "emoji": "☀️",
                  "say": "What's the weather like? It's sunny."
                }
              ],
              "extra": [
                {
                  "r": "No, thank you.",
                  "emoji": "🙅"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchListen",
    "name": "Ascolta e Abbina",
    "emoji": "🎧",
    "sub": "Ascolto: abbina la voce alla figura (A2).",
    "games": [
      {
        "key": "matchListen_g1",
        "emoji": "👂",
        "title": "Ascolta e trova la figura",
        "type": "matching",
        "cfg": {
          "hintIt": "Ascolta la frase e tocca la figura giusta 🎧",
          "pool": [
            {
              "key": "r1_see",
              "it": "Ascolta: cosa vedo?",
              "intro": "Ascolta la voce e tocca la figura che senti.",
              "listen": true,
              "pairs": [
                {
                  "l": "I can see a red apple.",
                  "r": "apple",
                  "emoji": "🍎",
                  "say": "I can see a red apple."
                },
                {
                  "l": "I can see a happy dog.",
                  "r": "dog",
                  "emoji": "🐶",
                  "say": "I can see a happy dog."
                },
                {
                  "l": "I can see a big ball.",
                  "r": "ball",
                  "emoji": "⚽",
                  "say": "I can see a big ball."
                },
                {
                  "l": "I can see the yellow sun.",
                  "r": "sun",
                  "emoji": "☀️",
                  "say": "I can see the yellow sun."
                }
              ],
              "extra": [
                {
                  "r": "star",
                  "emoji": "⭐"
                }
              ]
            },
            {
              "key": "r1_where",
              "it": "Ascolta: dove sono le cose?",
              "intro": "Ascolta e tocca la figura giusta.",
              "listen": true,
              "pairs": [
                {
                  "l": "The cat is on the bed.",
                  "r": "cat",
                  "emoji": "🐱",
                  "say": "The cat is on the bed."
                },
                {
                  "l": "The book is on the table.",
                  "r": "book",
                  "emoji": "📖",
                  "say": "The book is on the table."
                },
                {
                  "l": "The bird is in the tree.",
                  "r": "bird",
                  "emoji": "🐦",
                  "say": "The bird is in the tree."
                }
              ],
              "extra": [
                {
                  "r": "car",
                  "emoji": "🚗"
                }
              ]
            }
          ]
        }
      },
      {
        "key": "matchListen_g2",
        "emoji": "🔊",
        "title": "Ascolta il colore e l'oggetto",
        "type": "matching",
        "cfg": {
          "hintIt": "Ascolta bene e tocca la figura che senti 🔊",
          "pool": [
            {
              "key": "r2_color",
              "it": "Ascolta: che cos'è di questo colore?",
              "intro": "Ascolta la frase e tocca la figura giusta.",
              "listen": true,
              "pairs": [
                {
                  "l": "The banana is yellow.",
                  "r": "banana",
                  "emoji": "🍌",
                  "say": "The banana is yellow."
                },
                {
                  "l": "The frog is green.",
                  "r": "frog",
                  "emoji": "🐸",
                  "say": "The frog is green."
                },
                {
                  "l": "The fish is blue.",
                  "r": "fish",
                  "emoji": "🐟",
                  "say": "The fish is blue."
                },
                {
                  "l": "The flower is pink.",
                  "r": "flower",
                  "emoji": "🌸",
                  "say": "The flower is pink."
                }
              ],
              "extra": [
                {
                  "r": "carrot",
                  "emoji": "🥕"
                }
              ]
            },
            {
              "key": "r2_like",
              "it": "Ascolta: cosa mi piace?",
              "intro": "Ascolta e tocca la figura che senti.",
              "listen": true,
              "pairs": [
                {
                  "l": "I like to eat cake.",
                  "r": "cake",
                  "emoji": "🍰",
                  "say": "I like to eat cake."
                },
                {
                  "l": "I like to drink milk.",
                  "r": "milk",
                  "emoji": "🥛",
                  "say": "I like to drink milk."
                },
                {
                  "l": "I like to play the drum.",
                  "r": "drum",
                  "emoji": "🥁",
                  "say": "I like to play the drum."
                }
              ],
              "extra": [
                {
                  "r": "hat",
                  "emoji": "🎩"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchTime",
    "name": "Che Ora È?",
    "emoji": "🕐",
    "sub": "Abbina orari e attività (A2)",
    "games": [
      {
        "key": "matchTime-g1",
        "emoji": "☀️",
        "title": "La mia giornata",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca un orario, poi tocca l'attività giusta!",
          "pool": [
            {
              "key": "matchTime-g1-r1",
              "it": "A che ora?",
              "intro": "Abbina ogni orario all'attività giusta.",
              "listen": false,
              "pairs": [
                {
                  "l": "7 o'clock in the morning",
                  "r": "breakfast",
                  "emoji": "🥣",
                  "say": "At 7 o'clock in the morning I have breakfast."
                },
                {
                  "l": "8 o'clock in the morning",
                  "r": "go to school",
                  "emoji": "🎒",
                  "say": "At 8 o'clock in the morning I go to school."
                },
                {
                  "l": "1 o'clock in the afternoon",
                  "r": "lunch",
                  "emoji": "🍝",
                  "say": "At 1 o'clock in the afternoon I have lunch."
                },
                {
                  "l": "4 o'clock in the afternoon",
                  "r": "homework",
                  "emoji": "✏️",
                  "say": "At 4 o'clock in the afternoon I do my homework."
                }
              ],
              "extra": [
                {
                  "r": "brush my teeth",
                  "emoji": "🪥"
                }
              ]
            },
            {
              "key": "matchTime-g1-r2",
              "it": "Sera e notte",
              "intro": "Che cosa faccio a queste ore?",
              "listen": false,
              "pairs": [
                {
                  "l": "6 o'clock in the evening",
                  "r": "dinner",
                  "emoji": "🍽️",
                  "say": "At 6 o'clock in the evening I have dinner."
                },
                {
                  "l": "7 o'clock in the evening",
                  "r": "have a bath",
                  "emoji": "🛁",
                  "say": "At 7 o'clock in the evening I have a bath."
                },
                {
                  "l": "8 o'clock in the evening",
                  "r": "read a book",
                  "emoji": "📖",
                  "say": "At 8 o'clock in the evening I read a book."
                },
                {
                  "l": "9 o'clock at night",
                  "r": "go to bed",
                  "emoji": "🛏️",
                  "say": "At 9 o'clock at night I go to bed."
                }
              ],
              "extra": [
                {
                  "r": "watch TV",
                  "emoji": "📺"
                }
              ]
            }
          ]
        }
      },
      {
        "key": "matchTime-g2",
        "emoji": "📅",
        "title": "La mia settimana",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca un giorno, poi tocca l'attività giusta!",
          "pool": [
            {
              "key": "matchTime-g2-r1",
              "it": "Che giorno è?",
              "intro": "Abbina ogni giorno all'attività giusta.",
              "listen": false,
              "pairs": [
                {
                  "l": "Monday",
                  "r": "swimming lesson",
                  "emoji": "🏊",
                  "say": "On Monday I have my swimming lesson."
                },
                {
                  "l": "Friday",
                  "r": "watch a film",
                  "emoji": "🎬",
                  "say": "On Friday I watch a film."
                },
                {
                  "l": "Saturday",
                  "r": "go to the park",
                  "emoji": "🏞️",
                  "say": "On Saturday I go to the park."
                },
                {
                  "l": "Sunday",
                  "r": "visit my grandma",
                  "emoji": "👵",
                  "say": "On Sunday I visit my grandma."
                }
              ],
              "extra": [
                {
                  "r": "play football",
                  "emoji": "⚽"
                }
              ]
            },
            {
              "key": "matchTime-g2-r2",
              "it": "Ascolta e abbina",
              "intro": "Ascolta la frase e trova l'attività giusta.",
              "listen": true,
              "pairs": [
                {
                  "l": "Tuesday",
                  "r": "play the piano",
                  "emoji": "🎹",
                  "say": "On Tuesday I play the piano."
                },
                {
                  "l": "Wednesday",
                  "r": "ride my bike",
                  "emoji": "🚲",
                  "say": "On Wednesday I ride my bike."
                },
                {
                  "l": "Thursday",
                  "r": "help my mum",
                  "emoji": "🧹",
                  "say": "On Thursday I help my mum in the kitchen."
                }
              ],
              "extra": [
                {
                  "r": "feed the cat",
                  "emoji": "🐱"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchGap",
    "name": "Completa la Frase",
    "emoji": "✏️",
    "sub": "Riempi lo spazio (A2)",
    "games": [
      {
        "key": "gapActions",
        "emoji": "✏️",
        "title": "Riempi lo Spazio",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca la frase, poi la parola che manca!",
          "pool": [
            {
              "key": "gap_r1",
              "it": "Quale parola manca?",
              "intro": "Leggi la frase e trova la parola che manca!",
              "listen": false,
              "pairs": [
                {
                  "l": "I ___ my teeth every morning.",
                  "r": "brush",
                  "emoji": "🪥",
                  "say": "I brush my teeth every morning."
                },
                {
                  "l": "She can ___ a bike very fast.",
                  "r": "ride",
                  "emoji": "🚲",
                  "say": "She can ride a bike very fast."
                },
                {
                  "l": "We ___ orange juice at breakfast.",
                  "r": "drink",
                  "emoji": "🧃",
                  "say": "We drink orange juice at breakfast."
                },
                {
                  "l": "Birds can ___ high in the sky.",
                  "r": "fly",
                  "emoji": "🐦",
                  "say": "Birds can fly high in the sky."
                }
              ],
              "extra": [
                {
                  "r": "swim",
                  "emoji": "🏊"
                }
              ]
            },
            {
              "key": "gap_r2",
              "it": "Quale parola manca?",
              "intro": "Leggi la frase e trova la parola che manca!",
              "listen": false,
              "pairs": [
                {
                  "l": "The sun is ___ and yellow.",
                  "r": "hot",
                  "emoji": "🔥",
                  "say": "The sun is hot and yellow."
                },
                {
                  "l": "This box is very ___.",
                  "r": "big",
                  "emoji": "📦",
                  "say": "This box is very big."
                },
                {
                  "l": "We sleep in a ___ at night.",
                  "r": "bed",
                  "emoji": "🛏️",
                  "say": "We sleep in a bed at night."
                }
              ],
              "extra": [
                {
                  "r": "cold",
                  "emoji": "🧊"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchOpp",
    "name": "Contrari e Coppie",
    "emoji": "🔁",
    "sub": "Abbina i contrari (A2)",
    "games": [
      {
        "key": "matchOpp-adjectives",
        "emoji": "🔁",
        "title": "I Contrari",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca la parola, poi il suo contrario!",
          "pool": [
            {
              "key": "matchOpp-r1-feelings",
              "it": "Abbina ogni parola al suo contrario.",
              "intro": "Match each word to its opposite!",
              "listen": false,
              "pairs": [
                {
                  "l": "big",
                  "r": "small",
                  "emoji": "🐜",
                  "say": "The opposite of big is small."
                },
                {
                  "l": "hot",
                  "r": "cold",
                  "emoji": "🥶",
                  "say": "The opposite of hot is cold."
                },
                {
                  "l": "happy",
                  "r": "sad",
                  "emoji": "😢",
                  "say": "The opposite of happy is sad."
                },
                {
                  "l": "fast",
                  "r": "slow",
                  "emoji": "🐌",
                  "say": "The opposite of fast is slow."
                }
              ],
              "extra": [
                {
                  "r": "wet",
                  "emoji": "💧"
                }
              ]
            },
            {
              "key": "matchOpp-r2-world",
              "it": "Abbina ogni parola al suo contrario.",
              "intro": "Find the opposite of each word!",
              "listen": false,
              "pairs": [
                {
                  "l": "day",
                  "r": "night",
                  "emoji": "🌙",
                  "say": "The opposite of day is night."
                },
                {
                  "l": "old",
                  "r": "new",
                  "emoji": "🆕",
                  "say": "The opposite of old is new."
                },
                {
                  "l": "up",
                  "r": "down",
                  "emoji": "⬇️",
                  "say": "The opposite of up is down."
                },
                {
                  "l": "open",
                  "r": "closed",
                  "emoji": "🔒",
                  "say": "The opposite of open is closed."
                }
              ],
              "extra": [
                {
                  "r": "empty",
                  "emoji": "📭"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchMenu",
    "name": "Il Menù del Regno",
    "emoji": "🍎",
    "sub": "Abbina cibo e indizi (A2)",
    "games": [
      {
        "key": "matchMenu-g1",
        "emoji": "🍽️",
        "title": "Indizi golosi",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca l'indizio, poi tocca il cibo giusto!",
          "pool": [
            {
              "key": "matchMenu-g1-r1",
              "it": "Leggi l'indizio e trova il cibo.",
              "intro": "Un indizio, un cibo. Trovali!",
              "listen": false,
              "pairs": [
                {
                  "l": "I want something sweet.",
                  "r": "cake",
                  "emoji": "🍰",
                  "say": "I want something sweet. I want a cake."
                },
                {
                  "l": "A red fruit.",
                  "r": "apple",
                  "emoji": "🍎",
                  "say": "A red fruit. It is an apple."
                },
                {
                  "l": "You drink it and it is white.",
                  "r": "milk",
                  "emoji": "🥛",
                  "say": "You drink it and it is white. It is milk."
                },
                {
                  "l": "A long, yellow fruit.",
                  "r": "banana",
                  "emoji": "🍌",
                  "say": "A long, yellow fruit. It is a banana."
                }
              ],
              "extra": [
                {
                  "r": "cheese",
                  "emoji": "🧀"
                }
              ]
            },
            {
              "key": "matchMenu-g1-r2",
              "it": "Ancora indizi: leggi e abbina.",
              "intro": "Che cosa voglio? Leggi e scopri!",
              "listen": false,
              "pairs": [
                {
                  "l": "A hot brown drink for grown-ups.",
                  "r": "coffee",
                  "emoji": "☕",
                  "say": "A hot brown drink for grown-ups. It is coffee."
                },
                {
                  "l": "A small red fruit for cakes.",
                  "r": "strawberry",
                  "emoji": "🍓",
                  "say": "A small red fruit for cakes. It is a strawberry."
                },
                {
                  "l": "An orange vegetable that rabbits love.",
                  "r": "carrot",
                  "emoji": "🥕",
                  "say": "An orange vegetable that rabbits love. It is a carrot."
                }
              ],
              "extra": [
                {
                  "r": "bread",
                  "emoji": "🍞"
                }
              ]
            }
          ]
        }
      },
      {
        "key": "matchMenu-g2",
        "emoji": "👂",
        "title": "Ascolta e ordina",
        "type": "matching",
        "cfg": {
          "hintIt": "Ascolta la frase, poi tocca il cibo giusto!",
          "pool": [
            {
              "key": "matchMenu-g2-r1",
              "it": "Ascolta e trova il cibo giusto.",
              "intro": "Chiudi gli occhi e ascolta bene!",
              "listen": true,
              "pairs": [
                {
                  "l": "I want an orange drink.",
                  "r": "orange juice",
                  "emoji": "🧃",
                  "say": "I want an orange drink. I want orange juice."
                },
                {
                  "l": "I eat it for breakfast and it comes from a chicken.",
                  "r": "egg",
                  "emoji": "🥚",
                  "say": "I eat it for breakfast and it comes from a chicken. It is an egg."
                },
                {
                  "l": "A round red vegetable for pizza.",
                  "r": "tomato",
                  "emoji": "🍅",
                  "say": "A round red vegetable for pizza. It is a tomato."
                },
                {
                  "l": "A cold sweet treat for hot days.",
                  "r": "ice cream",
                  "emoji": "🍦",
                  "say": "A cold sweet treat for hot days. It is ice cream."
                }
              ],
              "extra": [
                {
                  "r": "fish",
                  "emoji": "🐟"
                }
              ]
            },
            {
              "key": "matchMenu-g2-r2",
              "it": "Ancora ascolto: senti e abbina.",
              "intro": "Ancora una volta: ascolta e scegli!",
              "listen": true,
              "pairs": [
                {
                  "l": "A yellow fruit with a thick skin. It is sour.",
                  "r": "lemon",
                  "emoji": "🍋",
                  "say": "A yellow fruit with a thick skin. It is sour. It is a lemon."
                },
                {
                  "l": "A big green fruit. It is red inside and full of water.",
                  "r": "watermelon",
                  "emoji": "🍉",
                  "say": "A big green fruit. It is red inside and full of water. It is a watermelon."
                },
                {
                  "l": "You put it on bread and bees make it.",
                  "r": "honey",
                  "emoji": "🍯",
                  "say": "You put it on bread and bees make it. It is honey."
                }
              ],
              "extra": [
                {
                  "r": "chicken",
                  "emoji": "🍗"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "matchMixed",
    "name": "La Prova Generale",
    "emoji": "🎯",
    "sub": "Ripasso di abbinamenti (A2)",
    "games": [
      {
        "key": "mixedMock",
        "emoji": "🎯",
        "title": "La Prova Generale",
        "type": "matching",
        "cfg": {
          "hintIt": "Tocca a sinistra, poi trova la risposta giusta a destra",
          "pool": [
            {
              "key": "mixR1people",
              "it": "Round 1 — Ogni bambino e la sua attività preferita",
              "intro": "Round one. Match each child with their favourite thing.",
              "listen": false,
              "pairs": [
                {
                  "l": "Tom loves the water.",
                  "r": "swimming",
                  "emoji": "🏊",
                  "say": "Tom loves the water. His favourite thing is swimming."
                },
                {
                  "l": "Anna loves songs.",
                  "r": "singing",
                  "emoji": "🎤",
                  "say": "Anna loves songs. Her favourite thing is singing."
                },
                {
                  "l": "Ben loves the ball.",
                  "r": "football",
                  "emoji": "⚽",
                  "say": "Ben loves the ball. His favourite thing is football."
                },
                {
                  "l": "Lucy loves crayons.",
                  "r": "drawing",
                  "emoji": "🖍️",
                  "say": "Lucy loves crayons. Her favourite thing is drawing."
                }
              ],
              "extra": [
                {
                  "r": "cooking",
                  "emoji": "🍳"
                }
              ]
            },
            {
              "key": "mixR2qa",
              "it": "Round 2 — Ogni domanda e la sua risposta",
              "intro": "Round two. Match each question with the right answer.",
              "listen": false,
              "pairs": [
                {
                  "l": "How old are you?",
                  "r": "I'm eight.",
                  "emoji": "",
                  "say": "How old are you? The answer is: I'm eight."
                },
                {
                  "l": "What's your name?",
                  "r": "I'm Sam.",
                  "emoji": "",
                  "say": "What's your name? The answer is: I'm Sam."
                },
                {
                  "l": "Where do you live?",
                  "r": "In London.",
                  "emoji": "",
                  "say": "Where do you live? The answer is: In London."
                },
                {
                  "l": "What time is it?",
                  "r": "It's three o'clock.",
                  "emoji": "",
                  "say": "What time is it? The answer is: It's three o'clock."
                }
              ],
              "extra": [
                {
                  "r": "It's blue.",
                  "emoji": ""
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "examAcademy",
    "name": "BOSS: L'Esame dell'Accademia",
    "emoji": "🏆",
    "sub": "L'esame finale e il diploma.",
    "games": [
      {
        "key": "examAcademyBoss",
        "emoji": "🏆",
        "title": "L'Esame dell'Accademia",
        "type": "matching",
        "cfg": {
          "diploma": "Diplomato dell'Accademia",
          "hintIt": "Abbina ogni cosa alla risposta giusta e conquista il diploma!",
          "pool": [
            {
              "key": "acadR1Places",
              "it": "Prova 1 — Dove va ogni oggetto? Abbina l'oggetto al posto giusto.",
              "intro": "Match each thing to the right place.",
              "listen": false,
              "pairs": [
                {
                  "l": "a pencil",
                  "r": "classroom",
                  "emoji": "🏫",
                  "say": "A pencil. You use it in the classroom."
                },
                {
                  "l": "some bread",
                  "r": "kitchen",
                  "emoji": "🍳",
                  "say": "Some bread. You find it in the kitchen."
                },
                {
                  "l": "a towel",
                  "r": "bathroom",
                  "emoji": "🛁",
                  "say": "A towel. You need it in the bathroom."
                },
                {
                  "l": "a car",
                  "r": "garage",
                  "emoji": "🚗",
                  "say": "A car. You keep it in the garage."
                }
              ],
              "extra": [
                {
                  "r": "garden",
                  "emoji": "🌳"
                }
              ]
            },
            {
              "key": "acadR2Listen",
              "it": "Prova 2 — Ascolta bene e tocca la figura giusta!",
              "intro": "Now listen and find the right picture. Tap a clue to hear it again.",
              "listen": true,
              "pairs": [
                {
                  "l": "clue 1",
                  "r": "elephant",
                  "emoji": "🐘",
                  "say": "I am a very big grey animal with a long nose. What am I?"
                },
                {
                  "l": "clue 2",
                  "r": "rainbow",
                  "emoji": "🌈",
                  "say": "I have many colours and I come out after the rain. What am I?"
                },
                {
                  "l": "clue 3",
                  "r": "snowman",
                  "emoji": "⛄",
                  "say": "You make me from snow in winter. What am I?"
                },
                {
                  "l": "clue 4",
                  "r": "guitar",
                  "emoji": "🎸",
                  "say": "You play music on me with six strings. What am I?"
                }
              ],
              "extra": [
                {
                  "r": "butterfly",
                  "emoji": "🦋"
                }
              ]
            },
            {
              "key": "acadR3Questions",
              "it": "Prova 3 — Leggi la domanda e scegli la risposta giusta.",
              "intro": "Read each question and choose the right answer.",
              "listen": false,
              "pairs": [
                {
                  "l": "How many legs does a spider have?",
                  "r": "eight",
                  "emoji": "🕷️",
                  "say": "How many legs does a spider have?"
                },
                {
                  "l": "What colour is a banana?",
                  "r": "yellow",
                  "emoji": "🍌",
                  "say": "What colour is a banana?"
                },
                {
                  "l": "Where do fish live?",
                  "r": "in water",
                  "emoji": "🌊",
                  "say": "Where do fish live?"
                },
                {
                  "l": "When do we sleep?",
                  "r": "at night",
                  "emoji": "🌙",
                  "say": "When do we sleep?"
                }
              ],
              "extra": [
                {
                  "r": "on Monday",
                  "emoji": "📅"
                }
              ]
            }
          ]
        }
      }
    ]
  }
];
