export interface ChapterContent {
  chapterNumber: number;
  chapterTitle: string;
  subtitle?: string;
  quote?: {
    text: string;
    author: string;
  };
  paragraphs: string[];
}

export interface BookSample {
  bookId: string;
  title: string;
  author: string;
  chapters: ChapterContent[];
}

export const BOOK_SAMPLES: Record<string, BookSample> = {
  'the-48-laws-of-power': {
    bookId: 'the-48-laws-of-power',
    title: 'The 48 Laws of Power',
    author: 'Robert Greene',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'LAW 1: Never Outshine the Master',
        subtitle: 'The Transgression and Observance of Power',
        quote: {
          text: 'Always make those above you feel comfortably superior. In your desire to please and impress them, do not go too far in displaying your talents or you might accomplish the opposite—inspire fear and insecurity.',
          author: 'Robert Greene',
        },
        paragraphs: [
          'Everyone has insecurities. When you show yourself in the world and display your talents, you naturally stir up all kinds of resentment, envy, and other manifestations of insecurity. This is to be expected. You cannot spend your life worrying about the petty feelings of others, but with those above you, you must take a different approach: When it comes to power, outshining the master is perhaps the worst mistake of all.',
          'Do not fool yourself into thinking that life has changed much since the days of Louis XIV and the Medici. Those who attain high standing are like kings and queens: They want to feel secure in their positions, and superior to those around them in intelligence, wit, and charm. It is a deadly yet common misperception to believe that by displaying and unleashing your gifts and talents, you are winning the master’s affection.',
          'He may feign appreciation, but at his first opportunity he will replace you with someone less brilliant, less attractive, less threatening, just as Louis XIV replaced the spectacular Fouquet with the much more submissive Colbert.',
          'Nicolas Fouquet, Louis XIV’s finance minister in the early years of his reign, was a generous man who loved lavish parties, pretty women, and poetry. When the prime minister Mazarin died in 1661, Fouquet expected to succeed him. Instead, the king decided to abolish the position. Sensing that he was falling out of favor, Fouquet decided to ingratiate himself with the king by throwing the most spectacular party the world had ever seen.',
          'The party was ostensibly to commemorate the completion of Fouquet’s estate, Vaux-le-Vicomte, and to promote his loyalty. Guests included the most brilliant minds of Europe—Molière, La Fontaine, and the greatest artists and musicians of the century. The feast was prepared by Vatel, the finest chef in France. When Louis XIV arrived, fountains danced and fireworks illuminated the night sky.',
          'The next day, Louis XIV had Fouquet arrested by D’Artagnan, captain of the King’s Musketeers. Three months later he went on trial for stealing from the country’s treasury. He was found guilty and spent the final twenty years of his life in solitary confinement.',
          'The moral is simple: never trigger the insecurities of those upon whose favor your advancement depends. Conceal your brilliance behind modesty, and credit them with your greatest triumphs.',
        ],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'LAW 2: Never Put Too Much Trust in Friends',
        subtitle: 'Learn How to Use Enemies',
        quote: {
          text: 'Be wary of friends—they will betray you more quickly, for they are easily aroused to envy. They also become spoiled and tyrannical. But hire a former enemy and he will be more loyal than a friend, because he has more to prove.',
          author: 'Robert Greene',
        },
        paragraphs: [
          'To have a good friend is one of the joys of life; but power demands cold calculation. The problem with using or hiring friends is that it will inevitably limit your power. The friend will rarely be the one who is most capable of helping you; and in the end, skill and competence are far more important than friendly feeling.',
          'All working situations require a kind of distance between people. You are trying to work, not make friends; and friendliness (real or false) only obscures that fact. The key to power, then, is the ability to judge who is best able to further your interests in all situations.',
          'Keep friends for friendship, but work with the skilled and competent. And if you have no enemies, find a way to make them—for an adversary at your gates forces you to remain vigilant, disciplined, and razor sharp.',
        ],
      },
    ],
  },
  'atomic-habits': {
    bookId: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'The Surprising Power of Atomic Habits',
        subtitle: 'Small changes lead to remarkable results over time',
        quote: {
          text: 'You do not rise to the level of your goals. You fall to the level of your systems.',
          author: 'James Clear',
        },
        paragraphs: [
          'The fate of British Cycling changed one day in 2003. The organization, which was the governing body for professional cycling in Great Britain, had recently hired Dave Brailsford as its new performance director. At the time, professional cyclists in Great Britain had endured nearly one hundred years of mediocrity.',
          'Since 1908, British riders had won just a single gold medal at the Olympic Games, and they had fared even worse in cycling’s biggest race, the Tour de France. In 110 years, no British cyclist had ever won the event. In fact, the performance of British riders had been so underwhelming that one of the top bike manufacturers in Europe refused to sell bikes to the team because they were afraid that it would hurt sales if other professionals saw the Brits using their gear.',
          'Brailsford had been hired to put British Cycling on a new trajectory. What made him different from previous coaches was his relentless commitment to a strategy that he referred to as "the aggregation of marginal gains," which was the philosophy of searching for a tiny margin of improvement in everything you do.',
          'Brailsford said, "The whole principle came from the idea that if you broke down everything you could think of that goes into riding a bike, and then improve it by 1 percent, you will get a significant increase when you put them all together."',
          'They redesigned the bike seats to make them more comfortable and rubbed alcohol on the tires for a better grip. They asked riders to wear electrically heated overpants to maintain ideal muscle temperature while riding. They tested various fabrics in a wind tunnel and had their outdoor riders switch to indoor racing suits, which proved to be lighter and more aerodynamic.',
          'Just five years after Brailsford took over, the British Cycling team dominated the road and track cycling events at the 2008 Olympic Games in Beijing, where they won an astounding 60 percent of the gold medals available.',
          'It is so easy to overestimate the importance of one defining moment and underestimate the value of making small improvements on a daily basis. If you can get 1 percent better each day for one year, you’ll end up thirty-seven times better by the time you’re done.',
        ],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'How Your Habits Shape Your Identity',
        subtitle: 'The two-step process to changing who you are',
        quote: {
          text: 'Every action you take is a vote for the type of person you wish to become.',
          author: 'James Clear',
        },
        paragraphs: [
          'Why is it so easy to repeat bad habits and so hard to form good ones? Few things can have a more powerful impact on your life than improving your daily habits. And yet it is likely that this time next year you’ll be doing the same thing rather than something better.',
          'The ultimate form of intrinsic motivation is when a habit becomes part of your identity. It’s one thing to say I’m the type of person who wants this. It’s something very different to say I’m the type of person who is this.',
          'The goal is not to read a book; the goal is to become a reader. The goal is not to run a marathon; the goal is to become a runner. The goal is not to learn an instrument; the goal is to become a musician.',
        ],
      },
    ],
  },
  'cant-hurt-me': {
    bookId: 'cant-hurt-me',
    title: "Can't Hurt Me",
    author: 'David Goggins',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'I Should Have Been a Statistic',
        subtitle: 'Master Your Mind and Defy the Odds',
        quote: {
          text: 'The only reason you don’t like what you see in the mirror is because you’re lying to yourself. The Accountability Mirror doesn’t care about your excuses.',
          author: 'David Goggins',
        },
        paragraphs: [
          'For the first eight years of my life, I was a hostage. My father, Trunnis Goggins, was a handsome man. Tall, broad-shouldered, and charismatic, he had an easy, infectious smile and sharp eyes that missed nothing. But behind closed doors, he was a monster.',
          'I was born in 1975 in Buffalo, New York. We lived in a beautiful home, but everything we had was built on suffering. My father ran a roller-skating rink called Skateland in a neighborhood known as the Masten District. By the time I was six years old, I was working every night until midnight, cleaning skates, sweeping floors, and counting change.',
          'Beatings were a regular part of life. Not discipline—unprovoked, brutal beatings. By the time my mother finally found the courage to pack our bags and escape in the dead of night to Brazil, Indiana, my soul was crushed. I had a severe stutter. I was functionally illiterate. Stress had caused my hair to fall out in circular patches.',
          'I was living in poverty, surrounded by hate, and terrified of everything. If you looked at the odds, I should have wound up dead or in prison by age twenty. But inside that scared kid was an ember that never completely died.',
          'Years later, staring at my reflection in a bathroom mirror at nearly 300 pounds, spraying cockroaches for Ecolab and eating box after box of chocolate donuts, I realized no one was coming to save me. I had to become my own hero.',
          'That was the night I shaved my head, put on running shoes that didn’t fit, and stepped into the darkness. That was the day I made a pact to break every limit my mind had ever placed on my body.',
        ],
      },
    ],
  },
  'the-rational-male': {
    bookId: 'the-rational-male',
    title: 'The Rational Male',
    author: 'Rollo Tomassi',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'The Basics of Intersexual Dynamics',
        subtitle: 'The Paradigm Shift of Unplugging',
        quote: {
          text: 'Sovereignty of mind is the rarest virtue of our era. To see reality without romanticized illusions is the prerequisite of authentic purpose.',
          author: 'Rollo Tomassi',
        },
        paragraphs: [
          'There is a fundamental difference between how men and women experience romantic interest, attraction, and long-term bonding. Society invests immense energy in conditioning boys into a romanticized dogma that bears little resemblance to evolutionary psychological realities.',
          'The first principle to understand is that desire cannot be negotiated. You cannot convince, debate, or reason anyone into genuine, visceral attraction. It is either elicited through strength, competence, and confidence, or it ceases to exist.',
          'Hypergamy—the instinctual inclination to seek partners of higher or equal status—is not malicious; it is biology. When you recognize biology as an objective reality rather than a personal insult, you cease to be a victim of circumstance and begin to command your trajectory.',
          'A man who centers his life on his personal mission, physical health, and intellectual sovereignty will inevitably radiate value. The moment you place another person at the absolute epicenter of your purpose, you surrender the very gravity that made you compelling in the first place.',
        ],
      },
    ],
  },
  'the-alchemist': {
    bookId: 'the-alchemist',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'Prologue: The Legend of Narcissus',
        subtitle: 'The Shepherd Boy of Andalusia',
        quote: {
          text: 'When you want something, all the universe conspires in helping you to achieve it.',
          author: 'Paulo Coelho',
        },
        paragraphs: [
          'The alchemist picked up a book that someone in the caravan had brought. Leafing through the pages, he found a story about Narcissus. The alchemist knew the legend of Narcissus, a youth who knelt daily beside a lake to contemplate his own beauty. He was so fascinated by himself that, one morning, he fell into the lake and drowned. At the spot where he fell, a flower was born, which was called the narcissus.',
          'But this was not how the author of the book had ended the story. He wrote that when Narcissus died, the goddesses of the forest appeared and found the lake, which had been fresh water, transformed into a lake of salty tears.',
          '"Why do you weep?" the goddesses asked.',
          '"I weep for Narcissus," the lake replied.',
          '"Oh, it is no surprise that you weep for Narcissus," they said, "for though we always pursued him in the forest, you alone could contemplate his beauty close at hand."',
          '"Was Narcissus beautiful?" the lake asked.',
          '"Who could know that better than you?" they marvelled. "It was upon your banks that he bent each day!"',
          'The lake was silent for some moments. At last, it said: "I weep for Narcissus, but I never noticed that Narcissus was beautiful. I weep because each time he knelt beside my banks, I could see, in the depths of his eyes, my own beauty reflected."',
          '"What a lovely story," the alchemist thought.',
        ],
      },
    ],
  },
  'sapiens': {
    bookId: 'sapiens',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'An Animal of No Significance',
        subtitle: 'The Cognitive Revolution',
        quote: {
          text: 'About 70,000 years ago, organisms belonging to the species Homo sapiens started to form even more elaborate structures called cultures.',
          author: 'Yuval Noah Harari',
        },
        paragraphs: [
          'About 13.5 billion years ago, matter, energy, time, and space came into being in what is known as the Big Bang. The story of these fundamental features of our universe is called physics.',
          'About 300,000 years after their appearance, matter and energy started to coalesce into complex structures, called atoms, which then combined into molecules. The story of atoms, molecules, and their interactions is called chemistry.',
          'About 3.8 billion years ago, on a planet called Earth, certain molecules combined to form particularly large and intricate structures called organisms. The story of organisms is called biology.',
          'About 70,000 years ago, organisms belonging to the species Homo sapiens started to form even more elaborate structures called cultures. The subsequent development of these human cultures is called history.',
          'The most important thing to know about prehistoric humans is that they were insignificant animals with no more impact on their environment than gorillas, fireflies, or jellyfish.',
          'What allowed Homo sapiens to conquer the globe was not physical strength—Neanderthals were far stronger—but the unique ability to transmit information about things that do not exist at all. Legend, myth, god, and religion appeared for the first time with the Cognitive Revolution.',
        ],
      },
    ],
  },
  'clean-code': {
    bookId: 'clean-code',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'Clean Code & Craftsmanship',
        subtitle: 'The Total Cost of Owning a Mess',
        quote: {
          text: 'The only valid measurement of code quality: WTFs/minute.',
          author: 'Robert C. Martin (Uncle Bob)',
        },
        paragraphs: [
          'You are reading this because you are a programmer. You want to be a better programmer. Good. We need better programmers.',
          'Have you ever been significantly impeded by bad code? If you are a programmer of any experience, you have felt this impediment many times. Indeed, we have a name for it. We call it wading. We wade through bad code. We slog through a morass of tangled brambles and hidden pitfalls. We struggle to find our way, hoping for some hint of what is going on, but all we see is more and more senseless code.',
          'Of course you have been impeded by bad code. So then—why did you write it? Were you trying to go fast? Were you in a rush? Probably. You felt that you didn’t have time to do a good job; that your boss would be angry if you took the time to clean up your code. Or perhaps you were just tired of working on this program and wanted it to be over.',
          'We’ve all looked at the mess we’ve just made and said, "I’ll clean this up later." We didn’t know LeBlanc’s law: Later equals never.',
          'The only way to go fast, the only way to meet deadlines, the only way to succeed as a team is to keep the code clean at all times. Leave the campground cleaner than you found it.',
        ],
      },
    ],
  },
};

