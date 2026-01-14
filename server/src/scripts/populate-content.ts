import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';
import Film from '../models/Film';
import Project from '../models/Project';

dotenv.config();

const blogPosts = [
  {
    title: "I Watched 300 Warriors Fight (And Made It Look Real)",
    slug: "making-the-woman-king-battle-sequences",
    excerpt: "Behind the scenes of creating epic battle sequences for The Woman King—where practical stunts meet digital magic, and every frame tells a story of warrior women who changed history.",
    content: `<h2>The Call That Changed Everything</h2>
<p>When I got the call to work on The Woman King, I knew this wasn't going to be just another VFX gig. This was Viola Davis leading an army of warrior women in one of the most ambitious historical epics in recent memory. No pressure, right?</p>

<h2>300 Warriors, One Impossible Shot</h2>
<p>Picture this: It's day 47 of production, and we're shooting the climactic battle sequence. On set, we have about 80 stunt performers giving their all. In the final film? We needed 300+ warriors charging across the battlefield.</p>

<p>This is where VFX becomes both art and mathematics. We captured every angle of those 80 performers—their movements, their weapons, the way dust kicked up around their feet. Then came the digital multiplication: creating crowd simulations that felt organic, not copy-pasted.</p>

<h2>The Detail That Almost Broke Us</h2>
<p>Here's what they don't tell you in VFX school: historical accuracy is a nightmare. Every piece of armor, every weapon, every fabric texture had to be period-accurate. We spent weeks researching 19th-century Dahomey military equipment.</p>

<p>The director, Gina Prince-Bythewood, had one non-negotiable rule: "Make it feel real." That meant no glossy Hollywood sheen. These warriors were covered in dust, sweat, and blood. Every digital extension had to match that gritty, grounded aesthetic.</p>

<h2>When Practical Meets Digital</h2>
<p>The best VFX is invisible. In The Woman King, we used digital effects to enhance, not replace. Real stunt performers did the close-up combat. We extended the battlefield, multiplied the armies, and added environmental elements that would have been impossible to shoot practically.</p>

<p>One of my favorite shots: a sweeping aerial view of the battlefield. What you see is 30% practical footage, 70% digital extension. But you'd never know where one ends and the other begins. That's the goal.</p>

<h2>What I Learned</h2>
<p>Working on The Woman King taught me that great VFX serves the story, not the spectacle. Every digital warrior we added wasn't just filling space—they were part of a narrative about courage, sisterhood, and resistance.</p>

<p>Also, I learned to never underestimate the importance of dust simulation. Seriously, we spent an embarrassing amount of time perfecting digital dust clouds.</p>`,
    category: "Behind the Scenes",
    tags: ["The Woman King", "VFX", "Battle Sequences", "Film Production", "Historical Epic"],
    author: {
      name: "Felipe Almeida",
      bio: "VFX Compositor who's made warriors fly, demons possess, and comedies... well, funnier.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
      alt: "Epic battle scene production"
    },
    status: "published",
    featured: true,
    publishedAt: new Date('2024-12-15'),
  },
  {
    title: "The Day We Made Blood Rain Upwards: Evil Dead Rise VFX Secrets",
    slug: "evil-dead-rise-vfx-secrets",
    excerpt: "Horror VFX is a different beast. Here's how we created some of the most disturbing visuals in Evil Dead Rise—and why practical effects still matter in 2023.",
    content: `<h2>The Shot That Haunted My Dreams</h2>
<p>There's a scene in Evil Dead Rise where blood doesn't just flow—it defies gravity, crawling up walls like it's alive. When the director pitched this to us, my first thought was: "That's going to be a nightmare to composite." My second thought: "This is going to be amazing."</p>

<h2>Practical First, Digital Second</h2>
<p>Here's the truth about modern horror VFX: the best scares still start with practical effects. We had gallons of fake blood on set, practical puppets, and makeup artists who are basically magicians. My job? Make it even more disturbing.</p>

<p>For the blood-crawling-up-walls shot, we filmed real blood flowing down (gravity is easier to work with), then digitally reversed and enhanced it. But here's the trick: we added subtle digital tendrils, made it move slightly wrong, just enough to trigger that uncanny "something's not right" feeling.</p>

<h2>The Possession Sequence</h2>
<p>The possession transformations were a masterclass in restraint. We could have gone full CGI, but the director wanted to keep the actors' performances visible. So we enhanced: deepened shadows around the eyes, added subtle skin texture changes, made veins more prominent.</p>

<p>The most effective shot? A simple eye color change that we made happen gradually over 30 frames. Audiences don't consciously notice it happening, but their subconscious does. That's what makes it creepy.</p>

<h2>Gore, But Make It Artistic</h2>
<p>There's a fine line between horror and comedy, and it's usually measured in how realistic your gore looks. Too fake, and it's laughable. Too real, and it's just gross. We aimed for that sweet spot: stylized enough to be cinematic, realistic enough to make you squirm.</p>

<p>Digital blood simulation has come a long way. We can now control viscosity, flow patterns, even how it interacts with different surfaces. For Evil Dead Rise, we created a custom blood shader that made it look slightly thicker, darker, and more... wrong than normal blood.</p>

<h2>The Sound Design Secret</h2>
<p>Here's something most people don't know: VFX artists work closely with sound designers. A mediocre visual effect can become terrifying with the right sound. That blood-crawling-up-walls shot? The squelching, wet sounds sell it as much as the visuals.</p>

<h2>Why Horror VFX Is Different</h2>
<p>In action films, you want VFX to be spectacular. In horror, you want it to be unsettling. Sometimes that means making things look slightly off, slightly wrong. It's about creating discomfort, not spectacle.</p>

<p>Working on Evil Dead Rise reminded me why I love horror VFX: you get to break all the rules. Physics? Forget it. Realism? Only when it serves the scare. It's the most creative freedom I've had on any project.</p>`,
    category: "Behind the Scenes",
    tags: ["Evil Dead Rise", "Horror", "VFX", "Practical Effects", "Blood Effects"],
    author: {
      name: "Felipe Almeida",
      bio: "VFX Compositor who's made warriors fly, demons possess, and comedies... well, funnier.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=600&fit=crop",
      alt: "Dark horror atmosphere"
    },
    status: "published",
    featured: true,
    publishedAt: new Date('2024-11-20'),
  },
  {
    title: "From Netflix Comedy to Apple TV Epic: What 7 Shows in One Year Taught Me",
    slug: "seven-shows-one-year-lessons",
    excerpt: "The brutal, beautiful reality of working on Me Time, See, Good Omens, and more—all while trying to remember which project I'm supposed to be working on today.",
    content: `<h2>The Year I Forgot What Sleep Was</h2>
<p>2022 was insane. I worked on seven different productions: Netflix comedies, Apple TV sci-fi epics, Amazon fantasy series. Different genres, different studios, different continents (thanks, remote work). I learned more in those 12 months than in my previous five years combined.</p>

<h2>Monday: Making Kevin Hart Funny (Digitally)</h2>
<p>Me Time was my first major Netflix comedy. Here's what nobody tells you about VFX in comedies: timing is everything. A visual gag that lands 2 frames too late? Not funny. We spent hours fine-tuning the timing of digital effects to match the comedic beats.</p>

<p>Comedy VFX is also about invisibility. You're enhancing jokes, not creating spectacle. That pratfall? We removed the safety wire. That explosion? We made it bigger, but not so big it overshadows the punchline.</p>

<h2>Wednesday: Building a Post-Apocalyptic World</h2>
<p>See (Apple TV+) was the complete opposite. Dystopian sci-fi where humanity has lost the ability to see. Every environment had to feel both futuristic and primitive. We created overgrown cities, nature reclaiming civilization, all while maintaining the show's grounded aesthetic.</p>

<p>The challenge? Making a visually stunning show about people who can't see. Every VFX shot had to serve the story, not just look cool. Though some shots looked really cool.</p>

<h2>Friday: Angels, Demons, and Deadline Panic</h2>
<p>Good Omens was pure creative joy. Fantasy VFX where you can break reality's rules—as long as you do it consistently. We created everything from subtle miracles to full-blown apocalyptic visions.</p>

<p>Working on a show with such a devoted fanbase was terrifying and exciting. Every frame gets scrutinized. Every effect needs to match the tone of the beloved source material. No pressure.</p>

<h2>The Juggling Act</h2>
<p>Here's the reality of working on multiple shows: you develop a weird mental compartmentalization. Monday morning, I'm thinking about comedic timing for Netflix. Monday afternoon, I'm creating dystopian landscapes for Apple TV. Tuesday, I'm making demons look menacing for Amazon.</p>

<p>Each project has different technical requirements, different aesthetic goals, different approval processes. You learn to switch gears fast.</p>

<h2>What I Learned About the Industry</h2>
<p><strong>1. Networking happens naturally:</strong> Good work leads to recommendations. The VFX supervisor from Me Time recommended me for See. The producer from See connected me with Good Omens. It's a small industry.</p>

<p><strong>2. Versatility is valuable:</strong> Being able to work across genres makes you more hireable. Studios want artists who can adapt.</p>

<p><strong>3. Remote work changed everything:</strong> I worked on shows filming in New Zealand, the UK, and the US—all from my home office. The future is distributed teams.</p>

<p><strong>4. Burnout is real:</strong> Seven shows in one year? Don't recommend it. I learned to say no, to set boundaries, to protect my mental health. The work will always be there. Your well-being won't if you don't take care of it.</p>

<h2>The Best Part</h2>
<p>Despite the chaos, 2022 was the year I truly found my voice as a VFX artist. Each project taught me something new. Each genre pushed me in different directions. I'm not the same artist I was at the start of that year.</p>

<p>Also, I have some really cool credits on my IMDb page now. That doesn't hurt.</p>`,
    category: "Industry",
    tags: ["Career", "VFX Industry", "Multiple Projects", "Work-Life Balance", "Industry Insights"],
    author: {
      name: "Felipe Almeida",
      bio: "VFX Compositor who's made warriors fly, demons possess, and comedies... well, funnier.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=600&fit=crop",
      alt: "VFX artist workspace"
    },
    status: "published",
    featured: false,
    publishedAt: new Date('2024-10-10'),
  },
  {
    title: "AI Didn't Steal My Job—It Made Me 10x Faster",
    slug: "ai-vfx-reality-check",
    excerpt: "The honest truth about AI in VFX: what it can do, what it can't do, and why I'm not worried about robots taking over (yet).",
    content: `<h2>The Panic Was Real</h2>
<p>Two years ago, when AI tools started appearing in VFX pipelines, the industry freaked out. "AI will replace artists!" "VFX jobs are doomed!" I'll admit, I was worried too.</p>

<p>Then I actually started using AI tools. And everything changed.</p>

<h2>What AI Actually Does in My Workflow</h2>
<p><strong>Rotoscoping:</strong> This used to be the bane of my existence. Manually tracing objects frame by frame, sometimes for thousands of frames. Now? AI-assisted roto tools do 80% of the work in minutes. I spend my time refining and perfecting, not mindlessly tracing.</p>

<p><strong>Object removal:</strong> Removing wires, rigs, and unwanted elements used to take hours. AI-powered content-aware fill does it in seconds. Is it perfect? No. Do I still need to clean it up? Yes. But it's a massive time-saver.</p>

<p><strong>Upscaling and restoration:</strong> AI upscaling has saved projects where we only had low-res source material. It's not magic, but it's close.</p>

<h2>What AI Can't Do (Yet)</h2>
<p>Here's what AI tools still struggle with:</p>
<ul>
<li><strong>Creative decisions:</strong> AI can't tell you if a shot feels right, if the color grade matches the mood, if the effect serves the story.</li>
<li><strong>Complex problem-solving:</strong> When a shot isn't working, AI can't figure out why or propose creative solutions.</li>
<li><strong>Client communication:</strong> AI can't interpret vague director notes like "make it more... you know, cinematic."</li>
<li><strong>Artistic judgment:</strong> Knowing when to break the rules, when to push boundaries, when to keep it subtle—that's still human territory.</li>
</ul>

<h2>The Real Impact on My Career</h2>
<p>AI hasn't replaced me. It's made me more valuable. Here's why:</p>

<p><strong>I'm faster:</strong> Tasks that took days now take hours. I can take on more projects, deliver faster, and still maintain quality.</p>

<p><strong>I'm more creative:</strong> When I'm not spending 8 hours on rotoscoping, I have more mental energy for creative problem-solving.</p>

<p><strong>I'm more competitive:</strong> Studios want artists who embrace new tools. Being AI-literate is now as important as knowing Nuke or After Effects.</p>

<h2>How I'm Future-Proofing My Career</h2>
<p><strong>1. Learn the tools:</strong> I spend time every week exploring new AI tools. Some are game-changers, some are gimmicks. You need to know the difference.</p>

<p><strong>2. Focus on skills AI can't replicate:</strong> Creative direction, client communication, artistic judgment, problem-solving. These are my competitive advantages.</p>

<p><strong>3. Embrace the hybrid workflow:</strong> The future isn't human OR AI—it's human AND AI. The best artists will be those who know how to leverage both.</p>

<h2>The Honest Truth</h2>
<p>Will AI eventually be able to do everything I do? Maybe. But by then, the job will have evolved into something different. It always does.</p>

<p>The VFX artists who survived the transition from practical to digital weren't the ones who resisted change—they were the ones who adapted. Same applies now.</p>

<p>AI is a tool. A powerful one, sure. But it's still just a tool. And tools don't make art. Artists do.</p>`,
    category: "AI & Film",
    tags: ["AI", "VFX", "Technology", "Career", "Industry Future"],
    author: {
      name: "Felipe Almeida",
      bio: "VFX Compositor who's made warriors fly, demons possess, and comedies... well, funnier.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&h=600&fit=crop",
      alt: "AI and technology concept"
    },
    status: "published",
    featured: true,
    publishedAt: new Date('2024-09-05'),
  },
  {
    title: "The Shot That Almost Broke Me (And How I Fixed It)",
    slug: "the-impossible-shot",
    excerpt: "Every VFX artist has that one shot that haunts them. This is mine—a seemingly simple request that turned into a three-week nightmare, and the breakthrough that saved it.",
    content: `<h2>It Started Simple</h2>
<p>"We need to extend the background in this shot. Should be easy, right?"</p>

<p>Famous last words.</p>

<p>The shot: a 45-second continuous take of an actor walking through a corridor. The problem: the practical set only extended 15 feet. We needed to make it look like a 100-foot hallway. Oh, and the camera was handheld, constantly moving, with complex lighting changes throughout.</p>

<p>How hard could it be?</p>

<h2>Attempt #1: The Obvious Solution</h2>
<p>My first approach: shoot clean plates of the corridor, then digitally extend and loop them. Spent a week on it. Looked terrible. The perspective was wrong, the lighting didn't match, and you could see the repetition.</p>

<p>The director's note: "This looks like a video game from 2005."</p>

<p>Ouch.</p>

<h2>Attempt #2: The Expensive Solution</h2>
<p>Okay, new plan: full 3D reconstruction of the corridor. Model everything, match the lighting, render it out. This is what the big studios do, right?</p>

<p>Two weeks later, I had a beautiful 3D model that still didn't look right. The textures were too clean, the lighting too perfect. It looked CG because it WAS CG.</p>

<p>The director's note: "Can we just reshoot this?"</p>

<p>We could not just reshoot this. The set was already struck, the actor was on another continent, and we were out of budget.</p>

<h2>The 3 AM Breakthrough</h2>
<p>It was 3 AM on a Friday. I was stress-eating my third bag of chips, staring at this shot for the thousandth time. And then I saw it.</p>

<p>The solution wasn't to make it perfect—it was to make it imperfect in the right way.</p>

<p>I went back to my 3D model, but this time I deliberately made it worse. Added lens distortion. Introduced subtle tracking errors. Made the textures slightly blurry. Added film grain. Made the lighting slightly inconsistent.</p>

<p>I made the CG look like it was shot on the same camera, with the same imperfections, as the practical footage.</p>

<h2>The Final Result</h2>
<p>Monday morning, I sent the new version to the director. Held my breath.</p>

<p>"Perfect. Approved."</p>

<p>Two words. After three weeks of hell, two words.</p>

<h2>What I Learned</h2>
<p><strong>1. Perfect is the enemy of good:</strong> Sometimes the most realistic VFX is slightly imperfect. Real cameras have flaws. Real footage has artifacts. Match those, and your CG will blend seamlessly.</p>

<p><strong>2. Step away:</strong> I was so deep in the technical details that I lost sight of the bigger picture. That 3 AM breakthrough came because I was too tired to overthink it.</p>

<p><strong>3. Every "impossible" shot is possible:</strong> It just might require a completely different approach than you initially thought.</p>

<p><strong>4. Keep your chip stash well-stocked:</strong> You never know when you'll need stress food at 3 AM.</p>

<h2>The Shot That Haunts Me</h2>
<p>I still think about this shot sometimes. Not because it was my best work—it wasn't. But because it taught me more about VFX than any tutorial or course ever could.</p>

<p>Sometimes the best lessons come from the shots that almost break you.</p>`,
    category: "Tutorial",
    tags: ["VFX", "Problem Solving", "Behind the Scenes", "Lessons Learned", "Compositing"],
    author: {
      name: "Felipe Almeida",
      bio: "VFX Compositor who's made warriors fly, demons possess, and comedies... well, funnier.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop",
      alt: "Challenging VFX work"
    },
    status: "published",
    featured: false,
    publishedAt: new Date('2024-08-15'),
  }
];

