import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';
import Film from '../models/Film';
import Project from '../models/Project';

dotenv.config();

const blogPosts = [
  {
    title: "The Future of AI in Visual Effects: A Game Changer",
    slug: "future-of-ai-in-visual-effects",
    excerpt: "Exploring how artificial intelligence is revolutionizing the VFX industry and opening new creative possibilities for filmmakers.",
    content: `<h2>Introduction</h2>
<p>The visual effects industry is experiencing a paradigm shift with the integration of artificial intelligence. As someone who has worked on major productions, I've witnessed firsthand how AI is transforming our workflow and creative capabilities.</p>

<h2>AI-Powered Tools</h2>
<p>Modern VFX artists now have access to powerful AI tools that can:</p>
<ul>
<li>Automate rotoscoping and masking processes</li>
<li>Generate realistic environments and textures</li>
<li>Enhance motion capture cleanup</li>
<li>Predict and simulate complex physics</li>
</ul>

<h2>Real-World Applications</h2>
<p>In my work on productions like The Woman King and Evil Dead Rise, we've started integrating AI tools to speed up our pipeline. What used to take days can now be accomplished in hours, allowing us to focus more on creative decisions rather than technical tedium.</p>

<h2>The Human Touch</h2>
<p>Despite all these advances, the artist's creative vision remains irreplaceable. AI is a tool, not a replacement. It amplifies our capabilities and allows us to push boundaries we never thought possible.</p>

<h2>Looking Forward</h2>
<p>The future is bright for VFX artists willing to embrace these new technologies. The key is learning to work alongside AI, using it to enhance rather than replace our craft.</p>`,
    category: "AI & Film",
    tags: ["AI", "VFX", "Visual Effects", "Film Production", "Technology"],
    author: {
      name: "Felipe Almeida",
      bio: "Visual Effects Artist with credits on The Woman King, Me Time, and Evil Dead Rise",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&h=600&fit=crop",
      alt: "AI and VFX concept"
    },
    status: "published",
    featured: true,
    publishedAt: new Date('2024-12-15'),
  },
  {
    title: "Behind the Scenes: Creating Epic Battle Sequences",
    slug: "creating-epic-battle-sequences",
    excerpt: "A deep dive into the VFX workflow for large-scale action scenes, from pre-visualization to final compositing.",
    content: `<h2>Pre-Visualization is Key</h2>
<p>Creating convincing battle sequences starts long before any actual filming begins. Pre-visualization allows us to plan camera angles, choreography, and effects placement.</p>

<h2>On-Set Challenges</h2>
<p>Working on set for major productions requires constant adaptation. Weather, lighting, and practical constraints mean we need to be flexible with our VFX plans.</p>

<h2>The Post-Production Pipeline</h2>
<p>Once filming wraps, the real magic happens:</p>
<ol>
<li><strong>Tracking and Matchmoving:</strong> Ensuring CG elements integrate seamlessly</li>
<li><strong>Environment Extensions:</strong> Building out the world beyond what was filmed</li>
<li><strong>Compositing:</strong> Bringing all elements together</li>
<li><strong>Color Grading:</strong> Matching the final look</li>
</ol>

<h2>Lessons Learned</h2>
<p>Every project teaches something new. The scale of battle sequences requires coordination between multiple departments and clear communication throughout the process.</p>`,
    category: "Behind the Scenes",
    tags: ["VFX", "Action Sequences", "Film Production", "Post-Production", "Compositing"],
    author: {
      name: "Felipe Almeida",
      bio: "Visual Effects Artist with credits on The Woman King, Me Time, and Evil Dead Rise",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop",
      alt: "Film production set"
    },
    status: "published",
    featured: true,
    publishedAt: new Date('2024-11-20'),
  },
  {
    title: "Horror VFX: Making the Impossible Terrifying",
    slug: "horror-vfx-making-impossible-terrifying",
    excerpt: "The unique challenges and creative opportunities of working on horror films, where VFX brings nightmares to life.",
    content: `<h2>The Art of Horror</h2>
<p>Horror films present unique challenges for VFX artists. Unlike big-budget action films, horror relies on subtlety, atmosphere, and the element of surprise.</p>

<h2>Practical vs Digital</h2>
<p>The best horror VFX often combine practical effects with digital enhancement. Real blood, makeup, and puppetry provide a foundation that digital effects can amplify.</p>

<h2>Creating Atmosphere</h2>
<p>Sometimes what you don't see is scarier than what you do. VFX can enhance shadows, add subtle movements, and create an unsettling atmosphere that keeps audiences on edge.</p>

<h2>Gore and Violence</h2>
<p>While no one likes to talk about it, realistic gore is often a requirement in horror films. Digital effects allow us to push boundaries while keeping actors safe.</p>

<h2>The Final Scare</h2>
<p>Working on horror films like Evil Dead Rise has taught me that the most effective scares come from a combination of practical filmmaking, smart VFX, and excellent timing.</p>`,
    category: "Tutorial",
    tags: ["Horror", "VFX", "Film Production", "Special Effects", "Evil Dead Rise"],
    author: {
      name: "Felipe Almeida",
      bio: "Visual Effects Artist with credits on The Woman King, Me Time, and Evil Dead Rise",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=600&fit=crop",
      alt: "Dark atmospheric scene"
    },
    status: "published",
    featured: false,
    publishedAt: new Date('2024-10-10'),
  },
  {
    title: "Breaking Into the VFX Industry: Tips and Advice",
    slug: "breaking-into-vfx-industry",
    excerpt: "Practical advice for aspiring VFX artists looking to start their career in film and television.",
    content: `<h2>Building Your Skillset</h2>
<p>The VFX industry is competitive, but with dedication and the right approach, you can break in. Start by mastering the fundamentals of your chosen software.</p>

<h2>Essential Software</h2>
<p>Familiarize yourself with industry-standard tools:</p>
<ul>
<li><strong>Nuke:</strong> For compositing</li>
<li><strong>Houdini:</strong> For effects simulation</li>
<li><strong>Maya:</strong> For 3D modeling and animation</li>
<li><strong>After Effects:</strong> For motion graphics</li>
</ul>

<h2>Building a Demo Reel</h2>
<p>Your reel is your calling card. Show only your best work, keep it under 2 minutes, and lead with your strongest piece.</p>

<h2>Networking</h2>
<p>Attend industry events, join online communities, and don't be afraid to reach out to professionals for advice. The VFX community is generally welcoming to newcomers.</p>

<h2>Starting Small</h2>
<p>Your first job might not be on a Marvel film, and that's okay. Music videos, commercials, and indie films are great places to gain experience and build your portfolio.</p>

<h2>Never Stop Learning</h2>
<p>Technology evolves rapidly in VFX. Stay current with new tools, techniques, and trends. Online courses, tutorials, and experimentation are your friends.</p>`,
    category: "Industry",
    tags: ["Career", "VFX", "Industry Tips", "Learning", "Beginner Guide"],
    author: {
      name: "Felipe Almeida",
      bio: "Visual Effects Artist with credits on The Woman King, Me Time, and Evil Dead Rise",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&h=600&fit=crop",
      alt: "VFX artist at work"
    },
    status: "published",
    featured: false,
    publishedAt: new Date('2024-09-05'),
  },
  {
    title: "The Evolution of Digital Humans in Film",
    slug: "evolution-digital-humans-film",
    excerpt: "From The Polar Express to today: how digital human technology has advanced and where it's heading next.",
    content: `<h2>A Brief History</h2>
<p>Digital humans have come a long way since the early days of CGI. What once looked uncanny now appears remarkably lifelike.</p>

<h2>The Uncanny Valley</h2>
<p>For years, digital humans fell into the "uncanny valley" - that uncomfortable space where something looks almost, but not quite, human. Modern technology is finally allowing us to cross that valley.</p>

<h2>Key Technologies</h2>
<p>Several technological advances have made realistic digital humans possible:</p>
<ul>
<li>High-resolution facial scanning</li>
<li>Machine learning for animation</li>
<li>Subsurface scattering for realistic skin</li>
<li>Advanced hair and fabric simulation</li>
</ul>

<h2>Current Applications</h2>
<p>Today, digital humans are used for de-aging actors, creating stunt doubles, and even resurrecting performers for posthumous appearances.</p>

<h2>Ethical Considerations</h2>
<p>As the technology improves, we face important questions about consent, likeness rights, and the future of performance.</p>

<h2>The Future</h2>
<p>Real-time digital humans in games and VR are already here. Soon, we may see fully digital actors starring in major productions.</p>`,
    category: "AI & Film",
    tags: ["Digital Humans", "CGI", "AI", "Film Technology", "Future"],
    author: {
      name: "Felipe Almeida",
      bio: "Visual Effects Artist with credits on The Woman King, Me Time, and Evil Dead Rise",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop"
    },
    image: {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop",
      alt: "Digital human concept"
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
