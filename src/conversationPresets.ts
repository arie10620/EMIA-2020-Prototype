export type Preset=readonly [question:string,answer:string];

export const interestPresets:Record<string,readonly Preset[]>={
 "Hiking": [
  [
   "What got you into hiking?",
   "The coastal trail is my favorite! Want to try a short sunset hike after class?"
  ],
  [
   "Which hiking trail would you recommend for a beginner?",
   "I would start with a short, easy route and take time to enjoy the view. Do you prefer a quiet walk or a bigger challenge?"
  ],
  [
   "Do you prefer sunrise or sunset hikes?",
   "Sunset hikes are my pick because I can unwind after class. Would you bring snacks or a camera?"
  ],
  [
   "What is one thing you always pack for a hike?",
   "Water and a snack always make my list. What is your must-have item for a trail day?"
  ]
 ],
 "Photography": [
  [
   "What got you into photography?",
   "I started taking photos around the sundial. The light by the sea is so good near sunset!"
  ],
  [
   "What do you enjoy photographing most?",
   "Little everyday scenes are my favorite: light, buildings, and friends being themselves. What catches your eye?"
  ],
  [
   "Do you prefer phone photography or using a camera?",
   "A phone is great for spontaneous photos, and a camera is fun when I want to slow down. What do you usually use?"
  ],
  [
   "Want to try a small photography challenge around campus?",
   "Let us each take a photo of the same place and compare what we noticed. What theme should we choose?"
  ]
 ],
 "Badminton": [
  [
   "Do you prefer badminton singles or doubles?",
   "Doubles is fun because there is more teamwork. Do you like playing at the net or covering the back court?"
  ],
  [
   "How did you get into badminton?",
   "I started by playing casually with friends. What made you want to pick up a racket?"
  ],
  [
   "Which badminton shot would you like to practice?",
   "I would like to get more consistent with my drop shots. Want to trade a few easy rallies first?"
  ],
  [
   "Would you be up for a beginner-friendly badminton game?",
   "Definitely. I would rather have a relaxed game than worry about the score. What pace would feel comfortable?"
  ]
 ],
 "Cats": [
  [
   "What is your favorite thing about cats?",
   "Cats immediately make my day better. I have an entire folder of campus cat photos!"
  ],
  [
   "Do you have a favorite cat photo or story?",
   "The funniest ones are when a cat looks completely unimpressed by everything. What is the story behind your favorite photo?"
  ],
  [
   "Do you prefer playful cats or sleepy cats?",
   "Sleepy cats are wonderfully calming, but a playful cat is hard to resist. Which personality do you like?"
  ],
  [
   "If you could name a fictional campus cat, what would you choose?",
   "I would name it Mochi, especially if it liked curling up in a sunny spot. What name would you pick?"
  ]
 ],
 "Cooking": [
  [
   "What is your go-to meal when you cook between classes?",
   "I like simple meals with ingredients I can use again the next day. What is your easiest reliable recipe?"
  ],
  [
   "Which cooking skill would you like to learn?",
   "I would like to become better at seasoning without needing to check a recipe. What skill would make cooking easier for you?"
  ],
  [
   "Is there a dish that reminds you of home?",
   "Comfort food is often about the people and memories around it. Who first made that dish for you?"
  ],
  [
   "Would you rather cook together or swap easy recipes?",
   "A recipe swap sounds like a nice way to start. Shall we each suggest something with only a few ingredients?"
  ]
 ],
 "Anime": [
  [
   "Which anime would you recommend to a new viewer?",
   "I would choose something with a strong story that is easy to get into. Do you usually like comedy, adventure, or quieter stories?"
  ],
  [
   "What makes an anime memorable for you?",
   "Characters I can care about make the biggest difference. Is there a character whose story stayed with you?"
  ],
  [
   "Do you prefer a short anime series or a long adventure?",
   "Short series are easier to fit around coursework, but a long adventure can be rewarding. What are you watching lately?"
  ],
  [
   "Do you have a favorite anime soundtrack or opening?",
   "A good opening can put me in the mood for an entire episode. Which one would you put on a playlist?"
  ]
 ],
 "Cozy games": [
  [
   "What got you into cozy games?",
   "I love a cozy co-op game after a long day. What have you been playing lately?"
  ],
  [
   "What makes a game feel cozy to you?",
   "A gentle pace and being able to explore without rushing do it for me. Is it the music, the art, or the activities for you?"
  ],
  [
   "Do you prefer farming, decorating, or exploring in cozy games?",
   "Decorating is relaxing, although I can spend ages choosing a layout. What do you enjoy most?"
  ],
  [
   "Would you like to try a relaxed co-op game sometime?",
   "That sounds nice. We could pick something easy to learn and play for a short session. What kind of game would you choose?"
  ]
 ],
 "RPGs": [
  [
   "What do you enjoy most about RPGs?",
   "I love getting drawn into a world and making choices for my character. Do you focus more on the story or the combat?"
  ],
  [
   "What role do you usually choose in an RPG party?",
   "I often choose a support role because helping the team feels satisfying. What role suits your play style?"
  ],
  [
   "Do you prefer turn-based or action RPGs?",
   "Turn-based games give me time to plan, while action games feel more immediate. Which style do you reach for after class?"
  ],
  [
   "What would your ideal RPG side quest be?",
   "A little mystery with an unexpected friendship would be fun. Would your side quest be funny, challenging, or cozy?"
  ]
 ],
 "Indie music": [
  [
   "What got you into indie music?",
   "I like finding a song that feels like a hidden gem. Which artist would you recommend first?"
  ],
  [
   "Which indie song belongs on a study-break playlist?",
   "I would pick something mellow enough to unwind to. What song have you been replaying recently?"
  ],
  [
   "Do you enjoy discovering music live or through playlists?",
   "Playlists help me explore, but hearing a small live set can be special. How do you usually find new artists?"
  ],
  [
   "If we swapped one indie music recommendation, what would yours be?",
   "I would send a song that has a warm melody and thoughtful lyrics. What should I listen for in your pick?"
  ]
 ],
 "Jazz": [
  [
   "What do you enjoy about jazz?",
   "I like how a performance can feel familiar and surprising at the same time. What first drew you in?"
  ],
  [
   "Which jazz instrument do you notice first?",
   "The piano often catches my attention, especially in a small group. Which instrument would you like to hear more of?"
  ],
  [
   "Do you prefer jazz for focused study or for relaxing?",
   "I usually listen when I want to slow down after studying. Do you choose instrumental tracks or vocals?"
  ],
  [
   "What jazz track would you put on a beginner playlist?",
   "I would start with something melodic and easy to settle into. What would you suggest as the next track?"
  ]
 ],
 "Sci-fi films": [
  [
   "What do you enjoy most about sci-fi films?",
   "I like stories that use an imagined future to ask a human question. Do you enjoy space adventures or smaller thought experiments?"
  ],
  [
   "Which sci-fi film would you watch again with a friend?",
   "I would choose one with ideas worth discussing afterward. What question would you want to talk about after watching?"
  ],
  [
   "Would you rather explore space or a futuristic city in a sci-fi story?",
   "A futuristic city sounds fascinating because I would want to see everyday life there. What would you explore first?"
  ],
  [
   "What fictional sci-fi invention would make student life easier?",
   "A machine that helps organize a busy week would be tempting. What would your invention actually do?"
  ]
 ],
 "Bouldering": [
  [
   "How did you get into bouldering?",
   "I liked the idea of solving a small physical puzzle one move at a time. What made you want to try it?"
  ],
  [
   "What do you enjoy about working on a bouldering route?",
   "Figuring out a new approach is satisfying even before I finish the route. Do you like planning first or experimenting?"
  ],
  [
   "Which bouldering technique would you like to practice?",
   "I would like to become more deliberate with my foot placement. What is one thing you are working on?"
  ],
  [
   "Would you prefer a relaxed beginner bouldering session?",
   "A relaxed session sounds good, with time to rest and talk between attempts. What would make a first session comfortable for you?"
  ]
 ],
 "Coffee": [
  [
   "What got you into coffee?",
   "A coffee break sounds perfect. Shall we meet by the library after class?"
  ],
  [
   "What is your usual coffee order?",
   "I often go for something simple, but I like trying a different order occasionally. What do you enjoy about your usual choice?"
  ],
  [
   "Do you prefer coffee while studying or during a proper break?",
   "I prefer taking a real break so I can enjoy it without rushing. What makes a good study break for you?"
  ],
  [
   "If we had a short coffee break, what would you want to chat about?",
   "Something light would be nice: music, weekend plans, or a funny moment from the week. What would you pick?"
  ]
 ],
 "Baking": [
  [
   "What do you enjoy baking most?",
   "Cookies are a fun choice because there is plenty of room to experiment. What is your favorite thing to make?"
  ],
  [
   "Which baking recipe would you suggest to a beginner?",
   "I would start with a simple recipe and focus on getting comfortable with the process. What would you like to try first?"
  ],
  [
   "Do you prefer baking something sweet or savory?",
   "I usually lean sweet, but a savory snack is great to share after class. What would be your ideal snack?"
  ],
  [
   "What is a baking experiment you would like to try?",
   "I would like to test two versions of the same recipe and compare them with friends. What ingredient would you change?"
  ]
 ],
 "Board games": [
  [
   "What is your favorite type of board game?",
   "Cooperative games are fun because everyone gets to solve the problem together. Do you enjoy teamwork or friendly competition?"
  ],
  [
   "Which board game would you teach to a new group?",
   "I would choose something with a short explanation and a quick first round. What is your easiest game to teach?"
  ],
  [
   "Do you prefer board games with strategy or funny surprises?",
   "A bit of both keeps things lively. Do you like planning carefully or adapting as you go?"
  ],
  [
   "Would you join a short board game session after class?",
   "That sounds like a good way to meet people without too much pressure. How many people would make a comfortable group for you?"
  ]
 ],
 "Running": [
  [
   "What got you into running?",
   "I like having a simple way to clear my head after a busy day. Do you run for relaxation, fitness, or a personal goal?"
  ],
  [
   "Do you prefer running alone or with a friend?",
   "An easy run with a friend is nice when we can keep a comfortable pace. What do you prefer?"
  ],
  [
   "What helps you stay motivated to run regularly?",
   "Keeping the goal small makes it easier to get started. What kind of routine works for your week?"
  ],
  [
   "Would you rather try an easy run or a walk-and-talk?",
   "A walk-and-talk is a great starting point, and we can decide on the pace together. What would feel comfortable for you?"
  ]
 ],
 "Table tennis": [
  [
   "Do you prefer table tennis singles or doubles?",
   "Doubles sounds fun because there is more teamwork. Do you already have a playing partner?"
  ],
  [
   "What got you into table tennis?",
   "I like that a short game can be a good break between other activities. How did you first start playing?"
  ],
  [
   "Which table tennis skill would you like to practice?",
   "I would like to become more consistent with serves and returns. Want to start with a few relaxed rallies?"
  ],
  [
   "Would you be up for a casual table tennis game after class?",
   "Sure. We could keep the first game friendly and focus on getting a rally going. What time usually works for you?"
  ]
 ],
 "Programming": [
  [
   "What do you enjoy making with programming?",
   "Small projects that solve an everyday problem are satisfying. Is there something you would like to build?"
  ],
  [
   "Which programming language are you exploring at the moment?",
   "I like choosing a language by the kind of project I want to make. What are you hoping to use yours for?"
  ],
  [
   "What is a programming bug that taught you something useful?",
   "Tracing a problem one small step at a time has helped me a lot. How did you finally figure yours out?"
  ],
  [
   "Would you like to brainstorm a small programming project together?",
   "That sounds fun. We could start with one useful feature instead of a huge idea. What problem would you choose?"
  ]
 ],
 "Design": [
  [
   "What kind of design do you enjoy most?",
   "I like design that makes an everyday task feel clearer and easier. Are you more interested in interfaces, graphics, or physical things?"
  ],
  [
   "What is an app or object with a design detail you appreciate?",
   "A small detail that saves effort can make a big difference. What does that detail help you do?"
  ],
  [
   "Do you start a design idea with sketches or with references?",
   "Quick sketches help me think without getting stuck polishing too early. How do you usually begin?"
  ],
  [
   "Would you like to compare ideas for improving a campus app?",
   "I would start with a task students do often and ask what feels frustrating. Which task would you redesign first?"
  ]
 ],
 "Swimming": [
  [
   "What do you enjoy most about swimming?",
   "I like the steady rhythm and having a break from a busy day. What makes swimming enjoyable for you?"
  ],
  [
   "Which swimming stroke do you like practicing?",
   "I enjoy working on a smooth, comfortable rhythm rather than rushing. What do you like about your preferred stroke?"
  ],
  [
   "Do you prefer swimming as a relaxed break or a structured workout?",
   "A relaxed session is usually my choice after class. What kind of session fits your week?"
  ],
  [
   "Would you like to plan a relaxed swimming session sometime?",
   "That could be nice. We could choose a comfortable time and each go at our own pace. What would work for you?"
  ]
 ]
};

