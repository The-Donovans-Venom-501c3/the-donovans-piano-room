export interface Lesson {
    id: string;
    title: string;
    description: string;
    duration: string;
    meta: string;
    thumbnailUrl: string;
    youtubeId: string;
  }
  
  export const lessons: Lesson[] = [
    {
      id: 'lesson-1',
      title: 'Lesson 1 - Your First Lesson! Welcome!',
      description: 'Your First Lesson is here! WOW! \n Welcome to "The Donovan\'s Piano Room! \n Plus we will dive into understanding the keyboard!',
      duration: '12 mins',
      meta: '64 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson1.jpg',
      youtubeId:'Mwt9f9H7dsE?si=XhOP43JQoQvBNj2P"'
    },
    {
      id: 'lesson-2',
      title: 'Lesson 2 – The Fingers (how we organize our fingers on piano)',
      description: 'Video 2. The Fingers (how we organize our fingers on the piano)',
      duration: '3 mins',
      meta: '14 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson2.jpg',
      youtubeId:'pjPtfQaG6Ww?si=gg00-bDhV4B_XZ1S'
    },
    {
      id: 'lesson-3',
      title: 'Lesson 3 – What song is this!? Page 6 7',
      description: 'Lesson three of The Donovans Piano Room What song is this!? Page 6 7',
      duration: '7 mins',
      meta: '11 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson3.jpg',
      youtubeId:'y98a1FxtrnI?si=AhQChyY9PR3ev5Rr'
    },
    {
      id: 'lesson-4',
      title: 'Lesson 4 – Rhythm 1',
      description: 'Here is our very first video about rhythm, this will teach you everything you need to know about the fundamentals of rhythm from the very beginning.',
      duration: '16 mins',
      meta: '23 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson4.jpg',
      youtubeId:'3VLOqBLhG6w?si=UQK26llMwaBTMLvq'
    },
    {
      id: 'lesson-5',
      title: 'Lesson 5 – Rhythm 2.0. Rest.',
      description: 'Here we learn all about rest. This is a continuation of simple Rhythms.',
      duration: '5 mins',
      meta: '7 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson5.jpg',
      youtubeId:'PakhGVWLJDk?si=bfhUHfefJBJXPQw_'
    },
    {
      id: 'lesson-6',
      title: 'Lesson 6 – The Musical Staff. Treble Clef, Bass Clef.',
      description: 'Learn about The Musical Staff. Treble Clef, Bass Clef.',
      duration: '3 mins',
      meta: '12 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson6.jpg',
      youtubeId:'8U51qwLXIgY?si=6f62r4GzV-FtuGJq'
    },
    {
      id: 'lesson-7',
      title: 'Lesson 7 – SEE THE SEA',
      description: 'In this video we break down everything you need to know about See The Sea! its a great excersis to study both your rhythmic values and the active notes and rests. Enjoy',
      duration: '8 mins',
      meta: '5 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson7.jpg',
      youtubeId:'pAEUB8syoOY?si=A2LjmUFodAJB00He'
    },
    {
      id: 'lesson-8',
      title: 'Lesson 8 – PAGE SEVEN REVIEW',
      description: 'This is a detailed review of page seven "What song is this"',
      duration: '10 mins',
      meta: '6 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson8.jpg',
      youtubeId:'kET58TxsAgY?si=014bdUmv5jDC3S8_'
    },
    {
      id: 'lesson-9',
      title: 'Lesson 9 – PAGE SIX REVIEW',
      description: 'This is a detailed review of page six!',
      duration: '10 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson9.jpg',
      youtubeId:'qbjGfmKD1qs?si=Uc8CO60ho1hOg5R6'
    },
    {
      id: 'lesson-10',
      title: 'Lesson 10 – Reading music 1 & Intro to music games',
      description: 'Reading music 1 & Intro to music games. Here we learn all about reading music and then we learn to play the music games to test our skills.',
      duration: '10 mins',
      meta: '7 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson10.jpg',
      youtubeId:'eIt15v4qTlY?si=IyitYeUAscQZuuSD'
    },
    {
      id: 'lesson-11',
      title: 'Lesson 11 – Time Signatrue (Question) Breaking down various rhythms in particular time signatures',
      description: 'In the video we are Breaking down various rhythms in particular time signatures. The original question was if we are in 4/4 time signature can there be other notes besides the quater note? ',
      duration: '3 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson11.jpg',
      youtubeId:'m_K0LZKYGVQ?si=FGrmOeDvqwI-J1Bk'
    },
    {
      id: 'lesson-12',
      title: 'Lesson 12 – Time Signature (2) Bottom number and full overview.',
      description: 'This is our Time Signature 2 Bottom number and full overview. We will go over the bottom number on our time signature and review the time signature as a whoel from top to bottom.',
      duration: '13 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson12.jpg',
      youtubeId:'1rovZWWwClA?si=_A6ztQ3AiQEbX1Yn'
    },
    {
      id: 'lesson-13',
      title: 'Lesson 13 – TIME SIGNATURE 1',
      description: 'time signature one is a video that explains the basic fundamentals of the time signature, we start from the begining. we do an over view of time sigantures and explore the top number, to learn more continue onto time signature 2.',
      duration: '7 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson13.jpg',
      youtubeId:'POthMAfx3fI?si=dnXSqgyHbuXUMtc5'
    },
    {
      id: 'lesson-14',
      title: 'Lesson 14 – Sight Reading 2: The Grand Staff',
      description: 'in Sight Reading 2: The Grand Staff, we are taking our time to learn the ins and outs of reading the entire grand staff from bottom to top. Slow and steady wins the race, this lesson is quite easy if you take your time and study daily.',
      duration: '12 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson14.jpg',
      youtubeId:'dSUYZyoOP_0?si=uDOlx_WSJQoMYhkM'
    },
    {
      id: 'lesson-15',
      title: 'Lesson 15 – Whole steps and Half Steps: 2.',
      description: 'Whole steps and Half Steps: 2. Testing your knowledge on whole steps and half steps.',
      duration: '5 mins',
      meta: '3 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson15.jpg',
      youtubeId:'F0vHKqAz2KM?si=I9WjBlEcxcMI3j_O'
    },
    {
      id: 'lesson-16',
      title: 'Lesson 16 – Whole Steps and Half Step.',
      description: 'Whole Steps and Half Steps! Let\'s learn the fundamentals of whole steps and half steps. Its simple a whole step is two half steps in the same direction, and a half step is the closest note to the right or the left.',
      duration: '5 mins',
      meta: '12 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson16.jpg',
      youtubeId:'5TwA4UZ5Eng?si=xApMOS8mvOelIvFK'
    },
    {
      id: 'lesson-17',
      title: 'Lesson 17 – The Scale Formula!',
      description: 'The Scale Formula! Tonic whole whole half, whole whole whole half.',
      duration: '4 mins',
      meta: '5 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson17.jpg',
      youtubeId:'xG9EB_CfoeA?si=evWFvtzilsPUuI_K'
    },
    {
      id: 'lesson-18',
      title: 'Lesson 18 – The Scale Formula 2',
      description: 'The Scale Formula 2 a continuation of the scale formula we dig into the octave scale and the pentascale :)',
      duration: '4 mins',
      meta: '7 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson18.jpg',
      youtubeId:'12Z4TsP8inI?si=EP_LBCoJOzpM8-QQ'
    },
    {
      id: 'lesson-19',
      title: 'Lesson 19 – Breaking down the Five Finger Pattern',
      description: 'Breaking down the Five Finger Pattern in this lesson we are breaking down the five finger pattern.',
      duration: '8 mins',
      meta: '7 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson19.jpg',
      youtubeId:'oKp8SmXEJSA?si=NwrwoROOHEXhi13u'
    },
    {
      id: 'lesson-20',
      title: 'Lesson 20 – The Five Finger Pattern (really breaking it down)',
      description: 'The Five Finger Patter (really breaking it down) We need to understand the five fiver pattern and in order to do so we can watch these videos here.',
      duration: '8 mins',
      meta: '6 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson20.jpg',
      youtubeId:'G01oVoCZazw?si=6adDT_4-q4N3Yxik'
    },
    {
      id: 'lesson-21',
      title: 'Lesson 21 – The Five finger Pattern on the staff',
      description: 'The Five finger Pattern on the staff is something that we are discussing today, We want to break down the staff in order to recognize shapes and patters. Our scales is one of the easiest things we can begin to recognize.',
      duration: '6 mins',
      meta: '3 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson21.jpg',
      youtubeId:'xJ3a8rH5Vn0?si=P5d2W2jBzOJ362L5'
    },
    {
      id: 'lesson-22',
      title: 'Lesson 22 – How to use the scale formula! Pentescale (Five Finger Pattern)',
      description: 'How to use the scale formula! We are dealing the the pentescale (Five Finger Pattern) on the keyboard. We are going to break down a specific example of how to use the scale formula. E major is the example we used.',
      duration: '8 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson22.jpg',
      youtubeId:'9uSiBunBNdg?si=oWein9vwCUkx36q6'
    },
    {
      id: 'lesson-23',
      title: 'Lesson 23 – The Pentacle Showcased on the piano',
      description: 'The Pentacle Showcased on the piano! Learn how to do the five-finger pattern on piano! :) ',
      duration: '3 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson23.jpg',
      youtubeId:'hRCyxrdCpnM?si=za8UZrlhvcDRN7G7'
    },
    {
      id: 'lesson-24',
      title: 'Lesson 24 – The Fingers (The Five Finger Pattern)',
      description: 'Understand The Fingers when playing (The Five Finger Pattern). We discuss how the hands mirror each other. ',
      duration: '3 mins',
      meta: '2 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson24.jpg',
      youtubeId:'3VLOqBLhG6w?si=UQK26llMwaBTMLvq'
    },
    {
      id: 'lesson-25',
      title: 'Lesson 25 – SHARPS AND FLATS!',
      description: 'SHARPS AND FLATS! IT\'S JUST THAT SIMPLE. A sharp is the closet note to the right, and a flat is the closet note to the left! Remember not to skip any notes. ',
      duration: '5 mins',
      meta: '3 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson25.jpg',
      youtubeId:'VEz5UtT9bj0?si=IULY3gYZysmuO6Lj'
    },
    {
      id: 'lesson-26',
      title: 'Lesson 26 – THE WORD SEARCH GAME',
      description: 'HAVE FUN WITH YOUR MUSIC VOCAB! PLAY OUR WORD SEARCH! ',
      duration: '2 mins',
      meta: '3 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson26.jpg',
      youtubeId:'5JiUYnZQCH8?si=79Si7NdzXI6Vsf6J'
    },
    {
      id: 'lesson-27',
      title: 'Lesson 27 – INTERVALS (BASIC)',
      description: 'BOOK I INTERVALS! VERY BASIC WE LEARN the fundamentals of intervals here. :)',
      duration: '8 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson27.jpg',
      youtubeId:'eZk0LuKE2jo?si=rUnzl3vNz0u9PXcF'
    },
    {
      id: 'lesson-28',
      title: 'Lesson 28 – Rhythm Fun PG 21',
      description: 'THIS IS A TUTORIAL. I am explaining the instructions on page 21, Rhythm fun!',
      duration: '3 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson28.jpg',
      youtubeId:'KxL-pqmY49U?si=u1VLihjMLXGjTC5T'
    },
    {
      id: 'lesson-29',
      title: 'Lesson 29 – WHAT SONG IS THIS (PG 22)',
      description: 'I am giving you a tutorial from page 22 in book one, what song is this. Please place the notes from the musical alphabet to showcase the notated notes. :)',
      duration: '3 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson29.jpg',
      youtubeId:'bgER6oM2aYs?si=7o8MNJ7_DrTh8ICQ'
    },
    {
      id: 'lesson-30',
      title: 'Lesson 30 – The TRACING STATION! ITS SUPER EASY',
      description: 'The TRACING STATION! ITS SUPER EASY.... just trace our fun characters :)',
      duration: '1 min',
      meta: '3 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson30.jpg',
      youtubeId:'oKRV2wxdtFI?si=rrBpzGRBosCV8frC'
    },
    {
      id: 'lesson-31',
      title: 'Lesson 31 – he Word Bank Game and Our Tracing Station',
      description: 'The Word Bank Game and Our Tracing Station... I briefly run through the instructions! Its super exciting to have fun while we learn! :) YIPPIE! :)',
      duration: '2 mins',
      meta: '4 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson31.jpg',
      youtubeId:'tZiAMhkv37I?si=A6wqjPgpiRmwtQ1J'
    },
    {
      id: 'lesson-32',
      title: 'Lesson 32 – THE CROSS WORD GAME',
      description: 'THE CROSS WORD GAME! I AM SO EXCITED TO HELP YOU THROUGH THE CROSS WORD GAME! Take the time to study your music vocabulary, if you haven\'t heard these words before its a good time to take notes! :)',
      duration: '6 min',
      meta: '5 views',
      thumbnailUrl: '/lessons/Videos/Thumbnails/Lesson32.jpg',
      youtubeId:'FDBRKY9qCiQ?si=DwlddV1eUlobk8Ii'
    },
    
  ];