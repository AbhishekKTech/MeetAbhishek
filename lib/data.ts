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
    "url": "https://github.com/abhishekbuilds",
    icon: Github
  },
  {
    "platform": "linkedin",
    "url": "https://linkedin.com/in/abhishekbuilds",
    icon: Linkedin
  },
  {
    "platform": "twitter",
    "url": "https://twitter.com/AbhiTweetsEtc",
    icon: Twitter
  },
  {
    "platform": "email",
    "url": "mailto:iabhishekapp@gmail.com",
    icon: Mail
  }
]

export const personalInfo = {
  "name": "Abhishek Singh",
  "title": "Software Engineer",
  "email": "your.email@example.com",
  "location": "Los Angeles, CA",
  "bio": "A curious mind navigating the world with 4 years of software engineering experience, turning challenges into opportunities. Currently pursuing my Master’s in Computer Science at CSU Fullerton. When I’m not behind the keyboard, you’ll find me exploring new places, capturing nature’s beauty, or binging on travel vlogs. I’m looking for my next challenge and a chance to leave a positive mark.",
  "resumeUrl": "https://www.dropbox.com/scl/fi/960w9k85626j57x55myb3/Abhishek-Singh-SoftwareEngineer.pdf?rlkey=htbuuxnfw5fd4lg2h34t1gaev&st=ledi8206&dl=1",
  "imageUrl": "https://www.dropbox.com/scl/fi/les7f5rrxipcl8w81rv71/portfolio_about_me.jpeg?rlkey=73ppvkyf72rs28xd991z8e595&e=1&st=ktaqkjug&dl=1",
  "logoFormat": "initials",
  "openToWork": true,
  "web3formsKey": ""
}