export function getBookSample(bookId: string, title?: string, author?: string): BookSample {
  if (BOOK_SAMPLES[bookId]) {
    return BOOK_SAMPLES[bookId];
  }

  // Graceful fallback for any other catalog title
  return {
    bookId,
    title: title ?? 'Selected Title',
    author: author ?? 'Featured Author',
    chapters: [
      {
        chapterNumber: 1,
        chapterTitle: 'Chapter 1: The Beginning',
        subtitle: 'Sample Excerpt from Lumina Digital Edition',
        quote: {
          text: `“A reader lives a thousand lives before he dies. The man who never reads lives only one.”`,
          author: author ?? 'Author',
        },
        paragraphs: [
          `Welcome to this digital sample of "${title ?? 'this masterpiece'}". Lumina Books delivers an uncompromising reading experience designed with typography and focus at its core.`,
          `As you turn each page of this work, you explore the distilled thoughts, years of hard-won experience, and deep perspectives crafted meticulously by ${author ?? 'the author'}.`,
          `True knowledge is built not through passive consumption, but through deep, uninterrupted immersion. Every concept outlined here is engineered to challenge assumptions and open new horizons of critical inquiry.`,
          `To continue reading the complete, unabridged edition with full audio narration, offline highlights, and chapter notes, add this volume to your personal library today.`,
        ],
      },
      {
        chapterNumber: 2,
        chapterTitle: 'Chapter 2: The Core Principles',
        subtitle: 'Strategic Mastery & Execution',
        quote: {
          text: `“Simplicity is the prerequisite for reliability.”`,
          author: author ?? 'Author',
        },
        paragraphs: [
          `Every profound shift begins with a single foundational habit. When you align your daily environment with your long-term ambitions, resistance fades and momentum takes over.`,
          `Study the patterns of those who have mastered their craft before you. Emulate their rigor, discard what is extraneous, and refine your own process continuously.`,
        ],
      },
    ],
  };
}