const films = [
  {
    title: "The Woman King",
    slug: "the-woman-king",
    description: "A historical epic about the Agojie, an all-female warrior unit who protected the African Kingdom of Dahomey in the 1800s.",
    detailedDescription: "<p>The Woman King is a 2022 historical epic. As a Compositor, I contributed to creating the epic battle sequences and environment extensions.</p>",
    year: 2022,
    role: "Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BNzM4ODY0NzctZDIyNC00MzE4LWI3NDYtYjIyYTUyZWFmYzJkXkEyXkFqcGc@.jpg",
      alt: "The Woman King Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt8093700/",
    featured: true,
    order: 1,
    tags: ["Historical", "Action", "Drama", "VFX"]
  },
  {
    title: "Evil Dead Rise",
    slug: "evil-dead-rise",
    description: "A twisted tale of two estranged sisters whose reunion is cut short by the rise of flesh-possessing demons.",
    detailedDescription: "<p>Working on this horror film as a Digital Compositor involved enhancing practical effects and maintaining a gritty, realistic feel.</p>",
    year: 2023,
    role: "Digital Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMjM1ZmViMmYtOGYzZC00YzhmLWE0MTMtMzNjYzcyNjEwYWRkXkEyXkFqcGc@.jpg",
      alt: "Evil Dead Rise Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt13345606/",
    featured: true,
    order: 2,
    tags: ["Horror", "Supernatural", "VFX"]
  },
  {
    title: "Me Time",
    slug: "me-time",
    description: "A comedy about a stay-at-home dad who finds himself with some 'me time' for the first time in years.",
    detailedDescription: "<p>My role as a Visual Effects Artist involved creating environment extensions and vehicle work for various action-comedy sequences.</p>",
    year: 2022,
    role: "Visual Effects Artist",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYjYzMTkyYjUtYTVmYi00Y2ZjLTg2N2ItZGFhODAzYTVmYzkzXkEyXkFqcGc@.jpg",
      alt: "Me Time Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt14309446/",
    featured: true,
    order: 3,
    tags: ["Comedy", "Action", "VFX"]
  },
  {
    title: "See",
    slug: "see",
    description: "In a future where humankind has lost the sense of sight, a set of twins is born with the ability to see.",
    year: 2022,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMDEwYTg3MWQtZTNmMi00ZjU1LTkwNWQtZDFmODQ5NjcwMDc2XkEyXkFqcGc@.jpg",
      alt: "See Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt7949218/",
    featured: true,
    order: 4,
    tags: ["Sci-Fi", "Drama", "Action"]
  },
  {
    title: "Tarrac",
    slug: "tarrac",
    description: "A woman returns to her home in the Donegal Gaeltacht to help her father after he suffers a minor heart attack.",
    year: 2022,
    role: "Digital Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BZGMxNzQ0M2YtOWM2Ni00MmMzLWI0ZGItNzI3Y2JhNDc3OTA1XkEyXkFqcGc@.jpg",
      alt: "Tarrac Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt10653008/",
    featured: false,
    order: 5,
    tags: ["Drama", "Sport"]
  },
  {
    title: "Hearts of Stone",
    slug: "hearts-of-stone",
    description: "A short film project showcasing advanced visual storytelling.",
    year: 2024,
    role: "Digital Compositor",
    category: "Short Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMmJkMmNlZWUtNmY2Yi00NjgyLTgzNjctYzg4ODlhNDI5Y2NlXkEyXkFqcGc@.jpg",
      alt: "Hearts of Stone Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt7653034/",
    featured: false,
    order: 6,
    tags: ["VFX", "Short"]
  },
  {
    title: "Latin Blood",
    slug: "latin-blood",
    description: "The Ballad of Ney Matogrosso - A biographical look at the legendary Brazilian performer.",
    year: 2025,
    role: "Digital Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYmU0NDY3ODctNjhmMS00Y2YxLTljZTAtN2E5NzA4NTExODU2XkEyXkFqcGc@.jpg",
      alt: "Latin Blood Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt35301431/",
    featured: true,
    order: 7,
    tags: ["Biography", "Music", "Drama"]
  },
  {
    title: "Good Omens",
    slug: "good-omens",
    description: "A fastidious angel and a loose-living demon team up to prevent the coming of the Antichrist.",
    year: 2023,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BZDRmNGY5MTUtNDQxMC00MjMyLWIzODQtNzU2ZTdhMjJhOTA5XkEyXkFqcGc@.jpg",
      alt: "Good Omens Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt1869454/",
    featured: true,
    order: 8,
    tags: ["Comedy", "Fantasy", "Drama"]
  },
  {
    title: "Carnival Row",
    slug: "carnival-row",
    description: "A human detective and a fairy rekindle a dangerous affair in a Victorian fantasy world.",
    year: 2023,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BNzgzYmQ0OTYtMjMwMS00ZGI2LWE5MjMtMWViZjkwMGY4NGZmXkEyXkFqcGc@.jpg",
      alt: "Carnival Row Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt0489974/",
    featured: false,
    order: 9,
    tags: ["Fantasy", "Crime", "Drama"]
  },
  {
    title: "Bad Sisters",
    slug: "bad-sisters",
    description: "The Garvey sisters are bound together by the premature death of their parents and a promise to always protect one another.",
    year: 2022,
    role: "Visual Effects Artist",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYzg0ZWQzNTUtYTE0Yy00OGMyLWFkZjEtOTU5YjA2ZDdmZDEwXkEyXkFqcGc@.jpg",
      alt: "Bad Sisters Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt15469618/",
    featured: false,
    order: 10,
    tags: ["Comedy", "Drama", "Thriller"]
  },
  {
    title: "World on Fire",
    slug: "world-on-fire",
    description: "A multi-perspective look at the events of World War II from regular people living through it.",
    year: 2023,
    role: "Visual Effects Artist",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYWUxNmRiYmUtMTMyMy00MWJhLWI5MTYtYjA3MWQ5MGMwMWJjXkEyXkFqcGc@.jpg",
      alt: "World on Fire Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt8001092/",
    featured: false,
    order: 11,
    tags: ["History", "Drama", "War"]
  },
  {
    title: "Meu Nome é Gal",
    slug: "meu-nome-e-gal",
    description: "Follows the life and career of Gal Costa, one of the greatest singers in Brazilian history.",
    year: 2023,
    role: "Digital Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BNGE0OGRjZGYtNzFiOS00MGQyLThmMjctN2E3ZDRhMjhkMzUyXkEyXkFqcGc@.jpg",
      alt: "Meu Nome é Gal Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt18244348/",
    featured: false,
    order: 12,
    tags: ["Biography", "Drama", "Music"]
  },
  {
    title: "Sunlight",
    slug: "sunlight",
    description: "A heartwarming story set in a visually stunning environment.",
    year: 2023,
    role: "Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYTMxY2QxOWUtM2U2Ni00M2M4LTg1NjMtOTQxYTFmZDkxZTNlXkEyXkFqcGc@.jpg",
      alt: "Sunlight Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt15204578/",
    featured: false,
    order: 13,
    tags: ["Drama", "VFX"]
  },
  {
    title: "A Praia do Fim do Mundo",
    slug: "a-praia-do-fim-do-mundo",
    description: "A visual exploration of the edges of the world.",
    year: 2021,
    role: "Digital Artist",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMWNiZjcwNmMtYzA4NC00NzY4LWIxYTMtMDUzYjA2ZWYzZjFlXkEyXkFqcGc@.jpg",
      alt: "A Praia do Fim do Mundo Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt15554804/",
    featured: false,
    order: 14,
    tags: ["Drama", "Art"]
  },
  {
    title: "Iron Island",
    slug: "iron-island",
    description: "Life on an oil platform where duty and personal conflict collide.",
    year: 2018,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMTQxOTNmZTYtMWIzNi00ODg5LWJjY2MtMmY4ZDA1Mjg5ZmNiXkEyXkFqcGc@.jpg",
      alt: "Iron Island Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt8949480/",
    featured: false,
    order: 15,
    tags: ["Drama", "Action"]
  },
  {
    title: "The Father's Shadow",
    slug: "the-fathers-shadow",
    description: "A young girl struggles with grief and the supernatural in an urban setting.",
    year: 2018,
    role: "Digital Compositor",
    category: "Feature Film",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BODM3ZTg5MzQtMzVkMS00OGFlLTgzZTAtMTBmOTBlOGQyMjg3XkEyXkFqcGc@.jpg",
      alt: "The Father's Shadow Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt6388464/",
    featured: false,
    order: 16,
    tags: ["Horror", "Drama"]
  },
  {
    title: "El Hipnotizador",
    slug: "el-hipnotizador",
    description: "The story of Arenas, a hypnotist who can put people into a trance to reveal their deepest secrets.",
    year: 2017,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BMzg2NTg3OTAxMV5BMl5BanBnXkFtZTgwNjc4MjM5NzE@.jpg",
      alt: "El Hipnotizador Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt4905820/",
    featured: false,
    order: 17,
    tags: ["Fantasy", "Mystery"]
  },
  {
    title: "Edifício Paraíso",
    slug: "edificio-paraiso",
    description: "A look into the interconnected lives of residents in a residential building.",
    year: 2017,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYzUyMDg2MTEtNjY3ZS00YmFkLTg1NGItZDI3OTQ4NGQ3ZTgxXkEyXkFqcGc@.jpg",
      alt: "Edifício Paraíso Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt7049218/",
    featured: false,
    order: 18,
    tags: ["Comedy", "Drama"]
  },
  {
    title: "Find Me in Paris",
    slug: "find-me-in-paris",
    description: "A young ballet dancer from 1905 is transported to modern-day Paris.",
    year: 2019,
    role: "Digital Compositor",
    category: "TV Series",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BZjQxNDIxMjUtOGJmYi00NjIwLTk2NjgtMzFmMzgxNmY5MGVkXkEyXkFqcGc@.jpg",
      alt: "Find Me in Paris Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt7150060/",
    featured: false,
    order: 19,
    tags: ["Family", "Fantasy", "Music"]
  },
  {
    title: "The Minds of 99",
    slug: "the-minds-of-99",
    description: "A concert film capturing the energy of the Danish band The Minds of 99.",
    year: 2025,
    role: "Compositor",
    category: "Documentary",
    image: {
      url: "https://m.media-amazon.com/images/M/MV5BYWY2NTQ2YWEtNjNhZS00NGY3LWFmOWUtYjkwMmE4MTJkNzQ0XkEyXkFqcGc@.jpg",
      alt: "The Minds of 99 Poster"
    },
    imdbUrl: "https://www.imdb.com/title/tt34857055/",
    featured: false,
    order: 20,
    tags: ["Music", "Documentary"]
  }
];

