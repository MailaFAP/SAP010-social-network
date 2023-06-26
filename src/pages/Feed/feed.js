export default () => {
    const feed = document.createElement('div');
    const templateFeed = `
    <h1> Feed </h1>`;

    feed.innerHTML = templateFeed;
    return feed;
}