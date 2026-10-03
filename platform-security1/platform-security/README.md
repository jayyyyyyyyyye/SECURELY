# Platform Security Tips Website

A beginner-friendly security awareness site built with plain HTML, CSS and JavaScript (no frameworks, no backend).

**Run it:** open `index.html` in a browser. Fonts load from Google Fonts when online and fall back to system fonts offline.

## Pages

| Page | File | What's on it |
| --- | --- | --- |
| Home | `index.html` | Hero, threat and tip cards, password feature, phishing practice, habit checklist, quiz preview |
| Security Basics | `pages/basics.html` | What security is, what's at stake, three goals, learning path |
| Threats | `pages/threats.html` | Phishing, social engineering, malware, viruses, ransomware, online scams (6-step format each) |
| Security Tips | `pages/tips.html` | Seven quick-tip cards |
| Password Security | `pages/passwords.html` | Strong passwords, reuse, password managers, two-factor authentication |
| Phishing | `pages/phishing.html` | Red-flag example and a 6-message practice |
| Device Security | `pages/devices.html` | Phones, computers, malware protection, updates, "Before you download" checklist, app permissions |
| Network Security | `pages/network.html` | Home Wi-Fi, public Wi-Fi checklist, network protection |
| Privacy | `pages/privacy.html` | Personal information, "Think before you share" practice, data protection |
| Resources | `pages/resources.html` | Trusted links, video slots, guides, printable checklist, "If something happens" guides |
| Quiz | `pages/quiz.html` | 10 questions, score level, topics to review |

## Structure

```text
platform-security/
├── index.html
├── pages/                 The 10 other pages
├── css/
│   ├── style.css          Design tokens, components, header/footer, all page sections
│   ├── animations.css     Page-load, floating and scroll-reveal motion
│   └── responsive.css     Tablet and mobile layouts, hamburger menu
├── js/
│   ├── main.js            Shared header/footer, mobile menu, lesson pager, scroll effects, print button
│   ├── interactions.js    Practice cards (phishing, "think before you share") + habit checklists
│   └── quiz.js            The quiz
└── images/icons/          Favicon
```

## How things work

- **One header and footer for every page.** `js/main.js` builds them from the `PAGES` list. Edit the list once and every page updates.
- **Previous / Next links** at the bottom of lesson pages follow `LEARNING_PATH` in `js/main.js`.
- **New page:** copy an existing page in `pages/`, set `<body data-page="your-key" data-root="../">` and add the page to `PAGES` in `js/main.js`.
- **Rename the site:** change `SITE_NAME` at the top of `js/main.js`, and the `<title>` in each page.
- **Colors:** all in `:root` at the top of `css/style.css`.
- **Practice examples:** add an object to `PHISH_EXAMPLES` or `SHARE_EXAMPLES` in `js/interactions.js`. Phishing examples use `.example` domains, so none are real.
- **Quiz questions and score levels:** edit `QUESTIONS` and `LEVELS` at the top of `js/quiz.js`.
- **Videos:** on `pages/resources.html`, replace a `.video-slot` block with a YouTube embed (the snippet is in a comment in that file).
- **Names in the group:** the blueprint's "About the project" section is not built yet. Add it when you have the final member names.
