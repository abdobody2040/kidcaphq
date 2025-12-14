
import { Book } from '../types';

export const INITIAL_LIBRARY: Book[] = [
  // --- Mindset & Psychology (Existing) ---
  {
    id: "think-and-grow-rich",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    coverUrl: "https://m.media-amazon.com/images/I/71UypkUjStL._SL1500_.jpg",
    summary: "Imagine your brain is a magnet. If you think about success hard enough and have a plan, you attract it! It's like visualizing winning a video game level before you even pick up the controller.",
    category: "Mindset",
    keyLessons: [
      "You need a 'Burning Desire' to win.",
      "Believe you can do it, even when it's hard.",
      "Don't quit three feet from the gold."
    ],
    ageRating: "10+"
  },
  {
    id: "mindset-success",
    title: "Mindset: The New Psychology of Success",
    author: "Carol Dweck",
    coverUrl: "https://m.media-amazon.com/images/I/717V4glZ2HL._SL1500_.jpg",
    summary: "Some people think you are born smart (Fixed Mindset). Others know your brain is like a muscle that grows when you try hard things (Growth Mindset). This book teaches you how to level up your brain power!",
    category: "Mindset",
    keyLessons: [
      "Talent is just a starting point.",
      "Failure is just information on how to get better.",
      "The word 'Yet' is magical (I can't do it... YET)."
    ],
    ageRating: "10+"
  },
  {
    id: "7-habits",
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen Covey",
    coverUrl: "https://m.media-amazon.com/images/I/617Zl5b+kLL._SL1500_.jpg",
    summary: "This is like a cheat code for life. It gives you 7 rules to be awesome at everything, from school projects to running a lemonade stand. It teaches you to be the captain of your own ship.",
    category: "Mindset",
    keyLessons: [
      "Be Proactive: You are in charge of you.",
      "Begin with the End in Mind: Have a plan.",
      "Put First Things First: Do homework before video games."
    ],
    ageRating: "12+"
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    coverUrl: "https://m.media-amazon.com/images/I/81wgcld4wxL._SL1500_.jpg",
    summary: "Imagine getting 1% better every day. By the end of the year, you'd be 37 times better! This book shows how tiny changes (atoms) can build huge results (explosions of success).",
    category: "Mindset",
    keyLessons: [
      "Small habits add up to big results.",
      "Focus on who you want to be, not just what you want.",
      "Make good habits easy and bad habits hard."
    ],
    ageRating: "12+"
  },
  {
    id: "how-to-win-friends",
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    coverUrl: "https://m.media-amazon.com/images/I/71vK0WVQ4rL._SL1500_.jpg",
    summary: "The ultimate guide to being popular and liked. It teaches you that the sweetest sound to anyone is their own name, and that listening is a superpower. Use this to build a huge team for your business!",
    category: "Mindset",
    keyLessons: [
      "Smile! It's free and powerful.",
      "Remember people's names.",
      "Talk about what the other person is interested in."
    ],
    ageRating: "10+"
  },
  {
    id: "start-with-why",
    title: "Start with Why",
    author: "Simon Sinek",
    coverUrl: "https://m.media-amazon.com/images/I/71K1jVjF21L._SL1500_.jpg",
    summary: "People don't buy WHAT you do; they buy WHY you do it. Martin Luther King Jr. didn't have a 'I have a plan' speech, he had an 'I have a dream' speech. Find your purpose!",
    category: "Mindset",
    keyLessons: [
      "Know why you are doing something.",
      "Inspire people, don't just boss them around.",
      "Great leaders start with a belief."
    ],
    ageRating: "12+"
  },
  {
    id: "grit",
    title: "Grit",
    author: "Angela Duckworth",
    coverUrl: "https://m.media-amazon.com/images/I/71R2Nw-jJML._SL1500_.jpg",
    summary: "Talent is overrated. What really matters is 'Grit'—which is passion plus perseverance. It means falling down, scraping your knee, and getting back up to finish the race.",
    category: "Mindset",
    keyLessons: [
      "Effort counts twice as much as talent.",
      "Don't give up when things get messy.",
      "Stick to your goals for a long time."
    ],
    ageRating: "10+"
  },

  // --- Strategy & Innovation (Existing + New) ---
  {
    id: "zero-to-one",
    title: "Zero to One",
    author: "Peter Thiel",
    coverUrl: "https://m.media-amazon.com/images/I/71uAI28kJuL._SL1500_.jpg",
    summary: "Copying people takes you from 1 to n. Inventing something new takes you from 0 to 1. Don't open the 10th pizza shop in town; invent a flying pizza drone! Be unique.",
    category: "Strategy",
    keyLessons: [
      "Competition is for losers; try to be unique.",
      "Technology matters more than globalization.",
      "Secrets are hidden in plain sight."
    ],
    ageRating: "14+"
  },
  {
    id: "blue-ocean-strategy",
    title: "Blue Ocean Strategy",
    author: "W. Chan Kim",
    coverUrl: "https://m.media-amazon.com/images/I/81L7-M3ZfAL._SL1500_.jpg",
    summary: "Imagine an ocean full of sharks fighting over food (Red Ocean). Don't swim there! Go find a Blue Ocean where the water is clear and there is no competition. Create a new game that only you can win.",
    category: "Strategy",
    keyLessons: [
      "Don't beat the competition; make them irrelevant.",
      "Create new demand instead of fighting for old demand.",
      "Be different and lower costs at the same time."
    ],
    ageRating: "12+"
  },
  {
    id: "the-lean-startup",
    title: "The Lean Startup",
    author: "Eric Ries",
    coverUrl: "https://m.media-amazon.com/images/I/81-QB7nDfRL._SL1500_.jpg",
    summary: "Don't build a giant castle before you know if people want to live in it. Build a tiny shed first! This book teaches you to build a 'Minimum Viable Product' to test your ideas fast without wasting coins.",
    category: "Strategy",
    keyLessons: [
      "Build, Measure, Learn.",
      "Don't waste time on things nobody wants.",
      "Fail fast so you can succeed sooner."
    ],
    ageRating: "12+"
  },
  {
    id: "hooked",
    title: "Hooked",
    author: "Nir Eyal",
    coverUrl: "https://m.media-amazon.com/images/I/5152h+3yO7L._SL1500_.jpg",
    summary: "Ever wonder why you can't put down a video game or TikTok? It's designed that way! This book explains the 'Hook Model'—Trigger, Action, Reward, Investment. Use it to build good habits or great products.",
    category: "Strategy",
    keyLessons: [
      "Products need a 'Trigger' to start a habit.",
      "Variable Rewards (surprises) make things addicting.",
      "If users invest time, they won't leave."
    ],
    ageRating: "12+"
  },
  {
    id: "contagious",
    title: "Contagious",
    author: "Jonah Berger",
    coverUrl: "https://m.media-amazon.com/images/I/61d1p7KYtLL._SL1500_.jpg",
    summary: "Why do some videos go viral and others get zero views? It's not luck! It's science. People share things that make them look cool, evoke emotion, or tell a story. Learn the secret sauce of popularity.",
    category: "Strategy",
    keyLessons: [
      "Social Currency: We share what makes us look good.",
      "Triggers: Keep your product top-of-mind.",
      "Stories: People remember stories, not facts."
    ],
    ageRating: "12+"
  },
  {
    id: "purple-cow",
    title: "Purple Cow",
    author: "Seth Godin",
    coverUrl: "https://m.media-amazon.com/images/I/61N+R-3WdXL._SL1500_.jpg",
    summary: "If you drive past a field of brown cows, you stop looking. But if you saw a PURPLE cow? You'd take a picture! In business, you have to be remarkable (worth making a remark about) or you are invisible.",
    category: "Strategy",
    keyLessons: [
      "Being boring is risky.",
      "Safe is dangerous.",
      "Design your product to be worth talking about."
    ],
    ageRating: "10+"
  },
  {
    id: "good-to-great",
    title: "Good to Great",
    author: "Jim Collins",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Why are some companies just okay, while others become super awesome? It's about getting the right people on the bus (your team) and finding what you can be the best in the world at. Be a hedgehog, not a fox!",
    keyLessons: [
      "First Who, Then What (Team first).",
      "Confront the brutal facts but keep faith.",
      "The Hedgehog Concept: Do one thing perfectly."
    ]
  },
  {
    id: "built-to-last",
    title: "Built to Last",
    author: "Jim Collins",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Some companies live for 100 years! How? They have core values that never change, but they are always trying new stuff. It's like having a strong skeleton but changing your outfit every day.",
    keyLessons: [
      "Clock Building, not Time Telling.",
      "Preserve the Core, Stimulate Progress.",
      "Try lots of stuff and keep what works."
    ]
  },
  {
    id: "crossing-the-chasm",
    title: "Crossing the Chasm",
    author: "Geoffrey Moore",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Selling a new tech toy to your nerdy friend is easy. Selling it to your grandma is hard! There is a big gap (chasm) between cool kids and normal people. You have to jump over it to win.",
    keyLessons: [
      "Focus on one specific group of people first.",
      "Make the product easy for normal people.",
      "Don't try to sell to everyone at once."
    ]
  },
  {
    id: "innovators-dilemma",
    title: "The Innovator’s Dilemma",
    author: "Clayton Christensen",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Big companies sometimes fail because they do everything right! They listen to customers too much and miss the new, weird inventions. Don't be afraid to break your own toys to build better ones.",
    keyLessons: [
      "Doing the right thing can be wrong sometimes.",
      "Watch out for small, cheap inventions.",
      "Disrupt yourself before someone else does."
    ]
  },
  {
    id: "business-model-generation",
    title: "Business Model Generation",
    author: "Alexander Osterwalder",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "A business plan on one sheet of paper! It's like a coloring book for business. You draw boxes for 'Who buys this?', 'How do I make money?', and 'What do I need?'.",
    keyLessons: [
      "Visualize your business on one page.",
      "Connect the dots between customers and money.",
      "Keep it simple and flexible."
    ]
  },
  {
    id: "sprint",
    title: "Sprint",
    author: "Jake Knapp",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Solve big problems in just 5 days! It's a recipe: Monday map it out, Tuesday sketch, Wednesday decide, Thursday build, Friday test. No more endless meetings!",
    keyLessons: [
      "Focus on one big problem at a time.",
      "Build a prototype fast (fake it till you make it).",
      "Test with real humans immediately."
    ]
  },
  {
    id: "traction",
    title: "Traction",
    author: "Gabriel Weinberg",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Building a cool toy is only half the battle. You need 'Traction' (people actually wanting it). This book gives you 19 channels to find customers, like blogs, ads, or speaking at school!",
    keyLessons: [
      "Spend 50% time building, 50% time selling.",
      "Test different ways to find customers.",
      "Focus on the one channel that works best."
    ]
  },
  {
    id: "100-startup",
    title: "The $100 Startup",
    author: "Chris Guillebeau",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "You don't need a million dollars to start a business. You just need $100 and a skill! Sell your drawings, walk dogs, or teach a language. Action is better than planning.",
    keyLessons: [
      "Passion + Skill + Usefulness = Money.",
      "Give people what they want, not what you think they want.",
      "Start small and start now."
    ]
  },
  {
    id: "running-lean",
    title: "Running Lean",
    author: "Ash Maurya",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Don't write a 50-page plan that nobody reads. Create a 'Lean Canvas'. It's a faster way to plan your lemonade stand. Focus on the problem you are solving, not just the solution.",
    keyLessons: [
      "Life is too short to build something nobody wants.",
      "Love the problem, not your solution.",
      "Test your plan like a science experiment."
    ]
  },
  {
    id: "playing-to-win",
    title: "Playing to Win",
    author: "A.G. Lafley",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Strategy is just 5 choices: What is our winning aspiration? Where will we play? How will we win? What capabilities do we need? What systems do we need? If you can answer these, you win!",
    keyLessons: [
      "You have to choose to win, not just play.",
      "Decide where you WON'T play.",
      "Strategy is about making hard choices."
    ]
  },
  {
    id: "measure-what-matters",
    title: "Measure What Matters",
    author: "John Doerr",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Google uses a secret system called OKRs (Objectives and Key Results). Objective: 'Be the best lemonade stand'. Key Result: 'Sell 50 cups by Friday'. It turns big dreams into numbers.",
    keyLessons: [
      "Ideas are easy. Execution is everything.",
      "Set goals that are specific and measurable.",
      "Stretch for goals that seem a little impossible."
    ]
  },
  {
    id: "made-to-stick",
    title: "Made to Stick",
    author: "Chip Heath",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Why do you remember urban legends but forget history class? Sticky ideas are Simple, Unexpected, Concrete, Credible, Emotional, and Stories (SUCCES). Use this to make people remember your brand.",
    keyLessons: [
      "Keep it simple (Commander's Intent).",
      "Surprise people to get attention.",
      "Tell stories, don't just list facts."
    ]
  },
  {
    id: "dotcom-secrets",
    title: "Dotcom Secrets",
    author: "Russell Brunson",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "The internet is a giant funnel. You put people in the top (visitors) and customers come out the bottom. This book teaches you how to build the slides and ladders to move them down.",
    keyLessons: [
      "Find your dream customer.",
      "Create a 'Value Ladder' (offer more value, charge more).",
      "Tell stories to sell your stuff."
    ]
  },
  {
    id: "influence",
    title: "Influence",
    author: "Robert Cialdini",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "People are programmed to say yes if you use the right triggers. Reciprocity (give to get), Scarcity (only 1 left!), and Authority (listen to the expert). Use these powers for good!",
    keyLessons: [
      "Give something first to get something back.",
      "People want what they can't have.",
      "People follow the crowd (Social Proof)."
    ]
  },
  {
    id: "leaders-eat-last",
    title: "Leaders Eat Last",
    author: "Simon Sinek",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "In the military, officers eat after the soldiers. Why? Because leaders take care of their team first. If your team feels safe, they will work hard for you. Don't be a selfish boss!",
    keyLessons: [
      "Create a Circle of Safety.",
      "Protect your team from danger.",
      "Sacrifice your comfort for their success."
    ]
  },
  {
    id: "rework",
    title: "Rework",
    author: "Jason Fried",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Ignore the real world. Meetings are toxic. Planning is guessing. This book breaks all the rules! It says you don't need an office or a suit to build a huge business.",
    keyLessons: [
      "ASAP is poison.",
      "Meetings kill productivity.",
      "Build less, but build it really well."
    ]
  },
  {
    id: "e-myth-revisited",
    title: "The E-Myth Revisited",
    author: "Michael Gerber",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "If you bake great pies, don't open a bakery to bake pies. Open a bakery to RUN a pie business. Work ON your business, not IN your business. Build a system so anyone can bake the pies.",
    keyLessons: [
      "Build a franchise prototype (systems).",
      "Don't just do the technical work.",
      "Make your business work without you."
    ]
  },
  {
    id: "this-is-marketing",
    title: "This Is Marketing",
    author: "Seth Godin",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Marketing isn't using tricks to sell junk. It's the generous act of helping someone solve a problem. Don't find customers for your product; find a product for your customers.",
    keyLessons: [
      "People like us do things like this.",
      "Marketing is about change.",
      "Empathy is the best marketing tool."
    ]
  },
  {
    id: "building-a-storybrand",
    title: "Building a StoryBrand",
    author: "Donald Miller",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Your customer is the Hero (like Luke Skywalker). You are the Guide (like Yoda). Don't be the hero of your own website! Show how you help them win the day and defeat the villain.",
    keyLessons: [
      "Clarify your message so people listen.",
      "You are the guide, not the hero.",
      "Give them a plan to succeed."
    ]
  },
  {
    id: "traffic-secrets",
    title: "Traffic Secrets",
    author: "Russell Brunson",
    coverUrl: "https://placehold.co/400x600?text=Strategy",
    category: "Strategy",
    ageRating: "12+",
    summary: "Your dream customers are already hanging out somewhere online. Go find them! This book teaches you how to get people to come to your website without spending a billion dollars on ads.",
    keyLessons: [
      "Find out where your 'Dream 100' hang out.",
      "Work your way in or buy your way in.",
      "Own your traffic (email list)."
    ]
  },

  // --- Finance & Wealth (Existing) ---
  {
    id: "rich-dad-poor-dad",
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    coverUrl: "https://m.media-amazon.com/images/I/81bsw6fnUiL._SL1500_.jpg",
    summary: "This book tells the story of two dads. One worked hard for money, and the other made money work for him. It teaches you that buying cool stuff (liabilities) takes money away, but buying businesses (assets) puts money in your pocket!",
    category: "Finance",
    keyLessons: [
      "The rich don't work for money; money works for them.",
      "Assets put money in your pocket.",
      "Liabilities take money out of your pocket."
    ],
    ageRating: "10+"
  },
  {
    id: "richest-man-in-babylon",
    title: "The Richest Man in Babylon",
    author: "George S. Clason",
    coverUrl: "https://m.media-amazon.com/images/I/71u372t-2jL._SL1500_.jpg",
    summary: "Set in ancient times with camels and gold coins, this book teaches the golden rule of wealth: 'A part of all you earn is yours to keep.' Save 10% of every dollar you get, no matter what!",
    category: "Finance",
    keyLessons: [
      "Pay yourself first (save 10%).",
      "Control your spending (expenses).",
      "Make your gold multiply (investing)."
    ],
    ageRating: "10+"
  },
  {
    id: "psychology-of-money",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverUrl: "https://m.media-amazon.com/images/I/71TRUbcZikL._SL1500_.jpg",
    summary: "Doing well with money isn't about being a math wizard; it's about how you behave. It teaches that getting rich is hard, but staying rich is even harder because you have to control your ego.",
    category: "Finance",
    keyLessons: [
      "Survival is more important than big returns.",
      "Knowing when you have 'enough' is a superpower.",
      "Saving money gives you freedom."
    ],
    ageRating: "12+"
  },
  {
    id: "i-will-teach-you-to-be-rich",
    title: "I Will Teach You to Be Rich",
    author: "Ramit Sethi",
    coverUrl: "https://m.media-amazon.com/images/I/71K7M7+GvLL._SL1500_.jpg",
    summary: "Forget skipping lattes! This book teaches you to spend extravagantly on the things you love (like video games) as long as you cut costs mercilessly on the things you don't.",
    category: "Finance",
    keyLessons: [
      "Automate your savings and bills.",
      "Start investing early (right now!).",
      "Spend money on what makes you happy."
    ],
    ageRating: "12+"
  },
  {
    id: "profit-first",
    title: "Profit First",
    author: "Mike Michalowicz",
    coverUrl: "https://m.media-amazon.com/images/I/61+9P+8WcCL._SL1500_.jpg",
    summary: "Most people pay bills first and save what is left (which is usually zero). This book flips it! Take your profit out of the register FIRST, then use the leftovers to pay bills. It forces you to be smart.",
    category: "Finance",
    keyLessons: [
      "Take your profit first, not last.",
      "Use different bank accounts (plates) for different money.",
      "Remove temptation by hiding your profit."
    ],
    ageRating: "12+"
  },
  {
    id: "automatic-millionaire",
    title: "The Automatic Millionaire",
    author: "David Bach",
    coverUrl: "https://m.media-amazon.com/images/I/71+vQykCZ+L._SL1500_.jpg",
    summary: "You don't need willpower to save money. You need a robot! Set up your bank account to automatically move money to savings the second you get it. You'll get rich without even thinking about it.",
    category: "Finance",
    keyLessons: [
      "The 'Latte Factor': small daily spends add up.",
      "Make saving automatic so you can't say no.",
      "Rich people automate their financial lives."
    ],
    ageRating: "12+"
  },

  // --- Mindset (Batch 3 Additions) ---
  {
    id: "magic-of-thinking-big",
    title: "The Magic of Thinking Big",
    author: "David J. Schwartz",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "If you think small, you get small results. If you think BIG, you get big results! Your brain tries to prove you right, so give it a big goal to chase. Belief triggers the power to do.",
    keyLessons: [
      "Believe you can succeed and you will.",
      "Cure yourself of excusitis (making excuses).",
      "Think and dream creatively."
    ]
  },
  {
    id: "power-of-positive-thinking",
    title: "The Power of Positive Thinking",
    author: "Norman Vincent Peale",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Your attitude determines your altitude. If you expect the best, good things happen. It's like wearing magic glasses that help you see opportunities instead of problems.",
    keyLessons: [
      "Picture yourself succeeding.",
      "Don't worry, pray (or meditate).",
      "Believe in yourself."
    ]
  },
  {
    id: "thinking-fast-and-slow",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "14+",
    summary: "You have two brains! System 1 is fast and emotional (like a ninja). System 2 is slow and logical (like a professor). Learn when to trust your gut and when to stop and do the math.",
    keyLessons: [
      "Your brain loves shortcuts (sometimes wrong ones).",
      "Don't always trust your first thought.",
      "Slow down for big decisions."
    ]
  },
  {
    id: "4-hour-workweek",
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Why wait until you're old to retire? Design a life where you work smart, not just hard. Use automation and assistants to do the boring stuff so you can travel the world now!",
    keyLessons: [
      "DEAL: Definition, Elimination, Automation, Liberation.",
      "Being busy is not the same as being productive.",
      "Focus on the 20% of work that gives 80% of results."
    ]
  },
  {
    id: "quiet",
    title: "Quiet",
    author: "Susan Cain",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "You don't have to be loud to be a leader. Introverts (quiet people) have superpowers too! They are great listeners and deep thinkers. The world needs both loud and quiet people.",
    keyLessons: [
      "There is power in silence.",
      "Solitude is a catalyst for innovation.",
      "You don't have to shout to be heard."
    ]
  },
  {
    id: "originals",
    title: "Originals",
    author: "Adam Grant",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "How do you come up with new ideas? By being an 'Original'. It's okay to procrastinate a little (it helps creativity!) and it's okay to be afraid. Challenge the rules!",
    keyLessons: [
      "Question the default.",
      "Quantity leads to quality (have lots of ideas!).",
      "Procrastination can help creativity."
    ]
  },
  {
    id: "ego-is-the-enemy",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Your biggest enemy isn't the competition; it's your own pride! Staying humble helps you learn. When you win, stay sober. When you lose, don't give up. Don't let your head get too big.",
    keyLessons: [
      "Be humble in your aspirations.",
      "Gracious in your success.",
      "Resilient in your failure."
    ]
  },
  {
    id: "obstacle-is-the-way",
    title: "The Obstacle Is the Way",
    author: "Ryan Holiday",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "When a rock blocks the road, don't cry. Climb over it! The problem isn't bad; it's a chance to get stronger. Ancient stoics knew that challenges are just training for your brain.",
    keyLessons: [
      "Turn trials into triumph.",
      "Don't panic; perceive clearly.",
      "Action solves problems."
    ]
  },
  {
    id: "who-moved-my-cheese",
    title: "Who Moved My Cheese?",
    author: "Spencer Johnson",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "10+",
    summary: "Two mice and two little people live in a maze. The cheese moves! The mice adapt instantly, but the people complain. Change happens. Adapt fast and enjoy the new cheese!",
    keyLessons: [
      "Change happens; expect it.",
      "Adapt to change quickly.",
      "Enjoy the adventure of finding new cheese."
    ]
  },
  {
    id: "5-am-club",
    title: "The 5 AM Club",
    author: "Robin Sharma",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Own your morning, elevate your life. Waking up early gives you a 'Victory Hour' to exercise, plan, and learn while everyone else is sleeping. It's the secret weapon of billionaires.",
    keyLessons: [
      "The 20/20/20 Rule: Move, Reflect, Grow.",
      "Consistency is the DNA of mastery.",
      "Small daily wins lead to giant results."
    ]
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Focus is a superpower in a distracted world. 'Deep Work' is working on a hard problem without checking your phone for hours. It produces valuable things that are hard to copy.",
    keyLessons: [
      "Distraction is the enemy of depth.",
      "Work hard, then rest fully.",
      "Quit social media (or use it less)."
    ]
  },
  {
    id: "digital-minimalism",
    title: "Digital Minimalism",
    author: "Cal Newport",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Your phone is a tool, not a master. Clear the clutter of apps and notifications so you can enjoy real life. Be intentional with technology instead of letting it use you.",
    keyLessons: [
      "Use technology to support your values.",
      "Spend time alone without a screen.",
      "Don't click 'Like', go say 'Hi'."
    ]
  },
  {
    id: "essentialism",
    title: "Essentialism",
    author: "Greg McKeown",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Less but better. You can't do everything, so you must choose the few things that really matter. Learn to say 'No' to almost everything so you can say 'Yes' to the right things.",
    keyLessons: [
      "If it isn't a clear Yes, it's a No.",
      "Focus on the vital few, not the trivial many.",
      "Protect your time."
    ]
  },
  {
    id: "cant-hurt-me",
    title: "Can't Hurt Me",
    author: "David Goggins",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "14+",
    summary: "David Goggins is the toughest man alive. He went from depressed to a Navy SEAL by callousing his mind. He teaches the 40% rule: when you think you're done, you're only 40% done!",
    keyLessons: [
      "Callous your mind by doing hard things.",
      "The 40% Rule: You have more in the tank.",
      "Don't be a victim of your circumstances."
    ]
  },
  {
    id: "extreme-ownership",
    title: "Extreme Ownership",
    author: "Jocko Willink",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "There are no bad teams, only bad leaders. If something goes wrong, it's YOUR fault. Taking total responsibility (Extreme Ownership) gives you the power to fix it.",
    keyLessons: [
      "Don't blame others; look in the mirror.",
      "Discipline equals freedom.",
      "Keep it simple."
    ]
  },
  {
    id: "awaken-the-giant-within",
    title: "Awaken the Giant Within",
    author: "Tony Robbins",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "You have a sleeping giant inside you! Wake it up by controlling your emotions, your body, and your finances. Change your words to change your life. 'I am unstoppable!'",
    keyLessons: [
      "Raise your standards.",
      "Change your limiting beliefs.",
      "Decisions shape your destiny."
    ]
  },
  {
    id: "limitless",
    title: "Limitless",
    author: "Jim Kwik",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "10+",
    summary: "Your brain is a supercomputer. You can learn faster, remember more, and read quicker. This book teaches you how to unlimit your brain by fixing your mindset, motivation, and methods.",
    keyLessons: [
      "Your brain is like a muscle.",
      "FAST: Forget, Active, State, Teach.",
      "Questions are the answer."
    ]
  },
  {
    id: "make-your-bed",
    title: "Make Your Bed",
    author: "William H. McRaven",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "10+",
    summary: "If you want to change the world, start by making your bed. It's a small win that starts your day right. This Navy SEAL shares lessons on courage, hardship, and never ringing the bell (quitting).",
    keyLessons: [
      "Start the day with a completed task.",
      "You can't go it alone.",
      "Never, ever quit."
    ]
  },
  {
    id: "switch",
    title: "Switch",
    author: "Chip Heath",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Change is hard because your logical brain (Rider) fights your emotional brain (Elephant). To change things, you must direct the Rider, motivate the Elephant, and shape the Path.",
    keyLessons: [
      "Find the bright spots (what's working).",
      "Shrink the change (make it small).",
      "Tweak the environment."
    ]
  },
  {
    id: "compound-effect",
    title: "The Compound Effect",
    author: "Darren Hardy",
    coverUrl: "https://placehold.co/400x600?text=Mindset",
    category: "Mindset",
    ageRating: "12+",
    summary: "Success isn't magic; it's small smart choices made consistently over time. A penny doubled every day becomes millions. Bad habits compound too, so watch out!",
    keyLessons: [
      "Small choices + Consistency + Time = Radical Difference.",
      "Take 100% responsibility.",
      "Track every action to improve it."
    ]
  },

  // --- Biographies & Legends (Existing + New) ---
  {
    id: "shoe-dog",
    title: "Shoe Dog",
    author: "Phil Knight",
    coverUrl: "https://m.media-amazon.com/images/I/612c1K-qyuL._SL1500_.jpg",
    summary: "The creator of Nike didn't start with a big factory. He started selling shoes out of the trunk of his car! It's a messy, crazy adventure about believing in your 'Crazy Idea' when everyone else thinks you are nuts.",
    category: "Biography",
    keyLessons: [
      "Don't stop. Keep going until you get there.",
      "Business is war without bullets.",
      "Believe in your product even if others don't."
    ],
    ageRating: "12+"
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    coverUrl: "https://m.media-amazon.com/images/I/71sV+r3+nRL._SL1500_.jpg",
    summary: "Steve Jobs was a wizard who wanted computers to be beautiful. He wasn't always nice, but he was a genius who focused on perfection. He taught us that design matters and that we should 'Think Different'.",
    category: "Biography",
    keyLessons: [
      "Focus is about saying 'No'.",
      "Simplicity is the ultimate sophistication.",
      "Stay hungry, stay foolish."
    ],
    ageRating: "12+"
  },
  {
    id: "elon-musk",
    title: "Elon Musk",
    author: "Walter Isaacson",
    coverUrl: "https://m.media-amazon.com/images/I/715s-tQ+j7L._SL1500_.jpg",
    summary: "The real-life Tony Stark. He builds electric cars (Tesla) and rockets (SpaceX). He learns by reading books and never accepts 'that's impossible' as an answer. He wants to save humanity!",
    category: "Biography",
    keyLessons: [
      "First Principles thinking: Boil things down to truth.",
      "Take big risks for big rewards.",
      "Work super hard if you want to change the world."
    ],
    ageRating: "12+"
  },
  {
    id: "creativity-inc",
    title: "Creativity, Inc.",
    author: "Ed Catmull",
    coverUrl: "https://m.media-amazon.com/images/I/71+2+1-XjJL._SL1500_.jpg",
    summary: "Written by the boss of Pixar. He explains how they made Toy Story and Finding Nemo. The secret? Trust your team and don't be afraid to make mistakes. 'Fail early and fail fast' to fix the movie before it's finished.",
    category: "Biography",
    keyLessons: [
      "Give good notes (feedback) without being mean.",
      "Hire people smarter than you.",
      "Protect the 'Ugly Baby' ideas until they grow up."
    ],
    ageRating: "12+"
  },
  {
    id: "made-in-america",
    title: "Made in America",
    author: "Sam Walton",
    coverUrl: "https://m.media-amazon.com/images/I/61-v-1-q+HL._SL1500_.jpg",
    summary: "The story of Walmart. Sam Walton loved flying his little plane over towns to find good spots for stores. He was obsessed with keeping prices low and treating customers like kings.",
    category: "Biography",
    keyLessons: [
      "Swim upstream; go where others aren't.",
      "Control your expenses better than your competition.",
      "Listen to everyone in your company."
    ],
    ageRating: "12+"
  },
  {
    id: "the-snowball",
    title: "The Snowball",
    author: "Alice Schroeder",
    coverUrl: "https://m.media-amazon.com/images/I/71D+1+q+HL._SL1500_.jpg",
    summary: "The life of Warren Buffett. He started by selling gum and collecting golf balls. He saved every penny and invested it. Like a snowball rolling down a hill, his money got bigger and bigger until he became the richest man on earth.",
    category: "Biography",
    keyLessons: [
      "Reputation is everything.",
      "Stick to what you know.",
      "Compound interest is life's most powerful force."
    ],
    ageRating: "12+"
  },
  {
    id: "titan",
    title: "Titan",
    author: "Ron Chernow",
    coverUrl: "https://m.media-amazon.com/images/I/81D+1+q+HL._SL1500_.jpg",
    summary: "John D. Rockefeller was the richest man in history. He organized the messy oil industry and created Standard Oil. He was strict and saved every penny, but gave millions to charity. A true business giant.",
    category: "Biography",
    keyLessons: [
      "Efficiency wins.",
      "Save and invest.",
      "Give back to the world."
    ],
    ageRating: "14+"
  },
  {
    id: "everything-store",
    title: "The Everything Store",
    author: "Brad Stone",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Jeff Bezos wanted to build a store that sold everything. He started with books in a garage. He was obsessed with customers and making things fast. Now Amazon is everywhere!",
    keyLessons: [
      "Obsess over customers, not competitors.",
      "Think long term.",
      "It's always Day 1."
    ]
  },
  {
    id: "losing-my-virginity",
    title: "Losing My Virginity",
    author: "Richard Branson",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "14+",
    summary: "Richard Branson is the fun billionaire. He started a record store, an airline, and even went to space! He proves that business can be an adventure and you should have fun doing it.",
    keyLessons: [
      "Screw it, let's do it.",
      "Have fun in your business.",
      "Protect the downside."
    ]
  },
  {
    id: "grinding-it-out",
    title: "Grinding It Out",
    author: "Ray Kroc",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Ray Kroc was 52 years old when he met the McDonald brothers. He wasn't a young genius; he was a grinder. He saw a great burger system and expanded it to the whole world.",
    keyLessons: [
      "It's never too late to start.",
      "Persistence is the key to success.",
      "Cleanliness and quality matter."
    ]
  },
  {
    id: "pour-your-heart-into-it",
    title: "Pour Your Heart Into It",
    author: "Howard Schultz",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Starbucks wasn't always big. Howard Schultz fell in love with coffee in Italy and wanted to bring that feeling to America. He built a company with heart that treats employees like partners.",
    keyLessons: [
      "Build a company with soul.",
      "Treat employees well.",
      "Chase your vision even when others doubt it."
    ]
  },
  {
    id: "delivering-happiness",
    title: "Delivering Happiness",
    author: "Tony Hsieh",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Zappos sold shoes online, but they were really selling happiness. Tony Hsieh paid people to quit if they weren't happy! He proved that company culture is the most important thing.",
    keyLessons: [
      "Culture is everything.",
      "Deliver WOW through service.",
      "Be a little weird."
    ]
  },
  {
    id: "bad-blood",
    title: "Bad Blood",
    author: "John Carreyrou",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "14+",
    summary: "A spooky true story about a company called Theranos. They promised a magic blood test but it was all a lie! It teaches us that integrity is more important than fame or money.",
    keyLessons: [
      "Don't lie to succeed.",
      "Science is real, you can't fake it.",
      "Integrity matters most."
    ]
  },
  {
    id: "alibaba",
    title: "Alibaba",
    author: "Duncan Clark",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Jack Ma was a teacher who failed many times. He couldn't even get a job at KFC! But he saw the internet coming and built Alibaba, the Amazon of China. He is a crocodile in the Yangtze!",
    keyLessons: [
      "Never give up, even if you fail.",
      "Customers first, employees second, shareholders third.",
      "Think globally."
    ]
  },
  {
    id: "disneys-land",
    title: "Disney’s Land",
    author: "Richard Snow",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "10+",
    summary: "Walt Disney wanted to build a magical place where cartoons came to life. Everyone said it would fail. He risked everything to build Disneyland, the happiest place on earth.",
    keyLessons: [
      "Dream big.",
      "Focus on the details.",
      "Create magic for others."
    ]
  },
  {
    id: "wings-of-fire",
    title: "Wings of Fire",
    author: "A.P.J. Abdul Kalam",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "The story of a boy from a small village who became a rocket scientist and the President of India! It shows that education and hard work can make you fly high.",
    keyLessons: [
      "Dream, dream, dream.",
      "Knowledge is power.",
      "Be simple and humble."
    ]
  },
  {
    id: "open",
    title: "Open",
    author: "Andre Agassi",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "14+",
    summary: "Andre Agassi was a tennis superstar, but he secretly hated tennis! This honest book talks about the pressure of being famous and finding what you actually love in life.",
    keyLessons: [
      "Be honest with yourself.",
      "Success doesn't always equal happiness.",
      "Keep fighting (or playing)."
    ]
  },
  {
    id: "becoming",
    title: "Becoming",
    author: "Michelle Obama",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "From a regular girl in Chicago to the First Lady of the USA. Michelle Obama tells her story of working hard, finding her voice, and not being afraid to be smart.",
    keyLessons: [
      "Your story is what you have.",
      "Work hard and stay humble.",
      "Go high when others go low."
    ]
  },
  {
    id: "greenlights",
    title: "Greenlights",
    author: "Matthew McConaughey",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "14+",
    summary: "Life has red lights (stops) and green lights (go). Matthew McConaughey shares funny and wild stories about how he turned red lights into green lights by taking risks.",
    keyLessons: [
      "Just keep livin'.",
      "Turn bad luck into good luck.",
      "Be the hero of your own movie."
    ]
  },
  {
    id: "will",
    title: "Will",
    author: "Will Smith",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "14+",
    summary: "Will Smith became the biggest movie star in the world by working harder than everyone else. But he learned that being famous doesn't fix your fears. You have to face them.",
    keyLessons: [
      "Lay one brick at a time perfectly.",
      "Face your fears.",
      "Love is the ultimate help."
    ]
  },
  {
    id: "empire-state-of-mind",
    title: "Empire State of Mind",
    author: "Zack O'Malley Greenburg",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Jay-Z wasn't just a rapper; he was a business, man! He turned his music into a clothing line, a record label, and more. He teaches us to own what we create.",
    keyLessons: [
      "I'm not a businessman; I'm a business, man!",
      "Own your masters (your work).",
      "Diversify your hustle."
    ]
  },
  {
    id: "ride-of-a-lifetime",
    title: "The Ride of a Lifetime",
    author: "Robert Iger",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Bob Iger ran Disney. He bought Pixar, Marvel, and Star Wars! He teaches us how to be a calm, kind leader even when managing superheroes and stormtroopers.",
    keyLessons: [
      "Optimism is essential.",
      "Courage to make big bets.",
      "Treat people decently."
    ]
  },
  {
    id: "invent-and-wander",
    title: "Invent and Wander",
    author: "Jeff Bezos",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "A collection of Jeff Bezos' letters. He explains how Amazon stays young by always inventing. He focuses on the customer, not the stock price, and thinks years into the future.",
    keyLessons: [
      "Day 1 mentality.",
      "Customer obsession.",
      "Wander (explore) to invent."
    ]
  },
  {
    id: "iacocca",
    title: "Iacocca",
    author: "Lee Iacocca",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Lee Iacocca saved Chrysler cars from going bankrupt. He was a master salesman who created the Ford Mustang. He teaches us that communication is everything.",
    keyLessons: [
      "Apply yourself.",
      "Communication is key.",
      "If you can't sell, you can't lead."
    ]
  },
  {
    id: "virgin-way",
    title: "The Virgin Way",
    author: "Richard Branson",
    coverUrl: "https://placehold.co/400x600?text=Legend",
    category: "Biography",
    ageRating: "12+",
    summary: "Richard Branson listens more than he talks. He carries a notebook everywhere. This book is about listening to your team and having fun while building an empire.",
    keyLessons: [
      "Listen, learn, laugh, lead.",
      "Follow your passion.",
      "Take care of your people."
    ]
  }
];