export const projects = [
  {
    "title": "Suzess",
    "description": "Something cool is going to be updated here. For now, you can subscribe to the updates on the website; no need to sign an NDA.",
    "tags": [
      "Java",
      "SpringBoot",
      "SpringSecurity",
      "React",
      "AWS",
      "Python"
    ],
    "links": [
      {
        "name": "Website",
        "url": "https://suzess.app/",
        icon: Globe
      }
    ],
    "inDevelopment": true
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
        "url": "https://github.com/abhishekbuilds/StreamAnalytics",
        icon: Github
      }
    ]
  },
  {
    "title": "Linkedin Email Extractor",
    "description": "LinkedIn Email Extractor (LEE) is a Python script that uses Google’s Custom Search Engine API to find LinkedIn profiles and automatically extract email addresses from profile descriptions. Open-sourced under the MIT license, LEE has earned 60 GitHub stars and 47 forks to date.",
    "tags": [
      "Node.js",
      "PostgreSQL",
      "Redis",
      "Docker"
    ],
    "links": [
      {
        "name": "Github",
        "url": "https://github.com/abhishekbuilds/linkedin-email-extractor",
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
        "name": "Python",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
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
        "name": "YAML",
        "icon": "https://www.dropbox.com/scl/fi/ctq2qh182xtgniyetm9l2/YAML.png?rlkey=y5ur6yh8vechovjj82f6hx3iv&st=w29msxuq&dl=1"
      },
      {
        "name": "Bash",
        "icon": "https://www.dropbox.com/scl/fi/n2e3wa7ydvxdffm9v8qmx/Bash.png?rlkey=bthqmpf8q7mv9d5jj2jexg0z8&st=fp8a5oho&dl=1"
      }
    ]
  },
  {
    "category": "Databases & Messaging",
    "items": [
      {
        "name": "PostgreSQL",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
      },
      {
        "name": "MongoDB",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
      },
      {
        "name": "Redis",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
      },
      {
        "name": "Apache Kafka",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg"
      },
      {
        "name": "MongoDB",
        "icon": "https://cdn.simpleicons.org/mongodb/47A248"
      }
    ]
  },
  {
    "category": "Infrastructure & Tools",
    "items": [
      {
        "name": "Docker",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
      },
      {
        "name": "Git",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"
      },
      {
        "name": "Jenkins",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg"
      },
      {
        "name": "TeamCity",
        "icon": "https://www.dropbox.com/scl/fi/qwg9j7blhqm0oepu9uiqp/TeamCity_Icon.png?rlkey=oudtbpvz5rd5pyxmrqnkpzzlo&st=ynbn0t2o&dl=1"
      },
      {
        "name": "Jira",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg"
      },
      {
        "name": "Maven",
        "icon": "https://www.dropbox.com/scl/fi/mmnfqbf78689vs73lbm5l/maven.144x256.png?rlkey=xi3b8ptlq37lsh8q8e105ugfu&st=x6fn2rs7&dl=1"
      },
      {
        "name": "Azure",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg"
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
        "name": "Spring",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg"
      },
      {
        "name": "JUnit",
        "icon": "https://www.dropbox.com/scl/fi/vcbtk0voy15t60y80swzy/JUnit.png?rlkey=3vckv6b1hhahkhh8z4lma0h1r&st=v2u7nbv8&dl=1"
      },
      {
        "name": "Spark",
        "icon": "https://www.dropbox.com/scl/fi/a1ep3f8txrrrz7gqgwe7t/Apache-Spark.png?rlkey=s33gensoe4ree27k2f1excii2&st=xfk93prs&dl=1"
      },
      {
        "name": "Hadoop",
        "icon": "https://www.dropbox.com/scl/fi/4hqav2uhmb9ufykx5tn15/Apache-Hadoop.png?rlkey=vh9hpoldt6qgkmxtizf9oloyj&st=hpu11ty7&dl=1"
      },
      {
        "name": "Selenium",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/selenium/selenium-original.svg"
      },
      {
        "name": "Appium",
        "icon": "https://cdn.simpleicons.org/appium/4285F4"
      },
      {
        "name": "Karate",
        "icon": "https://www.dropbox.com/scl/fi/xdvbkkt913npr6ftu048n/Karate-Labs.png?rlkey=qt8xvglsxwaiulvui7yjp3nyx&st=ytmk6p0x&dl=1"
      },
      {
        "name": "Cucumber",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cucumber/cucumber-plain.svg"
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
        "name": "Nextjs",
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg"
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
    "title": "Information Technology Analyst",
    "company": "NTT Data",
    "location": "Bengaluru, India",
    "startYear": "2019",
    "endYear": "2022",
    "isOngoing": false,
    "description": [
      "Enhanced error handling across multiple legacy microservices by applying standard HTTP status codes and streamlining the troubleshooting process.",
      "Developed reusable UI components and implemented client-side validation in React to strengthen form submission reliability.",
      "Delivered robust solutions with high unit test coverage and improved maintainability through reusable modules."
    ]
  },
  {
    "title": "Software Developer Intern",
    "company": "Delvetech Software",
    "location": "New Delhi, Delhi",
    "startYear": "2018",
    "endYear": "2018",
    "isOngoing": false,
    "description": [
      "Analyzed and addressed 20+ defects in a Python enterprise project, improving project stability",
      "Created and updated over 10 technical documents, reducing onboarding time for new team members"
    ]
  },
  {
    "title": "Software Engineer II",
    "company": "Jio Platforms Limited",
    "location": "Bengaluru, India",
    "startYear": "2022",
    "endYear": "2023",
    "isOngoing": false,
    "description": [
      "Built scalable RESTful APIs using Java, Spring Boot, and Hexagonal Architecture, handling 50k+ daily requests for a super app.",
      "Improved code quality (750K LOCs) by 25% and cut post-release defects by 15% through SonarQube-based continuous analysis."
    ]
  }
]

export const education = [
  {
    "degree": "Master of Science in Computer Science",
    "institution": "California State University",
    "location": "Fullerton, CA",
    "startYear": "2023",
    "endYear": "",
    "isOngoing": true,
    "description": "Specialized in distributed systems and database management. Research focus on scalable architecture patterns."
  },
  {
    "degree": "Bachelor of Technology in Computer Science",
    "institution": "Dr. APJ Abdul Kalam Technical University",
    "location": "Lucknow, India",
    "startYear": "2015",
    "endYear": "2019",
    "isOngoing": false,
    "description": "Core curriculum in algorithms, data structures, and systems programming."
  }
]

export const certifications = [
  {
    "title": "Oracle Certified Associate, Java SE 8 Programmer",
    "issuer": "Oracle",
    "issueDate": "2019",
    "expiryDate": "",
    "credentialId": "OC1886086",
    "badgeUrl": "https://www.dropbox.com/scl/fi/0iymz04kccszkerghcbv3/OCAJSE8.jpg?rlkey=5ikcq7wj3lbbdkr7lc6k8p0w1&st=sb62hllf&dl=1",
    "credentialUrl": "https://www.dropbox.com/scl/fi/zy2sectohdaer87f2jkpt/OCAJSE8-certificate.pdf?rlkey=5mlkx323s4fceind7pi3ezm6r&st=cnfmu0nw&dl=1",
    "description": "Scored 90% on the Oracle Java certification exam, demonstrating my proficiency in encapsulation, conditional logic, multi-dimensional arrays, and operator precedence."
  }
]