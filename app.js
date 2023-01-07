const express = require("express");
const morgan = require("morgan");
const postBank = require("./postBank");

const app = express();

app.use(morgan("dev"));

app.use(express.static("public"));

app.get("/", (req, res) => {
  // Get list of posts
  const posts = postBank.list();

  // Then, create html to send 
  // We use map to transform an array of posts into an array of li
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          ${posts.map(post => `
            <div class="news-item">
              <p>
                <span class="news-position">${post.id}. ▲</span>
                <a href="/posts/${post.id}">${post.title}</a>
                <small>(by ${post.name})</small>
              </p>
              <small>
                ${post.upvotes} upvotes | ${post.date}
              </small>
            </div>
          `).join("")}
        </div>
      </body>
    </html>
  `

  res.send(html);
});

app.get("/posts/:id", (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if (!post.id) {
    // If the post wasn't found, set the HTTP status to 404 and send Not Found HTML
    res.status(404)
    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>Wizard News</title>
          <link rel="stylesheet" href="/style.css" />
        </head>
        <body>
          <header><img src="/logo.png"/>Wizard News</header>
          <div class="not-found">
            <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
          </div>
        </body>
      </html>
    `

    res.send(html)
  } else {
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <link rel="stylesheet" href="/style.css" />
      </head>
      <body>
        <div class="news-list">
          <header><img src="/logo.png"/>Wizard News</header>
          <div class="news-item">
            <p>
              <span class="news-position">${post.id}. ▲</span>
              ${post.title}
              <small>(by ${post.name})</small>
            </p>
            <p>
              ${post.content}
            </p>
            <small>
              ${post.upvotes} upvotes | ${post.date}
            </small>
          </div>
        </div>
      </body>
    </html>
  `

    res.send(html);
  }
});

const { PORT = 1337 } = process.env;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
