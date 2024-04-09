const baseURL = "http://localhost:4000";
const userId = localStorage.getItem("userId");
async function openPostPage(userId) {
  try {
    const response = await fetch(`${baseURL}/posts/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }
    const data = await response.json();

    console.log(data);
    displayUserPosts(data);
    
    return data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }
}
openPostPage(userId);
function displayUserPosts(data) {
  const userPostsContainer = document.getElementById("userPostsContainer");
    
  userPostsContainer.innerHTML = "";
    const userData = data.user
    const posts = data.posts
    const name = document.createElement("h1");
    name.innerHTML = `name : ${userData.name}`
    userPostsContainer.appendChild(name)
    const company = document.createElement("h3");
    company.innerHTML = `company name : ${userData.company}`
    userPostsContainer.appendChild(company)
    posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
      `;
    userPostsContainer.appendChild(postElement);
  });
}
