---
layout: default
title: Eventuate Bookmarklet
redirect_from: /bookmarklet.html
---

## What is a bookmarklet?

A bookmarklet is a bookmark whose URL is JavaScript code instead of a web page
address. When you click the bookmark, it runs the JavaScript code on the current
page. Bookmarklets are useful on browsers that support bookmarks but not
userscript managers, such as Safari on iOS.

## Installation

### Desktop bookmarklet

Drag this link to your bookmarks bar:

<p>
  <a href="javascript:${encodedScript}" class="script-install-button script-bookmarklet-button">
    Eventuate v${version} bookmarklet
  </a>
</p>

### Mobile bookmarklet

On mobile browsers that let you edit bookmark URLs:

<ol>
  <li>Copy the JavaScript code below to your clipboard.</li>
  <li>Create a new bookmark for any page.</li>
  <li>Edit the bookmark and replace its URL with the code you copied.</li>
  <li>Navigate to a results page (<em>e.g.</em>
    <a href="https://www.parkrun.com.au/brimbank/results/latestresults/">https://www.parkrun.com.au/brimbank/results/latestresults/</a>).</li>
  <li>Select the bookmark to run the script.</li>
</ol>

<div class="code-snippet" role="region" aria-label="Bookmarklet JavaScript code">
  <pre><code class="language-js">javascript:${encodedScript}</code></pre>
</div>

${warning}

Size: ${sizeKB}KB