const projects = [
  {
    title: "The Woman King",
    slug: "the-woman-king-vfx",
    role: "Visual Effects Artist",
    year: "2022",
    category: "Feature Film",
    description: "Contributing to the epic battle sequences and environment extensions for this powerful historical drama.",
    thumbnail: {
      url: "https://m.media-amazon.com/images/M/MV5BNzM4ODY0NzctZDIyNC00MzE4LWI3NDYtYjIyYTUyZWFmYzJkXkEyXkFqcGc@.jpg",
      alt: "The Woman King VFX Work"
    },
    featured: true,
    status: "active",
    order: 1
  },
  {
    title: "Evil Dead Rise",
    slug: "evil-dead-rise-vfx",
    role: "Digital Compositor",
    year: "2023",
    category: "Feature Film",
    description: "Creating chilling visual effects and seamless compositing for the latest entry in the iconic horror franchise.",
    thumbnail: {
      url: "https://m.media-amazon.com/images/M/MV5BMjM1ZmViMmYtOGYzZC00YzhmLWE0MTMtMzNjYzcyNjEwYWRkXkEyXkFqcGc@.jpg",
      alt: "Evil Dead Rise VFX Work"
    },
    featured: true,
    status: "active",
    order: 2
  },
  {
    title: "Good Omens",
    slug: "good-omens-vfx",
    role: "Digital Compositor",
    year: "2023",
    category: "TV Series",
    description: "Crafting magical and celestial visual effects for the highly acclaimed fantasy series.",
    thumbnail: {
      url: "https://m.media-amazon.com/images/M/MV5BZDRmNGY5MTUtNDQxMC00MjMyLWIzODQtNzU2ZTdhMjJhOTA5XkEyXkFqcGc@.jpg",
      alt: "Good Omens VFX Work"
    },
    featured: true,
    status: "active",
    order: 3
  }
];

const populateContent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);
    console.log('\n📝 Populating content...\n');

    // Clear existing content
    console.log('🗑️  Clearing existing blog posts...');
    await BlogPost.deleteMany({});
    console.log('🗑️  Clearing existing films...');
    await Film.deleteMany({});
    console.log('🗑️  Clearing existing projects...');
    await Project.deleteMany({});

    // Insert blog posts
    console.log('\n📰 Creating blog posts...');
    for (const post of blogPosts) {
      const created = await BlogPost.create(post);
      console.log(`  ✅ Created: "${created.title}"`);
    }

    // Insert films
    console.log('\n🎬 Creating films...');
    for (const film of films) {
      const created = await Film.create(film);
      console.log(`  ✅ Created: "${created.title}" (${created.year})`);
    }

    // Insert projects
    console.log('\n🏗️  Creating projects...');
    for (const project of projects) {
      const created = await Project.create(project);
      console.log(`  ✅ Created: "${created.title}"`);
    }

    console.log('\n✨ Content population complete!');
    console.log('\n📊 Summary:');
    console.log(`  📰 Blog Posts: ${blogPosts.length}`);
    console.log(`  🎬 Films: ${films.length}`);
    console.log(`  🏗️  Projects: ${projects.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

populateContent();