export const coursePresets:Record<string,readonly Preset[]>={
 "COMP 1021": [
  [
   "For {class}, which Python idea has been most interesting so far?",
   "Breaking a problem into small steps is the part I enjoy most. Which idea would you like to try in a little program?"
  ],
  [
   "How do you approach a tricky programming exercise in {class}?",
   "I start with a tiny example and write down what I expect to happen. What is your first step when you get stuck?"
  ],
  [
   "Would you like to compare study approaches for {class}?",
   "I find it helpful to explain my reasoning aloud before looking at another approach. Would you prefer comparing notes or practicing a fresh example?"
  ],
  [
   "What small project would make the ideas from {class} useful to you?",
   "A small tool for organizing student life would be fun. What is one feature you would build first?"
  ]
 ],
 "LANG 1403": [
  [
   "For {class}, which part of academic writing do you want to improve?",
   "I would like to make my main point clearer before adding details. What part of writing takes you the longest?"
  ],
  [
   "How do you get comfortable speaking in a presentation for {class}?",
   "Practicing a short opening helps me settle in. Do you like rehearsing with a friend or recording yourself?"
  ],
  [
   "Would you like to exchange outline feedback for {class}?",
   "That sounds useful. We could first check whether the main idea and structure are easy to follow. What kind of feedback would help you most?"
  ],
  [
   "What makes a group discussion in {class} easier to join?",
   "A clear question and time to think make a difference for me. Do you prefer starting with a pair discussion?"
  ]
 ],
 "MATH 1013": [
  [
   "For {class}, do you prefer learning calculus visually or through worked examples?",
   "A sketch helps me understand the idea, and then a worked example makes it concrete. What helps it click for you?"
  ],
  [
   "Which calculus idea from {class} would you like to explain to a study buddy?",
   "I would start by describing what the symbols mean in everyday language. Which part would you choose to explain first?"
  ],
  [
   "How do you check your reasoning on a problem for {class}?",
   "I try a simple case and ask whether the result makes sense. What checking method works for you?"
  ],
  [
   "Would you like to work through a fresh practice problem for {class}?",
   "Sure. We could each try it first and then compare our reasoning. Would you rather start with a familiar idea or a new challenge?"
  ]
 ],
 "COMP 2011": [
  [
   "For {class}, which C++ concept would you like to understand better?",
   "I find it helpful to trace a small example step by step. Is there a concept you would like to draw out together?"
  ],
  [
   "How do you debug a small program for {class}?",
   "I narrow the problem down and check one assumption at a time. Do you prefer adding a small test or tracing values first?"
  ],
  [
   "What makes code easy to read when you study for {class}?",
   "Clear names and small, focused pieces help me follow the logic. What detail do you notice first?"
  ],
  [
   "Would you like to discuss a small C++ project related to {class}?",
   "A project with one clear goal would be a good start. What would make the project interesting to you?"
  ]
 ],
 "COMP 2211": [
  [
   "For {class}, which everyday use of AI are you most curious about?",
   "I am curious about tools that help people understand information. Which use would you want to explore?"
  ],
  [
   "What is a question you would like to investigate in {class}?",
   "I would ask how a system behaves when the examples change. What kind of question interests you?"
  ],
  [
   "How would you explain an AI idea from {class} to a friend?",
   "I would start with a familiar situation and build the explanation from there. Which idea would you try explaining?"
  ],
  [
   "Would you like to brainstorm a small AI project for {class}?",
   "Let us start with a clear task and think about what examples it would need. What task would you choose?"
  ]
 ],
 "ISOM 1700": [
  [
   "For {class}, what everyday process would you like to understand better?",
   "A busy queue is a good place to start noticing tradeoffs. Is there a process on campus you would investigate?"
  ],
  [
   "What makes a business operations example interesting in {class}?",
   "I like examples where a small change affects several people differently. Which tradeoff caught your attention?"
  ],
  [
   "Would you like to compare perspectives on a case from {class}?",
   "Sure. We could each name the main problem before proposing a solution. What perspective would you start with?"
  ],
  [
   "How would you improve a simple campus service using ideas from {class}?",
   "I would first find out where people experience delays or confusion. Which service would you choose?"
  ]
 ],
 "MARK 2120": [
  [
   "For {class}, what campaign or brand example caught your attention?",
   "I find it interesting when a message is clear about who it is for. What made the example stand out to you?"
  ],
  [
   "How would you describe the audience for an idea in {class}?",
   "I would think about what people need and what gets in their way. Which audience would you like to understand better?"
  ],
  [
   "Would you like to brainstorm a student event pitch for {class}?",
   "We could start with the event experience and explain why someone would want to join. What kind of event would you pick?"
  ],
  [
   "What makes a marketing message feel convincing in {class}?",
   "A clear benefit and a message that fits the audience help me understand it. What makes you pay attention?"
  ]
 ],
 "PHYS 1112": [
  [
   "For {class}, which physics idea can you connect to everyday life?",
   "I enjoy looking for a familiar example before working through the symbols. What everyday situation comes to mind for you?"
  ],
  [
   "Do diagrams or equations help you more when studying {class}?",
   "A diagram helps me organize the situation before I choose an equation. What does your first step usually look like?"
  ],
  [
   "How do you check whether an answer makes sense in {class}?",
   "I look at the units and try imagining an extreme case. What is your favorite way to check?"
  ],
  [
   "Would you like to talk through a fresh practice example for {class}?",
   "That sounds useful. We could explain each step instead of just comparing final answers. What topic should we start with?"
  ]
 ],
 "HUMA 1000": [
  [
   "For {class}, which discussion question made you think the most?",
   "I like questions that let people explain different experiences and values. What made the question interesting to you?"
  ],
  [
   "How do you approach a reading for {class}?",
   "I note the main claim and one question I would like to discuss. Do you annotate as you read or summarize afterward?"
  ],
  [
   "What makes a respectful disagreement useful in {class}?",
   "Trying to understand the reasoning before responding helps me learn from another view. What makes a discussion feel comfortable to you?"
  ],
  [
   "Would you like to compare interpretations of an idea from {class}?",
   "I would enjoy that. We could each explain what stood out before looking for common ground. What idea would you choose?"
  ]
 ]
};

