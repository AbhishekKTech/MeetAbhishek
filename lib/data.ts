import { Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react'

export const navigationLinks = [
  {
    "name": "Home",
    "href": "#home"
  },
  {
    "name": "About",
    "href": "#about"
  },
  {
    "name": "Projects",
    "href": "#projects"
  },
  {
    "name": "Skills",
    "href": "#skills"
  },
  {
    "name": "Experience",
    "href": "#experience"
  },
  {
    "name": "Education",
    "href": "#education"
  },
  {
    "name": "Certifications",
    "href": "#certifications"
  },
  {
    "name": "Contact",
    "href": "#contact"
  }
]

export const socialLinks = [
  {
    "platform": "github",
    "url": "https://github.com/abhishekktech",
    icon: Github
  },
  {
    "platform": "linkedin",
    "url": "https://linkedin.com/in/abhishekktech",
    icon: Linkedin
  },
  {
    "platform": "email",
    "url": "mailto:sharma.abhieee@gmail.com",
    icon: Mail
  },
  {
    "platform": "custom",
    "url": "https://leetcode.com/u/abhieee-dev/",
    "icon": "Globe"
  }
]

export const personalInfo = {
  "name": "Abhishek Sharma",
  "title": "Backend Developer | Java, Spring Boot & RESTful APIs",
  "email": "sharma.abhieee@gmail.com",
  "location": "Noida, IN",
  "bio": "I am a curious and responsible individual who strives for excellence in every aspect. capable of adapting to any work environment. Currently pursuing an MCA from JSSATE Noida, I am dedicated to upskilling and refining my personality to meet top-tier industry standards. When not behind the keyboard, you will find me exploring new ideas and focusing on self-growth.",
  "resumeUrl": "https://www.dropbox.com/scl/fi/wbb31yu5mqer23ph7t5xd/Abhishek-Resume-Java1.pdf?rlkey=avoihrb8j7522p75gdvsp8gyg&st=wvmj6g78&raw=1",
  "imageUrl": "https://www.dropbox.com/scl/fi/7g14r811ugid2rl0r3hip/photo.webp?rlkey=taioufzyzd60eekx5igf24nju&raw=1",
  "logoFormat": "initials",
  "openToWork": true,
  "web3formsKey": ""
}

export const projects = [
  {
    "title": "The Invisible Boy Who Refused to Stay Average",
    "description": "Wrote and structured a complete eBook\nPublished on Amazon Kindle (KDP)\nFocused on real-life student problems like procrastination, self-doubt, and discipline",
    "tags": [
      "Writing",
      "Self Growth",
      "KDP"
    ],
    "links": [
      {
        "name": "View Book",
        "url": "https://www.amazon.in/dp/B0GTPJVXW2?ref=cm_sw_r_ffobk_cso_wa_mwn_dp_GV8BF993VSS468Q9HG5F&ref_=cm_sw_r_ffobk_cso_wa_mwn_dp_GV8BF993VSS468Q9HG5F&social_share=cm_sw_r_ffobk_cso_wa_mwn_dp_GV8BF993VSS468Q9HG5F&bestFormat=true",
        icon: Globe
      }
    ],
    "inDevelopment": true
  },
  {
    "title": "High-Concurrency E-Commerce Checkout Engine",
    "description": "• Architected a scalable RESTful API backend for an e-commerce checkout system capable of processing concurrent\ntransaction requests efficiently.\n• Implemented strict transaction management and pessimistic locking mechanisms at the database level to resolve race\nconditions and completely prevent inventory overselling during high-traffic scenarios.",
    "tags": [
      "Java",
      "Spring Boot",
      "MySQL",
      "Postman"
    ],
    "links": [
      {
        "name": "Github Repo",
        "url": "https://github.com/AbhishekKTech/ecommerce-engine",
        icon: Github
      }
    ],
    "inDevelopment": false
  },
  {
    "title": "Enterprise IT Ticketing & Resolution System",
    "description": "• Developed a B2B role-based backend engine to automate customer support workflows, automatically mapping incoming\nclient queries to specific priority queues.\n• Integrated JWT (JSON Web Tokens) for secure authentication and designed robust relational database schemas to\nefficiently track the ticket lifecycle, status, and resolution metrics.",
    "tags": [
      "Java",
      "Spring Boot",
      "Hibernate",
      "JWT Security"
    ],
    "links": [
      {
        "name": "Github Repo",
        "url": "https://github.com/AbhishekKTech/ecommerce-engine",
        icon: Github
      }
    ],
    "inDevelopment": false
  },

{
    "title": "CyberZet Digital Solutions",
    "description": "A digital solutions Site to meet your business goals. Providing services in website development, digital marketing, graphic design, and online courses to boost your digital presence.",
    "tags": [
      "React",
      "JavaScript"
    ],
    "links": [
      {
        "name": "CyberZet.in",
        "url": "https://thecyberzet.in/",
        icon: Globe
      }
    ],
    "inDevelopment": false
  }
]

export const skills = [
  {
    "category": "Languages",
    "items": [
      {
        "name": "Java",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg"
      },
      {
        "name": "Javascript",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
      },
      {
        "name": "HTML",
        "icon": "https://www.dropbox.com/scl/fi/qlk211pn5ueb17gw36mui/HTML5.png?rlkey=t0mryjr28915h5bk495xfekni&st=4nhfo0qk&dl=1"
      },
      {
        "name": "CSS",
        "icon": "https://www.dropbox.com/scl/fi/jqdx5b3pginw8gumalhwf/CSS3.png?rlkey=ts5q8m2h9n7rcs8pa0545mzxw&st=jeq4tm7s&dl=1"
      },
      {
        "name": "C++",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg"
      },
      {
        "name": "Kotlin",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg"
      }
    ]
  },
  {
    "category": "Databases & Messaging",
    "items": [
      {
        "name": "Mysql",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"
      }
    ]
  },
  {
    "category": "Infrastructure & Tools",
    "items": [
      {
        "name": "Git",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
      },
      {
        "name": "Postman",
        "icon": "https://mailosaur.com/images/frameworks/postman.png"
      }
    ]
  },
  {
    "category": "Frameworks",
    "items": [
      {
        "name": "Bootstrap",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
      },
      {
        "name": "Spring",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
      }
    ]
  },
  {
    "category": "Libraries",
    "items": [
      {
        "name": "React",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
      },
      {
        "name": "Express",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg"
      }
    ]
  }
]

export const experience = [
  {
    "title": "Website Developer Intern",
    "company": "Live Tech Service",
    "location": "Greater Noida, India",
    "startYear": "2023",
    "endYear": "2024",
    "isOngoing": false,
    "description": [
      "Built responsive WordPress & Shopify websites and handled ongoing maintenance for continuous availability.",
      "Executed hands-on SEO strategies to boost website visibility and drive key organizational growth."
    ]
  }
]

export const education = [
  {
    "degree": "Master of Computer Applications",
    "institution": "JSS Academy of Technical Education",
    "location": "Noida, IN",
    "startYear": "2025",
    "endYear": "",
    "isOngoing": true,
    "description": ""
  },
  {
    "degree": "Bachelor of Computer Applications",
    "institution": "Chaudhary Charan Singh University",
    "location": "Meerut, India",
    "startYear": "2021",
    "endYear": "2024",
    "isOngoing": false,
    "description": ""
  },
  {
    "degree": "Intermediate",
    "institution": "B.S. Inter College",
    "location": "Noida, India",
    "startYear": "2019",
    "endYear": "2021",
    "isOngoing": false,
    "description": ""
  }
]

export const certifications = [
  {
    "title": "Object Oriented Programming in Java",
    "issuer": "University of California San Diego, Coursera",
    "issueDate": "2023",
    "expiryDate": "",
    "credentialId": "TLFPJDSSAZTY",
    "badgeUrl": "https://upload.wikimedia.org/wikipedia/commons/5/5f/Coursera_logo_%282020%29.svg",
    "credentialUrl": "https://www.coursera.org/account/accomplishments/verify/TLFPJDSSAZTY",
    "description": "Learned about Software Documentation\nSoftware Documentation User Interface (UI)\nUser Interface (UI)\nCategory: Java Programming\nJava Programming\nCategory: Programming Principles\nProgramming Principles\nCategory: Java\nJava\nCategory: Software Engineering\nSoftware Engineering\nCategory: Geospatial Mapping\nGeospatial Mapping\nCategory: Algorithms\nAlgorithms\nCategory: Computer Programming\nComputer Programming\nCategory: Object Oriented Design\nObject Oriented Design\nCategory: Interactiv"
  },
  {
    "title": "Postman API Fundamentals Student Expert",
    "issuer": "Postman",
    "issueDate": "2023",
    "expiryDate": "",
    "credentialId": "64b7fa12b702cd40033fc94b",
    "credentialUrl": "https://badges.parchment.com/public/assertions/XiAeeeOLToS7Z8PM3lYXLg?identity__email=abhishek859573@gmail.com",
    "description": "A hand’s on certification that teaches Me:\n\nWhat APIs are and their importance in modern software development\nHow to use Postman to work with APIs\nMaking GET, POST, PATCH, and DELETE requests\nQuery parameters, bodies, headers, response codes\nBasic scripting\nAPI Key Authorization\nHow to use APIs in your applications",
    "badgeUrl": "https://api.badgr.io/public/assertions/XiAeeeOLToS7Z8PM3lYXLg/image"
  }
]
