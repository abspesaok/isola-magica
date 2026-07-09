/* ═══════════════════════════════════════════════════════════
   ARCIPELAGO 10 · IL GRANDE PALCO (isole 92-101)
   Conversazioni RAMIFICATE con il motore `dialogue`: un grafo di battute in cui
   la risposta scelta decide la battuta successiva del compagno. Scenari di vita
   reale (parco, negozio, scuola, festa, ristorante, dottore, viaggio, casa
   dell'amico, parlare di sé) + BOSS finale con diploma. Nessun fallimento: ogni
   ramo arriva a un finale caloroso. Tutto CHIUSO sul dispositivo — NON è chat AI:
   sono dialoghi scritti, testati e sicuri, generati e ADVERSARIALMENTE validati
   (grafo integro, inglese A2 naturale, italiano corretto, tono gentile).
   ═══════════════════════════════════════════════════════════ */

export const ARC10_ISLANDS = [
  {
    "id": "dlgPark",
    "name": "Al Parco Giochi",
    "emoji": "🛝",
    "sub": "Fare amicizia (conversazione)",
    "games": [
      {
        "key": "dlgPark",
        "emoji": "🛝",
        "title": "Al Parco Giochi",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Mia",
            "emoji": "🧒"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "emoji": "👋",
              "npc": "Hi! I'm Mia. What's your name?",
              "npcIt": "Ciao! Io sono Mia. Come ti chiami?",
              "choices": [
                {
                  "en": "Hi Mia! My name is {name}.",
                  "it": "Ciao Mia! Mi chiamo {name}.",
                  "emoji": "😊",
                  "next": "age"
                },
                {
                  "en": "Hello! I'm {name}. Nice to meet you!",
                  "it": "Ciao! Sono {name}. Piacere di conoscerti!",
                  "emoji": "🤝",
                  "next": "age"
                }
              ]
            },
            "age": {
              "emoji": "🎂",
              "npc": "Nice to meet you, {name}! How old are you?",
              "npcIt": "Piacere di conoscerti, {name}! Quanti anni hai?",
              "choices": [
                {
                  "en": "I'm eight years old. And you?",
                  "it": "Ho otto anni. E tu?",
                  "emoji": "✋",
                  "next": "play"
                },
                {
                  "en": "I'm eight! How old are you, Mia?",
                  "it": "Ho otto anni! Tu quanti ne hai, Mia?",
                  "emoji": "🙋",
                  "next": "play"
                }
              ]
            },
            "play": {
              "emoji": "🎉",
              "npc": "I'm eight too! Do you want to play with me?",
              "npcIt": "Anch'io ho otto anni! Vuoi giocare con me?",
              "choices": [
                {
                  "en": "Yes, please! What can we play?",
                  "it": "Sì, grazie! A cosa possiamo giocare?",
                  "emoji": "😄",
                  "next": "choose"
                },
                {
                  "en": "Yes! Can you pick a game, Mia?",
                  "it": "Sì! Puoi scegliere tu un gioco, Mia?",
                  "emoji": "🤔",
                  "next": "miaPick"
                }
              ]
            },
            "choose": {
              "emoji": "🎮",
              "npc": "Great! We can go on the swings, play ball, or play hide and seek. What do you like?",
              "npcIt": "Che bello! Possiamo andare sull'altalena, giocare a palla o a nascondino. Cosa ti piace?",
              "choices": [
                {
                  "en": "I like the swings!",
                  "it": "Mi piace l'altalena!",
                  "emoji": "🛝",
                  "next": "endSwing"
                },
                {
                  "en": "Let's play ball!",
                  "it": "Giochiamo a palla!",
                  "emoji": "⚽",
                  "next": "endBall"
                },
                {
                  "en": "I love hide and seek!",
                  "it": "Adoro nascondino!",
                  "emoji": "🙈",
                  "next": "endHide"
                }
              ]
            },
            "miaPick": {
              "emoji": "💡",
              "npc": "Okay! I really like hide and seek. Is that okay with you?",
              "npcIt": "Va bene! A me piace tanto nascondino. Per te va bene?",
              "choices": [
                {
                  "en": "Yes, I love hide and seek too!",
                  "it": "Sì, anch'io adoro nascondino!",
                  "emoji": "🙈",
                  "next": "endHide"
                },
                {
                  "en": "Can we play ball instead?",
                  "it": "Possiamo giocare a palla invece?",
                  "emoji": "⚽",
                  "next": "endBall"
                }
              ]
            },
            "endSwing": {
              "emoji": "🛝",
              "npc": "Yay, the swings! Let's go, {name}. This is so much fun!",
              "npcIt": "Evviva, l'altalena! Andiamo, {name}. È divertentissimo!",
              "end": true
            },
            "endBall": {
              "emoji": "⚽",
              "npc": "Ball is my favorite! Here, catch it, {name}! We're friends now!",
              "npcIt": "La palla è la mia preferita! Prendila, {name}! Adesso siamo amici!",
              "end": true
            },
            "endHide": {
              "emoji": "🙈",
              "npc": "Hide and seek, yay! I'll count, you hide, {name}. See you soon, friend!",
              "npcIt": "Nascondino, evviva! Io conto, tu ti nascondi, {name}. A dopo, amico!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgShop",
    "name": "Al Negozio",
    "emoji": "🛒",
    "sub": "Fare la spesa (conversazione)",
    "games": [
      {
        "key": "dlgShop",
        "emoji": "🛒",
        "title": "Al Negozio",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Mr. Green",
            "emoji": "🧑‍🌾"
          },
          "hintIt": "Scegli cosa rispondere! Tocca la tua frase. 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "emoji": "👋",
              "npc": "Hello! Welcome to my fruit shop. What can I get you?",
              "npcIt": "Ciao! Benvenuto al mio negozio di frutta. Cosa ti do?",
              "choices": [
                {
                  "en": "Can I have some apples, please?",
                  "it": "Posso avere delle mele, per favore?",
                  "emoji": "🍎",
                  "next": "howMany"
                },
                {
                  "en": "Can I have some bananas, please?",
                  "it": "Posso avere delle banane, per favore?",
                  "emoji": "🍌",
                  "next": "howMany"
                },
                {
                  "en": "Hello! I'm just looking, thank you.",
                  "it": "Ciao! Sto solo guardando, grazie.",
                  "emoji": "👀",
                  "next": "looking"
                }
              ]
            },
            "looking": {
              "emoji": "🙂",
              "npc": "No problem! My fruit is very fresh today. Would you like to try some?",
              "npcIt": "Nessun problema! La mia frutta oggi è freschissima. Ne vuoi provare un po'?",
              "choices": [
                {
                  "en": "Yes, please. Can I have some oranges?",
                  "it": "Sì, grazie. Posso avere delle arance?",
                  "emoji": "🍊",
                  "next": "howMany"
                },
                {
                  "en": "Maybe next time. Goodbye!",
                  "it": "Forse la prossima volta. Arrivederci!",
                  "emoji": "👋",
                  "next": "endBye"
                }
              ]
            },
            "howMany": {
              "emoji": "🔢",
              "npc": "Great choice! How many would you like?",
              "npcIt": "Ottima scelta! Quante ne vuoi?",
              "choices": [
                {
                  "en": "Three, please.",
                  "it": "Tre, per favore.",
                  "emoji": "3️⃣",
                  "next": "handOver"
                },
                {
                  "en": "Five, please.",
                  "it": "Cinque, per favore.",
                  "emoji": "5️⃣",
                  "next": "handOver"
                }
              ]
            },
            "handOver": {
              "emoji": "🛍️",
              "npc": "Here you are! Anything else, {name}?",
              "npcIt": "Ecco qua! Vuoi altro, {name}?",
              "choices": [
                {
                  "en": "No, thank you. How much is it?",
                  "it": "No, grazie. Quanto viene?",
                  "emoji": "💰",
                  "next": "price"
                },
                {
                  "en": "Yes, please. Can I have an orange too?",
                  "it": "Sì, grazie. Posso avere anche un'arancia?",
                  "emoji": "🍊",
                  "next": "price"
                }
              ]
            },
            "price": {
              "emoji": "💶",
              "npc": "Let me see... that's two euros, please.",
              "npcIt": "Vediamo... sono due euro, per favore.",
              "choices": [
                {
                  "en": "Here you are. Two euros.",
                  "it": "Ecco a lei. Due euro.",
                  "emoji": "🪙",
                  "next": "endThanks"
                },
                {
                  "en": "Can I pay by card, please?",
                  "it": "Posso pagare con la carta, per favore?",
                  "emoji": "💳",
                  "next": "payCard"
                }
              ]
            },
            "payCard": {
              "emoji": "💳",
              "npc": "Of course! The card is fine. Thank you very much!",
              "npcIt": "Certo! La carta va bene. Grazie mille!",
              "choices": [
                {
                  "en": "Thank you! Goodbye, Mr. Green!",
                  "it": "Grazie! Arrivederci, Mr. Green!",
                  "emoji": "😄",
                  "next": "endThanks"
                }
              ]
            },
            "endThanks": {
              "emoji": "🍎",
              "npc": "Thank you, {name}! Enjoy your fruit. See you soon!",
              "npcIt": "Grazie, {name}! Buona frutta. A presto!",
              "end": true
            },
            "endBye": {
              "emoji": "👋",
              "npc": "Goodbye, {name}! Come back any time. Have a lovely day!",
              "npcIt": "Arrivederci, {name}! Torna quando vuoi. Buona giornata!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgSchool",
    "name": "A Scuola",
    "emoji": "🏫",
    "sub": "Un giorno di scuola (conversazione)",
    "games": [
      {
        "key": "dlgSchool",
        "emoji": "🏫",
        "title": "A Scuola",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Miss Bell",
            "emoji": "👩‍🏫"
          },
          "hintIt": "Scegli cosa rispondere, o dillo al microfono! 🎤",
          "start": "greet",
          "nodes": {
            "greet": {
              "emoji": "👩‍🏫",
              "npc": "Good morning! Welcome to class. What's your name?",
              "npcIt": "Buongiorno! Benvenuto in classe. Come ti chiami?",
              "choices": [
                {
                  "en": "Good morning, Miss Bell! I'm {name}.",
                  "it": "Buongiorno, Miss Bell! Sono {name}.",
                  "emoji": "😊",
                  "next": "subject"
                },
                {
                  "en": "Hello! My name is {name}.",
                  "it": "Ciao! Mi chiamo {name}.",
                  "emoji": "👋",
                  "next": "subject"
                }
              ]
            },
            "subject": {
              "emoji": "📚",
              "npc": "Nice to meet you, {name}! What's your favourite subject?",
              "npcIt": "Piacere di conoscerti, {name}! Qual è la tua materia preferita?",
              "choices": [
                {
                  "en": "I love English! It's so much fun.",
                  "it": "Adoro l'inglese! È molto divertente.",
                  "emoji": "📖",
                  "next": "help"
                },
                {
                  "en": "My favourite is art. I like to draw.",
                  "it": "La mia preferita è arte. Mi piace disegnare.",
                  "emoji": "🎨",
                  "next": "help"
                },
                {
                  "en": "I like maths, but it's a bit hard.",
                  "it": "Mi piace matematica, ma è un po' difficile.",
                  "emoji": "🔢",
                  "next": "help"
                }
              ]
            },
            "help": {
              "emoji": "✋",
              "npc": "Great! Now, can you help me hand out the books?",
              "npcIt": "Fantastico! Ora, puoi aiutarmi a distribuire i libri?",
              "choices": [
                {
                  "en": "Yes, of course! Where are the books, please?",
                  "it": "Sì, certo! Dove sono i libri, per favore?",
                  "emoji": "🙌",
                  "next": "question"
                },
                {
                  "en": "Yes! And can I clean the board too?",
                  "it": "Sì! E posso pulire anche la lavagna?",
                  "emoji": "🧽",
                  "next": "eager"
                }
              ]
            },
            "question": {
              "emoji": "🙋",
              "npc": "Thank you, {name}! You're very kind. Do you have a question for me?",
              "npcIt": "Grazie, {name}! Sei molto gentile. Hai una domanda per me?",
              "choices": [
                {
                  "en": "Yes! May I open the window, please?",
                  "it": "Sì! Posso aprire la finestra, per favore?",
                  "emoji": "🪟",
                  "next": "endHelper"
                },
                {
                  "en": "Can you repeat that, please?",
                  "it": "Puoi ripeterlo, per favore?",
                  "emoji": "🔁",
                  "next": "endHelper"
                },
                {
                  "en": "No, thank you. I'm ready to learn!",
                  "it": "No, grazie. Sono pronto a imparare!",
                  "emoji": "🌟",
                  "next": "endReady"
                }
              ]
            },
            "eager": {
              "emoji": "🌟",
              "npc": "How helpful, {name}! Yes, please. Are you ready to start our lesson now?",
              "npcIt": "Che disponibilità, {name}! Sì, grazie. Sei pronto a iniziare la lezione ora?",
              "choices": [
                {
                  "en": "Yes, I'm ready! Let's learn!",
                  "it": "Sì, sono pronto! Impariamo!",
                  "emoji": "📖",
                  "next": "endReady"
                },
                {
                  "en": "Almost! May I get a pencil first, please?",
                  "it": "Quasi! Posso prendere prima una matita, per favore?",
                  "emoji": "✏️",
                  "next": "endHelper"
                }
              ]
            },
            "endHelper": {
              "emoji": "🍎",
              "npc": "What a polite question! You're a wonderful helper, {name}. Let's start our lesson!",
              "npcIt": "Che domanda educata! Sei un aiutante meraviglioso, {name}. Iniziamo la lezione!",
              "end": true
            },
            "endReady": {
              "emoji": "🌟",
              "npc": "That's the spirit, {name}! I'm so glad you're in my class. Have a great school day!",
              "npcIt": "Così si fa, {name}! Sono felice che tu sia nella mia classe. Buona giornata di scuola!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgParty",
    "name": "Alla Festa",
    "emoji": "🎂",
    "sub": "Festa di compleanno (conversazione)",
    "games": [
      {
        "key": "dlgParty",
        "emoji": "🎂",
        "title": "Alla Festa",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Leo",
            "emoji": "🧒"
          },
          "hintIt": "Scegli cosa rispondere a Leo! 🎤",
          "start": "arrive",
          "nodes": {
            "arrive": {
              "emoji": "🎉",
              "npc": "Hi, {name}! Welcome to my birthday party! I'm so happy you're here!",
              "npcIt": "Ciao, {name}! Benvenuto alla mia festa di compleanno! Sono felicissimo che tu sia qui!",
              "choices": [
                {
                  "en": "Happy birthday, Leo!",
                  "it": "Buon compleanno, Leo!",
                  "emoji": "🥳",
                  "next": "present"
                },
                {
                  "en": "Thank you for inviting me!",
                  "it": "Grazie per avermi invitato!",
                  "emoji": "😊",
                  "next": "present"
                }
              ]
            },
            "present": {
              "emoji": "🎁",
              "npc": "Thank you! Ooh, is that a present for me?",
              "npcIt": "Grazie! Ooh, quello è un regalo per me?",
              "choices": [
                {
                  "en": "Yes! This is for you. Open it!",
                  "it": "Sì! Questo è per te. Aprilo!",
                  "emoji": "🎁",
                  "next": "openGift"
                },
                {
                  "en": "Yes, I hope you like it!",
                  "it": "Sì, spero ti piaccia!",
                  "emoji": "🤗",
                  "next": "openGift"
                }
              ]
            },
            "openGift": {
              "emoji": "🧩",
              "npc": "Wow, a puzzle! I love it! Thank you so much! What do you want to do first?",
              "npcIt": "Wow, un puzzle! Mi piace tantissimo! Grazie mille! Cosa vuoi fare per prima cosa?",
              "choices": [
                {
                  "en": "Can we eat some cake?",
                  "it": "Possiamo mangiare la torta?",
                  "emoji": "🍰",
                  "next": "cake"
                },
                {
                  "en": "Can we play a game?",
                  "it": "Possiamo giocare a un gioco?",
                  "emoji": "🎈",
                  "next": "games"
                }
              ]
            },
            "cake": {
              "emoji": "🍰",
              "npc": "Yes! The cake is chocolate. Let's sing and blow out the candles!",
              "npcIt": "Sì! La torta è al cioccolato. Cantiamo e spegniamo le candeline!",
              "choices": [
                {
                  "en": "Yum! The cake is delicious!",
                  "it": "Gnam! La torta è deliziosa!",
                  "emoji": "😋",
                  "next": "thanks"
                },
                {
                  "en": "Can we play a game too?",
                  "it": "Possiamo giocare anche a un gioco?",
                  "emoji": "🎈",
                  "next": "games"
                }
              ]
            },
            "games": {
              "emoji": "🎈",
              "npc": "Great idea! Let's play a game with the balloons! This is so much fun!",
              "npcIt": "Che bella idea! Giochiamo con i palloncini! È così divertente!",
              "choices": [
                {
                  "en": "I'm having a lot of fun!",
                  "it": "Mi sto divertendo un sacco!",
                  "emoji": "🤩",
                  "next": "thanks"
                },
                {
                  "en": "Yes! And the cake looks yummy too!",
                  "it": "Sì! E anche la torta sembra buonissima!",
                  "emoji": "🍰",
                  "next": "thanks"
                }
              ]
            },
            "thanks": {
              "emoji": "💛",
              "npc": "I'm so glad you came, {name}! Are you having a good time?",
              "npcIt": "Sono così contento che tu sia venuto, {name}! Ti stai divertendo?",
              "choices": [
                {
                  "en": "Yes! Thank you for the lovely party.",
                  "it": "Sì! Grazie per la bella festa.",
                  "emoji": "😊",
                  "next": "goodbye"
                },
                {
                  "en": "It's the best party ever!",
                  "it": "È la festa più bella di sempre!",
                  "emoji": "🎉",
                  "next": "goodbye"
                }
              ]
            },
            "goodbye": {
              "emoji": "👋",
              "npc": "Thank you for coming, {name}. I had a great day! See you soon!",
              "npcIt": "Grazie di essere venuto, {name}. Ho passato una giornata bellissima! A presto!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgRestaurant",
    "name": "Al Ristorante",
    "emoji": "🍽️",
    "sub": "Ordinare al ristorante (conversazione)",
    "games": [
      {
        "key": "dlgRestaurant",
        "emoji": "🍽️",
        "title": "Al Ristorante",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Sam",
            "emoji": "🧑‍🍳"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "welcome",
          "nodes": {
            "welcome": {
              "emoji": "🧑‍🍳",
              "npc": "Hello, and welcome! I'm Sam. Are you ready to order, {name}?",
              "npcIt": "Ciao, e benvenuto! Sono Sam. Sei pronto a ordinare, {name}?",
              "choices": [
                {
                  "en": "Yes, please! I'm very hungry.",
                  "it": "Sì, grazie! Ho molta fame.",
                  "emoji": "😋",
                  "next": "food"
                },
                {
                  "en": "Can I see the menu, please?",
                  "it": "Posso vedere il menù, per favore?",
                  "emoji": "📖",
                  "next": "menu"
                }
              ]
            },
            "menu": {
              "emoji": "📖",
              "npc": "Of course! Here is the menu. Take your time, {name}.",
              "npcIt": "Certo! Ecco il menù. Prenditi il tuo tempo, {name}.",
              "choices": [
                {
                  "en": "Thank you! I'm ready now.",
                  "it": "Grazie! Ora sono pronto.",
                  "emoji": "🙂",
                  "next": "food"
                },
                {
                  "en": "What do you like best?",
                  "it": "Cosa ti piace di più?",
                  "emoji": "🤔",
                  "next": "food"
                }
              ]
            },
            "food": {
              "emoji": "🍽️",
              "npc": "Great! What would you like to eat today?",
              "npcIt": "Benissimo! Cosa vorresti mangiare oggi?",
              "choices": [
                {
                  "en": "I'd like a pizza, please.",
                  "it": "Vorrei una pizza, per favore.",
                  "emoji": "🍕",
                  "next": "pizzaPick"
                },
                {
                  "en": "Can I have pasta, please?",
                  "it": "Posso avere la pasta, per favore?",
                  "emoji": "🍝",
                  "next": "pastaPick"
                },
                {
                  "en": "A salad for me, please!",
                  "it": "Un'insalata per me, per favore!",
                  "emoji": "🥗",
                  "next": "saladPick"
                }
              ]
            },
            "pizzaPick": {
              "emoji": "🍕",
              "npc": "A pizza, yum! We make it fresh and hot. And what would you like to drink?",
              "npcIt": "Una pizza, che buono! La facciamo fresca e calda. E cosa vorresti da bere?",
              "choices": [
                {
                  "en": "Water, please.",
                  "it": "Acqua, per favore.",
                  "emoji": "💧",
                  "next": "waitCool"
                },
                {
                  "en": "An orange juice, please.",
                  "it": "Un succo d'arancia, per favore.",
                  "emoji": "🧃",
                  "next": "waitSweet"
                }
              ]
            },
            "pastaPick": {
              "emoji": "🍝",
              "npc": "Pasta is a great choice! And what would you like to drink?",
              "npcIt": "La pasta è un'ottima scelta! E cosa vorresti da bere?",
              "choices": [
                {
                  "en": "Water, please.",
                  "it": "Acqua, per favore.",
                  "emoji": "💧",
                  "next": "waitCool"
                },
                {
                  "en": "An orange juice, please.",
                  "it": "Un succo d'arancia, per favore.",
                  "emoji": "🧃",
                  "next": "waitSweet"
                }
              ]
            },
            "saladPick": {
              "emoji": "🥗",
              "npc": "A salad, how healthy! Well done. And what would you like to drink?",
              "npcIt": "Un'insalata, che scelta sana! Bravo. E cosa vorresti da bere?",
              "choices": [
                {
                  "en": "Water, please.",
                  "it": "Acqua, per favore.",
                  "emoji": "💧",
                  "next": "waitCool"
                },
                {
                  "en": "An orange juice, please.",
                  "it": "Un succo d'arancia, per favore.",
                  "emoji": "🧃",
                  "next": "waitSweet"
                }
              ]
            },
            "waitCool": {
              "emoji": "⏳",
              "npc": "Nice and healthy! Your food is coming right now, {name}.",
              "npcIt": "Bello e sano! Il tuo cibo sta arrivando proprio adesso, {name}.",
              "choices": [
                {
                  "en": "Thank you very much!",
                  "it": "Grazie mille!",
                  "emoji": "🙏",
                  "next": "serve"
                },
                {
                  "en": "Great, I can't wait!",
                  "it": "Fantastico, non vedo l'ora!",
                  "emoji": "😄",
                  "next": "serve"
                }
              ]
            },
            "waitSweet": {
              "emoji": "⏳",
              "npc": "A sweet choice! Your food is coming right now, {name}.",
              "npcIt": "Una scelta dolce! Il tuo cibo sta arrivando proprio adesso, {name}.",
              "choices": [
                {
                  "en": "Thank you very much!",
                  "it": "Grazie mille!",
                  "emoji": "🙏",
                  "next": "serve"
                },
                {
                  "en": "Wow, that was fast!",
                  "it": "Wow, è stato veloce!",
                  "emoji": "😮",
                  "next": "serve"
                }
              ]
            },
            "serve": {
              "emoji": "🍽️",
              "npc": "Here you are! Enjoy your meal. How is it?",
              "npcIt": "Ecco a te! Buon appetito. Com'è?",
              "choices": [
                {
                  "en": "It's delicious! Thank you, Sam.",
                  "it": "È delizioso! Grazie, Sam.",
                  "emoji": "😍",
                  "next": "endYum"
                },
                {
                  "en": "Mmm, it's really nice!",
                  "it": "Mmm, è davvero buono!",
                  "emoji": "😊",
                  "next": "endNice"
                }
              ]
            },
            "endYum": {
              "emoji": "🌟",
              "npc": "I'm so happy you like it, {name}! Come back soon. Bye!",
              "npcIt": "Sono così contento che ti piaccia, {name}! Torna presto. Ciao!",
              "end": true
            },
            "endNice": {
              "emoji": "🎉",
              "npc": "Wonderful! Great job ordering, {name}. See you next time!",
              "npcIt": "Meraviglioso! Bravissimo a ordinare, {name}. Alla prossima!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgDoctor",
    "name": "Dal Dottore",
    "emoji": "🩺",
    "sub": "Dal dottore (conversazione)",
    "games": [
      {
        "key": "dlgDoctor",
        "emoji": "🩺",
        "title": "Dal Dottore",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Dr. Sun",
            "emoji": "👩‍⚕️"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "emoji": "👋",
              "npc": "Hello, {name}! Come in and sit down. How do you feel today?",
              "npcIt": "Ciao, {name}! Entra e siediti. Come ti senti oggi?",
              "choices": [
                {
                  "en": "I don't feel very well.",
                  "it": "Non mi sento molto bene.",
                  "emoji": "😟",
                  "next": "where"
                },
                {
                  "en": "A little bit sick, Doctor.",
                  "it": "Un po' malato/a, Dottoressa.",
                  "emoji": "🤒",
                  "next": "where"
                }
              ]
            },
            "where": {
              "emoji": "🩺",
              "npc": "Oh, I'm sorry to hear that. Don't worry, {name}. Where does it hurt?",
              "npcIt": "Oh, mi dispiace. Non preoccuparti, {name}. Dove ti fa male?",
              "choices": [
                {
                  "en": "My tummy hurts.",
                  "it": "Mi fa male la pancia.",
                  "emoji": "🤕",
                  "next": "tummy"
                },
                {
                  "en": "I have a headache.",
                  "it": "Ho mal di testa.",
                  "emoji": "🤯",
                  "next": "head"
                },
                {
                  "en": "My throat hurts.",
                  "it": "Mi fa male la gola.",
                  "emoji": "😣",
                  "next": "throat"
                }
              ]
            },
            "tummy": {
              "emoji": "🤗",
              "npc": "Let me see. It's not serious, {name}. You should rest and drink some warm water.",
              "npcIt": "Fammi vedere. Non è grave, {name}. Devi riposare e bere un po' d'acqua tiepida.",
              "choices": [
                {
                  "en": "OK, I will rest. Thank you!",
                  "it": "Va bene, riposerò. Grazie!",
                  "emoji": "🛌",
                  "next": "goodbye"
                },
                {
                  "en": "Can I eat some soup?",
                  "it": "Posso mangiare un po' di zuppa?",
                  "emoji": "🍲",
                  "next": "rest"
                }
              ]
            },
            "head": {
              "emoji": "🤗",
              "npc": "Don't worry, {name}. Your head will feel better soon. You should drink water and rest a little.",
              "npcIt": "Non preoccuparti, {name}. La testa starà meglio presto. Devi bere acqua e riposare un po'.",
              "choices": [
                {
                  "en": "OK, I will drink water.",
                  "it": "Va bene, berrò acqua.",
                  "emoji": "💧",
                  "next": "goodbye"
                },
                {
                  "en": "Can I play on my tablet?",
                  "it": "Posso giocare con il tablet?",
                  "emoji": "📱",
                  "next": "rest"
                }
              ]
            },
            "throat": {
              "emoji": "🤗",
              "npc": "Open wide, please. Good! It's just a little sore, {name}. Drink warm water and rest your voice.",
              "npcIt": "Apri bene la bocca, per favore. Bene! È solo un po' irritata, {name}. Bevi acqua tiepida e riposa la voce.",
              "choices": [
                {
                  "en": "Thank you, Doctor Sun!",
                  "it": "Grazie, Dottoressa Sun!",
                  "emoji": "😊",
                  "next": "goodbye"
                },
                {
                  "en": "Can I have some warm tea?",
                  "it": "Posso bere un tè caldo?",
                  "emoji": "🍵",
                  "next": "rest"
                }
              ]
            },
            "rest": {
              "emoji": "🛌",
              "npc": "Good idea, {name}! Rest at home today and drink lots of water. You will feel much better tomorrow!",
              "npcIt": "Buona idea, {name}! Riposa a casa oggi e bevi tanta acqua. Domani starai molto meglio!",
              "choices": [
                {
                  "en": "OK! Thank you so much.",
                  "it": "Va bene! Grazie mille.",
                  "emoji": "🙏",
                  "next": "goodbye"
                },
                {
                  "en": "I feel better already!",
                  "it": "Mi sento già meglio!",
                  "emoji": "😄",
                  "next": "happy"
                }
              ]
            },
            "goodbye": {
              "emoji": "👋",
              "npc": "You're welcome, {name}. Take care of yourself and get well soon! Goodbye!",
              "npcIt": "Prego, {name}. Abbi cura di te e guarisci presto! Ciao!",
              "end": true
            },
            "happy": {
              "emoji": "🌈",
              "npc": "That's wonderful, {name}! A smile is good medicine too. Get well soon and see you next time!",
              "npcIt": "Che bello, {name}! Anche un sorriso è una buona medicina. Guarisci presto e alla prossima!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgTravel",
    "name": "In Viaggio",
    "emoji": "✈️",
    "sub": "Chiedere la strada (conversazione)",
    "games": [
      {
        "key": "dlgTravel",
        "emoji": "✈️",
        "title": "In Viaggio",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Ann",
            "emoji": "🧭"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "npc": "Hi {name}! You look lost. Where do you want to go?",
              "npcIt": "Ciao {name}! Sembri perso. Dove vuoi andare?",
              "emoji": "🧭",
              "choices": [
                {
                  "en": "Excuse me, where is the station?",
                  "it": "Scusa, dov'è la stazione?",
                  "emoji": "🚉",
                  "next": "station"
                },
                {
                  "en": "How do I get to the museum?",
                  "it": "Come arrivo al museo?",
                  "emoji": "🏛️",
                  "next": "museum"
                },
                {
                  "en": "I want to go to the beach!",
                  "it": "Voglio andare in spiaggia!",
                  "emoji": "🏖️",
                  "next": "beach"
                }
              ]
            },
            "station": {
              "npc": "The station? Go straight on and turn left. It's next to the park.",
              "npcIt": "La stazione? Vai dritto e gira a sinistra. È vicino al parco.",
              "emoji": "🚉",
              "choices": [
                {
                  "en": "Is it far from here?",
                  "it": "È lontano da qui?",
                  "emoji": "📏",
                  "next": "notFar"
                },
                {
                  "en": "Can I take a bus?",
                  "it": "Posso prendere un autobus?",
                  "emoji": "🚌",
                  "next": "bus"
                },
                {
                  "en": "Thank you very much!",
                  "it": "Grazie mille!",
                  "emoji": "🙏",
                  "next": "endWarm"
                }
              ]
            },
            "museum": {
              "npc": "The museum is easy! Take the number five bus. It stops right there.",
              "npcIt": "Il museo è facile! Prendi l'autobus numero cinque. Si ferma proprio lì.",
              "emoji": "🏛️",
              "choices": [
                {
                  "en": "Can I take a bus?",
                  "it": "Posso prendere un autobus?",
                  "emoji": "🚌",
                  "next": "bus"
                },
                {
                  "en": "Thank you very much!",
                  "it": "Grazie mille!",
                  "emoji": "🙏",
                  "next": "endWarm"
                }
              ]
            },
            "beach": {
              "npc": "The beach is lovely! You can take the train. Do you need a ticket?",
              "npcIt": "La spiaggia è bellissima! Puoi prendere il treno. Ti serve un biglietto?",
              "emoji": "🏖️",
              "choices": [
                {
                  "en": "Yes, one ticket, please.",
                  "it": "Sì, un biglietto, per favore.",
                  "emoji": "🎫",
                  "next": "ticket"
                },
                {
                  "en": "Is it far from here?",
                  "it": "È lontano da qui?",
                  "emoji": "📏",
                  "next": "notFar"
                }
              ]
            },
            "bus": {
              "npc": "Yes! The bus stop is over there. The bus comes in five minutes.",
              "npcIt": "Sì! La fermata dell'autobus è laggiù. L'autobus arriva tra cinque minuti.",
              "emoji": "🚌",
              "choices": [
                {
                  "en": "Do I need a ticket?",
                  "it": "Mi serve un biglietto?",
                  "emoji": "🎫",
                  "next": "ticket"
                },
                {
                  "en": "Great, thank you!",
                  "it": "Fantastico, grazie!",
                  "emoji": "😄",
                  "next": "endWarm"
                }
              ]
            },
            "ticket": {
              "npc": "Here is your ticket. Have a wonderful trip, {name}!",
              "npcIt": "Ecco il tuo biglietto. Buon viaggio, {name}!",
              "emoji": "🎫",
              "choices": [
                {
                  "en": "Thank you very much!",
                  "it": "Grazie mille!",
                  "emoji": "🙏",
                  "next": "endWarm"
                },
                {
                  "en": "You are so kind!",
                  "it": "Sei molto gentile!",
                  "emoji": "🤗",
                  "next": "endKind"
                }
              ]
            },
            "notFar": {
              "npc": "No, it's not far. Just five minutes on foot. You can't miss it!",
              "npcIt": "No, non è lontano. Solo cinque minuti a piedi. Non puoi sbagliare!",
              "emoji": "📏",
              "choices": [
                {
                  "en": "Perfect, thank you!",
                  "it": "Perfetto, grazie!",
                  "emoji": "👌",
                  "next": "endWarm"
                },
                {
                  "en": "You are so kind!",
                  "it": "Sei molto gentile!",
                  "emoji": "🤗",
                  "next": "endKind"
                }
              ]
            },
            "endWarm": {
              "npc": "You're welcome, {name}! Have a safe trip and see you soon!",
              "npcIt": "Prego, {name}! Buon viaggio e a presto!",
              "emoji": "👋",
              "end": true
            },
            "endKind": {
              "npc": "Aw, thank you! Helping travellers makes me happy. Bye, {name}!",
              "npcIt": "Oh, grazie! Aiutare i viaggiatori mi rende felice. Ciao, {name}!",
              "emoji": "😊",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgPlaydate",
    "name": "A Casa dell'Amico",
    "emoji": "🏠",
    "sub": "Giocare da un amico (conversazione)",
    "games": [
      {
        "key": "dlgPlaydate",
        "emoji": "🏠",
        "title": "A Casa dell'Amico",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Emma",
            "emoji": "👧"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "emoji": "👋",
              "npc": "Hi {name}! Come in! I'm so happy you're here!",
              "npcIt": "Ciao {name}! Entra! Sono così felice che tu sia qui!",
              "choices": [
                {
                  "en": "Hi Emma! Thank you for inviting me!",
                  "it": "Ciao Emma! Grazie per avermi invitato!",
                  "emoji": "😊",
                  "next": "toys"
                },
                {
                  "en": "Hello! Your house is really nice!",
                  "it": "Ciao! La tua casa è davvero bella!",
                  "emoji": "🏡",
                  "next": "toys"
                }
              ]
            },
            "toys": {
              "emoji": "🧸",
              "npc": "Let's play! What do you want to do first?",
              "npcIt": "Giochiamo! Cosa vuoi fare prima?",
              "choices": [
                {
                  "en": "Can we build with blocks?",
                  "it": "Possiamo costruire con i mattoncini?",
                  "emoji": "🧱",
                  "next": "blocks"
                },
                {
                  "en": "Let's draw pictures together!",
                  "it": "Disegniamo insieme!",
                  "emoji": "🎨",
                  "next": "draw"
                },
                {
                  "en": "I'd love to play a board game!",
                  "it": "Mi piacerebbe fare un gioco da tavolo!",
                  "emoji": "🎲",
                  "next": "boardgame"
                }
              ]
            },
            "blocks": {
              "emoji": "🧱",
              "npc": "Yes! I have lots of blocks. Can we share them?",
              "npcIt": "Sì! Ho tanti mattoncini. Possiamo dividerli?",
              "choices": [
                {
                  "en": "Of course! Here, you take some too.",
                  "it": "Certo! Tieni, prendine anche tu.",
                  "emoji": "🤝",
                  "next": "snack"
                },
                {
                  "en": "Sure! Let's build a big castle!",
                  "it": "Certo! Costruiamo un castello grande!",
                  "emoji": "🏰",
                  "next": "snack"
                }
              ]
            },
            "draw": {
              "emoji": "🎨",
              "npc": "Great idea! Can I use the red pencil, please?",
              "npcIt": "Che bella idea! Posso usare la matita rossa, per favore?",
              "choices": [
                {
                  "en": "Yes, here you are! Sharing is fun.",
                  "it": "Sì, ecco a te! Condividere è bello.",
                  "emoji": "😊",
                  "next": "snack"
                },
                {
                  "en": "Sure! Let's draw a happy sun.",
                  "it": "Certo! Disegniamo un sole felice.",
                  "emoji": "☀️",
                  "next": "snack"
                }
              ]
            },
            "boardgame": {
              "emoji": "🎲",
              "npc": "Fun! I love board games. Do you want to go first?",
              "npcIt": "Che bello! Adoro i giochi da tavolo. Vuoi iniziare tu?",
              "choices": [
                {
                  "en": "You can go first! I'll wait my turn.",
                  "it": "Puoi iniziare tu! Aspetto il mio turno.",
                  "emoji": "🙂",
                  "next": "snack"
                },
                {
                  "en": "Let's play and have fun together!",
                  "it": "Giochiamo e divertiamoci insieme!",
                  "emoji": "🎉",
                  "next": "snack"
                }
              ]
            },
            "snack": {
              "emoji": "🍎",
              "npc": "Playing is fun! Would you like a snack?",
              "npcIt": "Giocare è divertente! Vuoi uno spuntino?",
              "choices": [
                {
                  "en": "Yes, please! Can I have an apple?",
                  "it": "Sì, grazie! Posso avere una mela?",
                  "emoji": "🍎",
                  "next": "goodbye"
                },
                {
                  "en": "Yes, please! Can I have some cookies?",
                  "it": "Sì, grazie! Posso avere dei biscotti?",
                  "emoji": "🍪",
                  "next": "goodbye"
                },
                {
                  "en": "No, thank you. But thanks for playing!",
                  "it": "No, grazie. Ma grazie per aver giocato con me!",
                  "emoji": "🙂",
                  "next": "goodbyeNoSnack"
                }
              ]
            },
            "goodbye": {
              "emoji": "🌈",
              "npc": "Yummy! Thank you for playing with me, {name}. Come again soon!",
              "npcIt": "Che buono! Grazie per aver giocato con me, {name}. Torna presto!",
              "end": true
            },
            "goodbyeNoSnack": {
              "emoji": "💛",
              "npc": "You're so polite, {name}! I had a lovely day. See you soon!",
              "npcIt": "Sei così gentile, {name}! Ho passato una bella giornata. A presto!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "dlgAboutMe",
    "name": "Parlami di Te",
    "emoji": "🎤",
    "sub": "Parlare di te (conversazione)",
    "games": [
      {
        "key": "dlgAboutMe",
        "emoji": "🎤",
        "title": "Parlami di Te",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Robo",
            "emoji": "🤖"
          },
          "hintIt": "Scegli cosa rispondere! 🎤",
          "start": "hello",
          "nodes": {
            "hello": {
              "emoji": "🤖",
              "npc": "Hi! I am Robo. What is your name?",
              "npcIt": "Ciao! Io sono Robo. Come ti chiami?",
              "choices": [
                {
                  "en": "My name is {name}.",
                  "it": "Mi chiamo {name}.",
                  "emoji": "😊",
                  "next": "age"
                },
                {
                  "en": "I am {name}! Nice to meet you.",
                  "it": "Sono {name}! Piacere di conoscerti.",
                  "emoji": "👋",
                  "next": "age"
                }
              ]
            },
            "age": {
              "emoji": "🎂",
              "npc": "Nice to meet you, {name}! How old are you?",
              "npcIt": "Piacere di conoscerti, {name}! Quanti anni hai?",
              "choices": [
                {
                  "en": "I am eight years old.",
                  "it": "Ho otto anni.",
                  "emoji": "8️⃣",
                  "next": "family"
                },
                {
                  "en": "I am nine years old.",
                  "it": "Ho nove anni.",
                  "emoji": "9️⃣",
                  "next": "family"
                }
              ]
            },
            "family": {
              "emoji": "👨‍👩‍👧",
              "npc": "Cool! Tell me about your family. Who do you live with?",
              "npcIt": "Fantastico! Parlami della tua famiglia. Con chi vivi?",
              "choices": [
                {
                  "en": "I live with my mum, dad and my sister.",
                  "it": "Vivo con la mia mamma, il mio papà e mia sorella.",
                  "emoji": "👪",
                  "next": "pet"
                },
                {
                  "en": "I live with my mum, dad and my brother.",
                  "it": "Vivo con la mia mamma, il mio papà e mio fratello.",
                  "emoji": "👦",
                  "next": "pet"
                }
              ]
            },
            "pet": {
              "emoji": "🐾",
              "npc": "That's a lovely family! Do you have a pet?",
              "npcIt": "Che bella famiglia! Hai un animale domestico?",
              "choices": [
                {
                  "en": "Yes! I have a dog.",
                  "it": "Sì! Ho un cane.",
                  "emoji": "🐶",
                  "next": "petDog"
                },
                {
                  "en": "Yes, I have a cat.",
                  "it": "Sì, ho un gatto.",
                  "emoji": "🐱",
                  "next": "petCat"
                },
                {
                  "en": "No, but I want a rabbit one day.",
                  "it": "No, ma un giorno vorrei un coniglio.",
                  "emoji": "🐰",
                  "next": "petRabbit"
                }
              ]
            },
            "petDog": {
              "emoji": "🐶",
              "npc": "A dog! Does your dog like to play?",
              "npcIt": "Un cane! Al tuo cane piace giocare?",
              "choices": [
                {
                  "en": "Yes, we play in the park every day.",
                  "it": "Sì, giochiamo al parco ogni giorno.",
                  "emoji": "🌳",
                  "next": "hobby"
                },
                {
                  "en": "Yes, he runs so fast!",
                  "it": "Sì, corre velocissimo!",
                  "emoji": "💨",
                  "next": "hobby"
                }
              ]
            },
            "petCat": {
              "emoji": "🐱",
              "npc": "A cat! Is your cat friendly?",
              "npcIt": "Un gatto! Il tuo gatto è affettuoso?",
              "choices": [
                {
                  "en": "Yes, she sleeps on my bed.",
                  "it": "Sì, dorme sul mio letto.",
                  "emoji": "🛏️",
                  "next": "hobby"
                },
                {
                  "en": "Yes, she is very soft and cuddly.",
                  "it": "Sì, è morbidissimo e coccoloso.",
                  "emoji": "🥰",
                  "next": "hobby"
                }
              ]
            },
            "petRabbit": {
              "emoji": "🐰",
              "npc": "A rabbit would be great! What colour rabbit do you want?",
              "npcIt": "Un coniglio sarebbe bellissimo! Di che colore lo vorresti?",
              "choices": [
                {
                  "en": "A white one with long ears.",
                  "it": "Uno bianco con le orecchie lunghe.",
                  "emoji": "🤍",
                  "next": "hobby"
                },
                {
                  "en": "A brown one, very small.",
                  "it": "Uno marrone, piccolissimo.",
                  "emoji": "🤎",
                  "next": "hobby"
                }
              ]
            },
            "hobby": {
              "emoji": "⭐",
              "npc": "Great! What do you like to do? Tell me a hobby!",
              "npcIt": "Bene! Cosa ti piace fare? Dimmi un hobby!",
              "choices": [
                {
                  "en": "I like playing football.",
                  "it": "Mi piace giocare a calcio.",
                  "emoji": "⚽",
                  "next": "colour"
                },
                {
                  "en": "I like drawing pictures.",
                  "it": "Mi piace disegnare.",
                  "emoji": "🎨",
                  "next": "colour"
                },
                {
                  "en": "I like reading books.",
                  "it": "Mi piace leggere libri.",
                  "emoji": "📚",
                  "next": "colour"
                }
              ]
            },
            "colour": {
              "emoji": "🌈",
              "npc": "So fun! What is your favourite colour and food?",
              "npcIt": "Che divertimento! Qual è il tuo colore preferito e il tuo cibo preferito?",
              "choices": [
                {
                  "en": "My favourite colour is blue and I love pizza.",
                  "it": "Il mio colore preferito è il blu e adoro la pizza.",
                  "emoji": "🍕",
                  "next": "endPizza"
                },
                {
                  "en": "My favourite colour is red and I love pasta.",
                  "it": "Il mio colore preferito è il rosso e adoro la pasta.",
                  "emoji": "🍝",
                  "next": "endPasta"
                },
                {
                  "en": "My favourite colour is green and I love ice cream.",
                  "it": "Il mio colore preferito è il verde e adoro il gelato.",
                  "emoji": "🍦",
                  "next": "endIceCream"
                }
              ]
            },
            "endPizza": {
              "emoji": "🍕",
              "npc": "Yummy, pizza! Thank you for talking with me, {name}. You speak English so well! Bye bye!",
              "npcIt": "Che buona, la pizza! Grazie per aver parlato con me, {name}. Parli inglese benissimo! Ciao ciao!",
              "end": true
            },
            "endPasta": {
              "emoji": "🍝",
              "npc": "Pasta is the best! It was so nice to meet you, {name}. Great job speaking English! See you soon!",
              "npcIt": "La pasta è la migliore! È stato bellissimo conoscerti, {name}. Ottimo lavoro con l'inglese! A presto!",
              "end": true
            },
            "endIceCream": {
              "emoji": "🍦",
              "npc": "Mmm, ice cream! You are a wonderful friend, {name}. You told me all about yourself in English. Well done! Bye!",
              "npcIt": "Mmm, il gelato! Sei un amico meraviglioso, {name}. Mi hai raccontato tutto di te in inglese. Bravissimo! Ciao!",
              "end": true
            }
          }
        }
      }
    ]
  },
  {
    "id": "showBoss",
    "name": "BOSS: Il Grande Spettacolo",
    "emoji": "🌟",
    "sub": "Il gran finale e il diploma.",
    "games": [
      {
        "key": "showBossDialogue",
        "emoji": "🌟",
        "title": "Il Grande Spettacolo",
        "type": "dialogue",
        "cfg": {
          "companion": {
            "name": "Milo",
            "emoji": "🎩"
          },
          "diploma": "Star del Grande Palco",
          "hintIt": "Sei sul palco! Scegli cosa rispondere 🎤",
          "start": "welcome",
          "nodes": {
            "welcome": {
              "emoji": "🎤",
              "npc": "Welcome to the big show! I'm Milo, your host. How are you tonight?",
              "npcIt": "Benvenuto al grande spettacolo! Sono Milo, il presentatore. Come stai stasera?",
              "choices": [
                {
                  "en": "I'm great, thank you!",
                  "it": "Sto benissimo, grazie!",
                  "emoji": "😄",
                  "next": "name"
                },
                {
                  "en": "I'm a bit nervous!",
                  "it": "Sono un po' emozionato!",
                  "emoji": "😅",
                  "next": "reassure"
                },
                {
                  "en": "I'm so happy to be here!",
                  "it": "Sono felicissimo di essere qui!",
                  "emoji": "🤩",
                  "next": "name"
                }
              ]
            },
            "reassure": {
              "emoji": "🤗",
              "npc": "Don't worry, you're a star! Take a deep breath. What's your name?",
              "npcIt": "Non preoccuparti, sei una star! Fai un bel respiro. Come ti chiami?",
              "choices": [
                {
                  "en": "My name is {name}!",
                  "it": "Mi chiamo {name}!",
                  "emoji": "🙋",
                  "next": "from"
                },
                {
                  "en": "I'm {name}, nice to meet you!",
                  "it": "Sono {name}, piacere di conoscerti!",
                  "emoji": "🤝",
                  "next": "from"
                }
              ]
            },
            "name": {
              "emoji": "✨",
              "npc": "Wonderful! Tell everyone: what's your name?",
              "npcIt": "Fantastico! Di' a tutti: come ti chiami?",
              "choices": [
                {
                  "en": "My name is {name}!",
                  "it": "Mi chiamo {name}!",
                  "emoji": "🙋",
                  "next": "from"
                },
                {
                  "en": "I'm {name}, nice to meet you!",
                  "it": "Sono {name}, piacere di conoscerti!",
                  "emoji": "🤝",
                  "next": "from"
                }
              ]
            },
            "from": {
              "emoji": "🌍",
              "npc": "Nice to meet you, {name}! Where are you from?",
              "npcIt": "Piacere di conoscerti, {name}! Di dove sei?",
              "choices": [
                {
                  "en": "I'm from Italy!",
                  "it": "Sono italiano!",
                  "emoji": "🇮🇹",
                  "next": "likes"
                },
                {
                  "en": "I'm from a magic island!",
                  "it": "Vengo da un'isola magica!",
                  "emoji": "🏝️",
                  "next": "likes"
                },
                {
                  "en": "I'm from a small town.",
                  "it": "Vengo da una piccola città.",
                  "emoji": "🏘️",
                  "next": "likes"
                }
              ]
            },
            "likes": {
              "emoji": "💖",
              "npc": "How lovely! Now tell me, {name}, what do you like?",
              "npcIt": "Che bello! Ora dimmi, {name}, cosa ti piace?",
              "choices": [
                {
                  "en": "I like music and singing!",
                  "it": "Mi piace la musica e cantare!",
                  "emoji": "🎶",
                  "next": "talentSing"
                },
                {
                  "en": "I like sports and playing!",
                  "it": "Mi piacciono lo sport e giocare!",
                  "emoji": "⚽",
                  "next": "talentSport"
                },
                {
                  "en": "I like reading and animals!",
                  "it": "Mi piace leggere e gli animali!",
                  "emoji": "📚",
                  "next": "talentQuiet"
                }
              ]
            },
            "talentSing": {
              "emoji": "🎵",
              "npc": "Amazing! Can you sing a little song for us?",
              "npcIt": "Fantastico! Puoi cantare una piccola canzone per noi?",
              "choices": [
                {
                  "en": "Yes! La la la la la!",
                  "it": "Sì! La la la la la!",
                  "emoji": "🎤",
                  "next": "finale"
                },
                {
                  "en": "Maybe next time!",
                  "it": "Magari la prossima volta!",
                  "emoji": "😊",
                  "next": "finale"
                }
              ]
            },
            "talentSport": {
              "emoji": "🏆",
              "npc": "Wow! What is your favourite sport?",
              "npcIt": "Wow! Qual è il tuo sport preferito?",
              "choices": [
                {
                  "en": "I love football!",
                  "it": "Adoro il calcio!",
                  "emoji": "⚽",
                  "next": "finale"
                },
                {
                  "en": "I love swimming!",
                  "it": "Adoro il nuoto!",
                  "emoji": "🏊",
                  "next": "finale"
                }
              ]
            },
            "talentQuiet": {
              "emoji": "🐾",
              "npc": "Lovely! What's your favourite animal?",
              "npcIt": "Che bello! Qual è il tuo animale preferito?",
              "choices": [
                {
                  "en": "I love cats!",
                  "it": "Adoro i gatti!",
                  "emoji": "🐱",
                  "next": "finale"
                },
                {
                  "en": "I love dogs!",
                  "it": "Adoro i cani!",
                  "emoji": "🐶",
                  "next": "finale"
                }
              ]
            },
            "finale": {
              "emoji": "👏",
              "npc": "What a wonderful star! The audience loves you, {name}! Are you ready for your big bow?",
              "npcIt": "Che star meravigliosa! Il pubblico ti adora, {name}! Sei pronto per il tuo grande inchino?",
              "choices": [
                {
                  "en": "Yes! Thank you, everyone!",
                  "it": "Sì! Grazie a tutti!",
                  "emoji": "🙇",
                  "next": "bowThanks"
                },
                {
                  "en": "Goodbye and thank you, Milo!",
                  "it": "Arrivederci e grazie, Milo!",
                  "emoji": "👋",
                  "next": "bowBye"
                }
              ]
            },
            "bowThanks": {
              "emoji": "🌟",
              "npc": "Bravo, {name}! You are the Star of the Big Stage! Take a bow — the show is yours!",
              "npcIt": "Bravo, {name}! Sei la Star del Grande Palco! Fai un inchino: lo spettacolo è tuo!",
              "end": true
            },
            "bowBye": {
              "emoji": "🎉",
              "npc": "Goodbye, {name}, our shining star! Thank you for a magical show. Well done!",
              "npcIt": "Arrivederci, {name}, nostra stella splendente! Grazie per uno spettacolo magico. Bravissimo!",
              "end": true
            }
          }
        }
      }
    ]
  }
];
