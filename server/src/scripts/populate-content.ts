import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from '../models/BlogPost';
import Film from '../models/Film';

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
    detailedDescription: `<p>The Woman King is a 2022 American historical epic film directed by Gina Prince-Bythewood. The film stars Viola Davis as a general who trains the next generation of warriors to fight their enemies.</p>

<p>As a VFX artist on this project, I contributed to creating the epic battle sequences and environment extensions that helped bring this powerful story to life. The scale of the battles required extensive digital enhancements while maintaining the practical, grounded feel the director wanted.</p>

<p>This was one of the most rewarding projects I've worked on, combining historical accuracy with cinematic spectacle.</p>`,
    year: 2022,
    role: "Visual Effects Artist",
    category: "Feature Film",
    image: {
      url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=675&fit=crop",
      alt: "Historical epic battle scene"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=450&fit=crop",
        caption: "Epic battle sequences"
      }
    ],
    imdbUrl: "https://www.imdb.com/title/tt8093700/",
    featured: true,
    order: 1,
    tags: ["Historical", "Action", "Drama", "VFX"]
  },
  {
    title: "Evil Dead Rise",
    slug: "evil-dead-rise",
    description: "A twisted tale of two estranged sisters whose reunion is cut short by the rise of flesh-possessing demons.",
    detailedDescription: `<p>Evil Dead Rise (2023) is a supernatural horror film written and directed by Lee Cronin. The film takes the franchise to a new urban setting while maintaining the franchise's signature visceral horror.</p>

<p>Working on this horror film presented unique challenges. The VFX work needed to enhance the practical effects and makeup while maintaining the gritty, realistic feel that makes the franchise so effective.</p>

<p>From blood simulations to environmental destruction, every effect needed to serve the story and maximize the scares.</p>`,
    year: 2023,
    role: "Visual Effects Artist",
    category: "Feature Film",
    image: {
      url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=1200&h=675&fit=crop",
      alt: "Dark horror atmosphere"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&h=450&fit=crop",
        caption: "Horror VFX work"
      }
    ],
    imdbUrl: "https://www.imdb.com/title/tt13345606/",
    featured: true,
    order: 2,
    tags: ["Horror", "Supernatural", "VFX", "Blood & Gore"]
  },
  {
    title: "Me Time",
    slug: "me-time",
    description: "A comedy about a stay-at-home dad who finds himself with some 'me time' for the first time in years while his family is away.",
    detailedDescription: `<p>Me Time (2022) is a buddy comedy starring Kevin Hart and Mark Wahlberg. The film follows a stay-at-home dad's wild weekend adventure.</p>

<p>While primarily a comedy, the film featured several action sequences and set pieces that required VFX work. My role involved creating environment extensions, vehicle work, and enhancing practical stunts.</p>

<p>Comedy films can be just as demanding as action blockbusters when it comes to VFX - everything needs to look believable while supporting the comedic timing.</p>`,
    year: 2022,
    role: "Visual Effects Artist",
    category: "Feature Film",
    image: {
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=675&fit=crop",
      alt: "Comedy film production"
    },
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=450&fit=crop",
        caption: "Comedy VFX work"
      }
    ],
    imdbUrl: "https://www.imdb.com/title/tt14444726/",
    featured: true,
    order: 3,
    tags: ["Comedy", "Action Comedy", "VFX"]
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

    console.log('\n✨ Content population complete!');
    console.log(`\n📊 Summary:`);
    console.log(`  📰 Blog Posts: ${blogPosts.length}`);
    console.log(`  🎬 Films: ${films.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

populateContent();
