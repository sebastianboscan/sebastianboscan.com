export type EducationEntry = {
  readonly institution: string;
  readonly degree: string;
  readonly sub: string;
  readonly date: string;
  readonly skills: readonly string[];
  readonly courses?: readonly string[];
  readonly accent?: "primary" | "secondary";
};

export const educationEntries: readonly EducationEntry[] = [
  {
    institution: "University of South Carolina",
    degree: "B.S. Computer Science",
    sub: "Sophomore · Columbia, SC",
    date: "Aug 2024 - May 2028",
    accent: "primary",
    skills: [
      "Robotics",
      "Artificial Intelligence",
      "GitHub",
      "Cryptography",
      "C++",
      "Software Design Patterns",
      "Project Management",
      "Java",
    ],
    courses: [
      "Advanced Programming Techniques",
      "Algorithmic Design 2",
      "Applied Machine Learning",
      "Digital Logic Design",
      "Computer Architecture",
      "Software Engineering",
      "UNIX/Linux Fundamentals",
      "Cryptography",
    ],
  },
  {
    institution: "Lexington Technology Center",
    degree: "Completer Program - Programming & Software Development",
    sub: "Lexington, SC",
    date: "Aug 2020 - May 2023",
    accent: "secondary",
    skills: ["Robotics", "Python", "IT", "Game Development"],
    courses: [
      "Fundamentals of Computing 1",
      "IT Fundamentals",
      "Computer Programming 1",
      "Computer Programming 2",
      "Game Design",
      "AP Computer Science Principles",
    ],
  },
  {
    institution: "Lexington High School",
    degree: "High School Diploma",
    sub: "Lexington, SC",
    date: "Aug 2019 - May 2023",
    accent: "secondary",
    skills: [],
  },
] as const;
