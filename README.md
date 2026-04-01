# GitHub Profile Finder

A modern, responsive web application that allows users to search for any GitHub username and fetch their real-time profile data and top repositories using the GitHub REST API. 

This project is built from scratch using pure HTML, CSS, and Vanilla JavaScript, ensuring a deep dive into DOM manipulation, async JavaScript, and modern CSS practices without relying on heavy frameworks.

---

## 🚀 Core Features

- **Real-time Search:** Fetches and displays data directly from the GitHub API.
- **Detailed Profile Information:** Displays the user's avatar, name, bio, follower count, following count, public repository count, location, Twitter handle, and more.
- **Top Repositories:** Automatically sorts the user's repositories by the number of stars and displays the top 15. Includes repository descriptions, languages used, star counts, and fork counts.
- **Dark/Light Mode:** A built-in theme toggle that remembers the user's preference using `localStorage`.
- **Loading State:** Displays a modern skeleton loader animation while data is being fetched.
- **Error Handling:** Graceful error states for when a user is not found or if the API rate limit is exceeded.
- **Fully Responsive:** Adapts seamlessly to mobile, tablet, and desktop screens.

---

## 🛠️ Technology Stack

1. **HTML5:** Semantic structure dividing the application into headers, forms, and main content areas.
2. **CSS3:** Modern styling utilizing CSS Variables (Custom Properties), Flexbox, Grid Layouts, and keyframes for skeleton animations.
3. **Vanilla JavaScript:** Contains logic for API requests (Fetch API), DOM manipulation, and state management.

---

## 🧠 Logic and Architecture

Here is a breakdown of how the application works under the hood:

### 1. Structure (`index.html`)

The HTML file provides a semantic layout. We use a `<form>` element for the search bar so that users can hit the "Enter" key to submit it naturally. 

There's an empty `div` with the id `#content-area` which acts as a container. All dynamic widgets—like the skeleton loader, error messages, profile card, and repository list—are injected into this container using JavaScript.

### 2. Styling and Theming (`style.css`)

- **CSS Variables:** The core of the dark/light mode functionality relies on CSS variables defined in the `:root` scope for the light theme, and under the `[data-theme="dark"]` selector for the dark theme.
- **Theme Toggling:** When the theme button is clicked, JavaScript updates the `data-theme` attribute on the `<html>` tag, and the CSS automatically repaints the colors according to the newly active variables.
- **Layouts:** We use `display: flex` for aligning items linearly (like the search bar and headers) and `display: grid` for creating responsive layouts (like the repositories grid that automatically wraps cards to new rows).
- **Skeleton Animation:** The loading shimmer effect is accomplished using `@keyframes shimmer`, which animates the background color of placeholder elements between two shades of gray infinitely.

### 3. Application Logic (`script.js`)

#### A. Initializing the Theme
When the script loads, it first checks `localStorage` to see if the user previously selected a theme. If not, it falls back to checking their Operating System level preferences using `window.matchMedia('(prefers-color-scheme: dark)')`.

#### B. Event Listeners
We listen for the `submit` event on the search form. When the form is submitted, we prevent the default page reload using `e.preventDefault()`, extract the searched username, and trigger the core fetching function.

#### C. Fetching Data (The GitHub REST API)
We use the modern JavaScript `async/await` syntax alongside the `fetch()` API.

We execute two main API calls:
1. `GET https://api.github.com/users/{username}` — Retrieves basic account details (avatar, followers, bio).
2. `GET https://api.github.com/users/{username}/repos?sort=stars&per_page=15` — Retrieves the user's repositories, telling the GitHub API to sort them by "stars" and limit the response to 15 items per page.

#### D. Error Handling
We inspect the HTTP status of the response:
- If `status === 404`, the user typed an invalid username. We show a "User Not Found" widget.
- If `status === 403`, the GitHub API rate limit has been exceeded (unauthenticated requests are limited to 60 per hour).
- We also wrap the fetching logic in a `try...catch` block to deal with network failures (e.g., if the user loses Wi-Fi).

#### E. Rendering Data
We use JavaScript Template Literals (backticks ``` ` ```) to dynamically generate chunks of HTML strings filled with the API data. For example, grabbing `userData.avatar_url` and placing it inside an `<img>` tag. Once the HTML string is built for both the profile and the repositories, we set it inside the `content-area.innerHTML` to render it to the screen.

#### F. Language Colors Map
We maintain a hardcoded object map `languageColors` mapping languages like "JavaScript" and "Python" to their respective HEX codes used officially by GitHub, to ensure the repository cards look authentic.

---

## 💻 How to Run Locally

Because this project consists of simple, static, front-end files, no complex build tools or package managers (like npm/webpack) are required.

1. **Clone or Download** the repository to your local machine.
2. Locate the folder `GitHub_profile_Finder`.
3. Double-click the `index.html` file to open it directly in your default web browser.

*(Alternatively, you can open the project folder in VS Code and use the "Live Server" extension for hot reloading).*

---

## 🤝 Lessons Learned and Takeaways

- Handling asynchronous requests and resolving promises elegantly wrapper in try/catch blocks.
- Building a design system governed solely by CSS custom properties.
- Dynamic DOM manipulation without the overhead of libraries like React.
- Advanced responsive design utilizing CSS Grid's `repeat(auto-fill, minmax())` property.
