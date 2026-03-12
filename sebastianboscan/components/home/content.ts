export type ExternalLink = {
  readonly label: string;
  readonly href: string;
};

export type AboutContent = {
  readonly paragraphs: readonly string[];
  readonly primarySkills: readonly string[];
  readonly additionalSkills: readonly string[];
};

export type ExperienceEntry = {
  readonly role: string;
  readonly company: string;
  readonly date: string;
  readonly location: string;
  readonly desc: string;
};

export type TimelineRoleEntry = {
  readonly role: string;
  readonly date: string;
  readonly desc: string;
  readonly current?: boolean;
};

export type TimelineExperience = {
  readonly title: string;
  readonly company: string;
  readonly date: string;
  readonly location: string;
  readonly roles: readonly TimelineRoleEntry[];
};

export type ProjectEntry = {
  readonly name: string;
  readonly tech: readonly string[];
  readonly link: string | null;
  readonly inProgress: boolean;
  readonly desc: string;
};

export type OrganizationEntry = {
  readonly name: string;
  readonly role: string;
  readonly desc: string;
  readonly link?: string;
  readonly statusLabel?: string;
};

export const heroLinks: readonly ExternalLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sebastianboscan/",
  },
  {
    label: "GitHub",
    href: "https://github.com/sebastianboscan",
  },
  {
    label: "Contact",
    href: "#contact",
  },
] as const;

export const aboutContent: AboutContent = {
  paragraphs: [
    "I'm a Computer Science student at the University of South Carolina with a focus on robotics, extended reality, and applied software engineering. I work at the Center for Industry Solutions (C4iS), where I bridge academic research with real-world technology challenges, including programming Boston Dynamics' Spot robot and integrating autonomous systems into university facilities operations.",
    "Outside of C4iS, I serve as a Project Manager at Kappa Theta Pi, leading technical teams that build IT and web solutions for nonprofit clients. I'm also involved in K-12 outreach, bringing emerging technologies like VR and robotics into classrooms to inspire the next generation of engineers.",
  ],
  primarySkills: [
    "Virtual Reality (VR)",
    "Robotics",
    "Artificial Intelligence (AI)",
  ],
  additionalSkills: [
    "Augmented Reality (AR)",
    "Spatial Computing",
    "Meta Horizon",
    "Unity",
    "C++",
    "Python",
    "GitHub",
    "Software Development",
    "Software Design Patterns",
    "Systems Integration",
    "Project Management",
    "Product Management",
    "Scrum",
    "Jira",
    "Machine Learning",
    "Deep Learning",
    "Retrieval-Augmented Generation (RAG)",
    "Large Language Models (LLM)",
    "Prompt Engineering",
    "Java",
    "Next.js",
    "TypeScript",
    "Linux",
    "Git",
    "Cryptography",
    "Stripe",
  ],
} as const;

export const experienceEntries: readonly ExperienceEntry[] = [
  {
    role: "Computer Science Intern - Robotics & VR",
    company: "Center for Industry Solutions (C4iS)",
    date: "July 2025 - Present",
    location: "Columbia, SC",
    desc: "Lead developer for Boston Dynamics Spot at the University of South Carolina. I build the integrations that make autonomous inspections possible, connecting Spot's SDK, a FLIR thermal camera, and ML pipelines into systems that actually work together. Partnered with IBM on real industry challenges where off-the-shelf solutions don't cut it.",
  },
  {
    role: "Undergraduate Research Assistant",
    company: "HI3 Tech Lab",
    date: "Jan 2026 - Present",
    location: "Columbia, SC",
    desc: "Programming social robots for healthcare environments and working hands-on with some of the most advanced XR headsets available. Research here sits right at the intersection of human-robot interaction and immersive tech.",
  },
] as const;

export const ktpExperience: TimelineExperience = {
  title: "Product Manager",
  company: "Kappa Theta Pi - South Carolina",
  date: "Sep 2025 - Present",
  location: "Columbia, SC",
  roles: [
    {
      role: "Product Manager",
      date: "Jan 2026 - Present",
      desc: "Leading a team of 6 software developers to build a full stack volunteer management platform for SC Economics, a nonprofit organization. The app includes database integration, an admin dashboard, and volunteer-facing features built end to end.",
      current: true,
    },
    {
      role: "Web Developer",
      date: "Sep 2025 - Feb 2026",
      desc: "Handled Stripe integration for a nonprofit donation platform, covering one-time and recurring payments. Managed 100+ test and live transactions and cleaned up session handling to reduce errors.",
      current: false,
    },
  ],
} as const;

export const projectEntries: readonly ProjectEntry[] = [
  {
    name: "SC-Economics Donation Portal",
    tech: ["Stripe", "Next.js", "TypeScript"],
    link: "https://donate.sceconomics.org",
    inProgress: false,
    desc: "Payment integration for a live nonprofit donation platform. Supports one-time and recurring Stripe flows, with a lot of work under the hood to keep the checkout experience reliable and the donation funnel clean.",
  },
  {
    name: "ARPEGGIO",
    tech: ["Hashing", "Encryption", "2FA", "SCRUM"],
    link: "https://github.com/sebastianboscan/ARPEGGIO",
    inProgress: false,
    desc: "A music app with user accounts, playlists, and social features. Built the security side of the project, including authentication, hashing, encryption, and 2FA to help keep user accounts and data protected.",
  },
  {
    name: "Robot Control Interface",
    tech: ["C++", "LVGL", "Figma"],
    link: null,
    inProgress: true,
    desc: "A tuning interface for the Gamecock Robotics team that made PID configuration actually usable. Instead of editing code every time, configs can be adjusted and saved through a UI backed by JSON storage tied to PROS and the VEX V5 Brain.",
  },
] as const;

export const organizationEntries: readonly OrganizationEntry[] = [
  {
    name: "Kappa Theta Pi",
    role: "Project Manager",
    link: "https://ktpusc.com",
    desc: "Professional technology fraternity focused on giving students real industry experience through product work, software teams, and client-facing projects. It is one of the clearest ways students at USC get to build with industry-style expectations before graduation.",
  },
  {
    name: "Gamecock Robotics",
    role: "Secretary",
    link: "https://gamecockrobotics.github.io/",
    desc: "The only competitive robotics team at the University of South Carolina. Students design, build, test, and compete with real robots, which makes it one of the most hands-on engineering communities on campus.",
  },
  {
    name: "ACM at University of South Carolina",
    role: "Member",
    link: "https://acm.cse.sc.edu/",
    desc: "Student chapter of the Association for Computing Machinery, centered on technical growth, community, and helping students stay connected to the broader computing world through events and workshops.",
  },
  {
    name: "Garnet Squadron",
    role: "Mentor",
    link: "https://www.garnetsquadron.org/",
    desc: "Mentoring a top high school FTC team through Garnet Squadron, helping support a program that has repeatedly earned 1st place at the South Carolina State Championship.",
  },
  {
    name: "South Carolina Virtual Reality (SCVR)",
    role: "Founder & President",
    statusLabel: "Coming Soon",
    desc: "Upcoming professional XR organization focused on teaching extended reality, building a strong student community around immersive tech, and competing at XR hackathons.",
  },
] as const;

export const contactLinks: readonly ExternalLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sebastianboscan/",
  },
  {
    label: "Email",
    href: "mailto:sebastian@sc.edu",
  },
] as const;
