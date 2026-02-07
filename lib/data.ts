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
    icon: Globe
  }
]

export const personalInfo = {
  "name": "Abhishek Sharma",
  "title": "Software Developer - Student at JSSATE Noida (MCA)",
  "email": "sharma.abhieee@gmail.com",
  "location": "Noida, IN",
  "bio": "I am a curious and responsible individual who strives for excellence in every aspect. capable of adapting to any work environment. Currently pursuing an MCA from JSSATE Noida, I am dedicated to upskilling and refining my personality to meet top-tier industry standards. When not behind the keyboard, you will find me exploring new ideas and focusing on self-growth.",
  "resumeUrl": "https://www.dropbox.com/scl/fi/hyku9uyitae78i62ln7ek/Abhishek-Resume-v1-2.pdf?rlkey=9ymq1hnffindqcz7vi0irr5ho&st=h9tpcwbd&raw=1",
  "imageUrl": "https://firebasestorage.googleapis.com/v0/b/dropbox-clone-7b8ff.appspot.com/o/users%2Fuser_39Hf0HYSX3M659UUWL4vID7Yvcx%2Ffiles%2FtQfui5QG3iqCGrThI6Yh?alt=media&token=d51ee2c6-50a3-468f-8bd0-23821c05f620",
  "logoFormat": "initials",
  "openToWork": true,
  "web3formsKey": "39884755-98b3-489e-bf45-2ab966095503"
}

export const projects = [
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
  },
  {
    "title": "Realtime Stock Market Analytics",
    "description": "Built a real-time stock market analytics platform using Python, Flask, Kafka, and Spark, reducing data delays from 8s to 3s and boosting throughput by 60%. Leveraged Chart.js for interactive visualizations, enabling users to track live market trends with engaging, low-latency dashboards",
    "tags": [
      "Kafka",
      "Apache Spark",
      "Python",
      "Chart.js"
    ],
    "links": [
      {
        "name": "Github",
        "url": "https://github.com/abhishekktech",
        icon: Github
      }
    ]
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
      }
    ]
  },
  {
    "category": "Databases & Messaging",
    "items": [
      {
        "name": "MongoDB",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
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
        "name": "AWS",
        "icon": "https://www.dropbox.com/scl/fi/5q3sbh6jkpbg76rpye80q/aws-icon.png?rlkey=ldi13y3rmrjlb1c1i9vtvfire&st=lpelux0v&dl=1"
      }
    ]
  },
  {
    "category": "Frameworks",
    "items": [
      {
        "name": "Bootstrap",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"
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
    "title": "Oracle Certified Associate, Java SE 8 Programmer",
    "issuer": "Oracle",
    "issueDate": "2023",
    "expiryDate": "",
    "credentialId": "OC1886086",
    "badgeUrl": "https://images.credly.com/size/340x340/images/a9848abf-f8bd-474d-a9b4-6086da11a916/Oracle_Associates_Badge__1_.png",
    "credentialUrl": "https://www.dropbox.com/scl/fi/hw211zx5hm9cvvtpyaz27/OCAJSE8-certificate.pdf?rlkey=jnvvwtwf5534v3n5fv4h04eui&st=kzamvl8n&raw=1",
    "description": "Scored 90% on the Oracle Java certification exam, demonstrating my proficiency in encapsulation, conditional logic, multi-dimensional arrays, and operator precedence."
  }
]