export const generalPresets:Record<string,readonly Preset[]>={
 "Campus life": [
  [
   "What is your favourite spot on campus for a break?",
   "I like a quiet spot where I can relax for a few minutes. Do you prefer a sea view or somewhere indoors?"
  ],
  [
   "What has been a small highlight of your week on campus?",
   "An unplanned chat after class can make my day. What small thing has made you smile recently?"
  ],
  [
   "Is there a campus activity you have been curious about?",
   "I would like to try something where beginners can join comfortably. What would you be interested in exploring?"
  ],
  [
   "What is one thing you wish you had known before starting university?",
   "I wish I had known that saying a simple hello is often enough to start a friendship. What would you tell a new student?"
  ]
 ],
 "Study habits": [
  [
   "What helps you get started when you have a lot to study?",
   "Choosing one small task helps me begin without getting overwhelmed. Do you like a checklist or a set time to start?"
  ],
  [
   "Do you prefer studying quietly together or talking through ideas?",
   "A mix works well for me: quiet time first, then a short discussion. What kind of session would help you?"
  ],
  [
   "What does a good study break look like for you?",
   "Stepping away from the screen for a few minutes helps me reset. Do you prefer a walk, a snack, or a quick chat?"
  ],
  [
   "Would you like to try a short study session with a clear goal?",
   "That sounds manageable. We could each choose one task and check in afterward. What would your task be?"
  ]
 ],
 "Weekend plans": [
  [
   "What would you like to try together this semester?",
   "Something easy to join would be nice, like a walk or a casual game. What have you been wanting to try?"
  ],
  [
   "What is your ideal low-key weekend?",
   "A bit of rest, something enjoyable, and time with a friend would be a good balance. What would you include?"
  ],
  [
   "Would you rather explore somewhere new or revisit a favorite place?",
   "I like exploring when there is no rush, but familiar places can be comforting too. What are you in the mood for?"
  ],
  [
   "If you had a free afternoon, how would you spend it?",
   "I would choose one simple activity instead of packing in too much. What would make the afternoon feel worthwhile to you?"
  ]
 ],
 "Meetup ideas": [
  [
   "Would you like to have a short coffee or tea break after class?",
   "A short break sounds good. We could choose a convenient public spot and a time that works for both of us. When are you usually free?"
  ],
  [
   "Would you feel more comfortable meeting one-to-one or in a small group?",
   "Either can work. I would be happy to choose whichever feels more relaxed for you. What would you prefer?"
  ],
  [
   "Would a walk-and-talk or a seated chat suit you better?",
   "A seated chat is nice when I am tired, and a short walk can be refreshing. What would suit your day?"
  ],
  [
   "What would make a first meetup feel easy and relaxed?",
   "Keeping it short and choosing a familiar place would help me. Is there anything that would make it more comfortable for you?"
  ]
 ]
};
