const baseURL = "https://cointab-assignment-z89v.onrender.com";
const userId = localStorage.getItem("userId");


async function openPostPage(userId) {
  try {
    loadingSpinner.style.display = 'block';
    const response = await fetch(`${baseURL}/posts/${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch user posts");
    }
    const data = await response.json();
    displayUserPosts(data);
    checkUserExists(userId);
    return data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return null;
  }finally {
    loadingSpinner.style.display = 'none'; 
  }
}


openPostPage(userId);


function displayUserPosts(data) {
  const userPostsContainer = document.getElementById("userPostsContainer");

  userPostsContainer.innerHTML = "";

  const userData = data.user;
  const posts = data.posts;

  const add = document.createElement("button");
  add.id = "bulkAddButton";
  add.innerText= "Bulk Add";
  add.style.display ="none"
  add.setAttribute("data-userid", userId);
  userPostsContainer.appendChild(add)

  const download = document.createElement("button");
  download.id = "downloadExcelButton";
  download.innerText= "Download in Excel";
  download.style.display ="none"
  download.setAttribute("data-userid", userId);
  userPostsContainer.appendChild(download)

  const name = document.createElement("h1");
  name.innerHTML = `Name : ${userData.name}`;
  userPostsContainer.appendChild(name);

  const company = document.createElement("h3");
  company.innerHTML = `Company name : ${userData.company}`;
  userPostsContainer.appendChild(company);

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "postDiv";
    postElement.innerHTML = `
        <h3><strong>Title:</strong> ${post.title}</h3>
        <p><strong>Content:</strong> ${post.body}</p>
      `;
    userPostsContainer.appendChild(postElement);
  });
}


async function checkUserExists(userId) {
  try {
    const response = await fetch(`${baseURL}/posts/exists/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const { exists } = await response.json();
      console.log(exists)
      const bulkAddButton = document.querySelector(
        `#bulkAddButton[data-userid="${userId}"]`
      );
      const downloadExcelButton = document.querySelector(
        `#downloadExcelButton[data-userid="${userId}"]`
      );
      if (exists) {
        downloadExcelButton.style.display = "block"; // User exists, then "Open" button
      } else {
        bulkAddButton.style.display = "block"; // User does not exist, then "Add" button
      }
    } else {
      console.error("Error checking if user exists:", response.statusText);
    }
  } catch (error) {
    console.error("Error checking if user exists:", error.message);
  }
}



async function bulkAddPosts(userId, user, posts) {
  try {
    const response = await fetch(`${baseURL}/posts/bulk-add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, posts: posts }),
    });
    if (response.ok) {
      const downloadExcelButton = document.getElementById("downloadExcelButton");
      downloadExcelButton.style.display = "block";
      bulkAddButton.style.display = "none";
    } else {
      console.error("Failed to add posts:", response.statusText);
    }
  } catch (error) {
    console.error("Error adding posts:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await openPostPage(userId);

  const bulkAddButton = document.getElementById("bulkAddButton");
  bulkAddButton.addEventListener("click", async () => {
    try {
      const data = await openPostPage(userId);
      await bulkAddPosts(userId,data.user, data.posts);
    } catch (error) {
      console.error(error); 
    }
  });

  const downloadExcelButton = document.getElementById("downloadExcelButton");
  downloadExcelButton.addEventListener("click", async () => {
    try {
      const response = await fetch(`${baseURL}/posts/download-excel/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to download Excel file");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `user_${userId}_posts.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error); 
    }
  });
});
