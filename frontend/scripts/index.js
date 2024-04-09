document.addEventListener('DOMContentLoaded', () => {
    const allUsersButton = document.getElementById('allUsersButton');
    const userContainer = document.getElementById('userContainer');
    
    const baseURL = "http://localhost:4000"

    async function fetchUsers() {
      try {
        const response = await fetch(`${baseURL}/users`);
        const users = await response.json();
        displayUsers(users);
        checkUserExists(users.id)
        users.forEach(user => {
            const userId = user.id;
            console.log(user.id)
            checkUserExists(userId);
        console.log(users)
        })
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error fetching users. Please try again later.');
      }
    }
  
    // Function to display user cards
    function displayUsers(users) {
      userContainer.innerHTML = ''; 
  
      users.forEach(user => {
        const userCard = createUserCard(user);
        userContainer.appendChild(userCard);
      });
    }
  
    // Function to create a user card
    function createUserCard(user) {
      const userCard = document.createElement('div');
      userCard.classList.add('userCard');
  
      userCard.innerHTML = `
        <h2>${user.name}</h2>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
        <p><strong>Company:</strong> ${user.company.name}</p>
        <button class="addButton" data-userid="${user.id}" style="display: none;">Add</button>
        <button class="openButton" data-userid="${user.id}" style="display: none;">Open</button>
      `;
  
      return userCard;
    }
  
    // Function to check if user exists
    async function checkUserExists(userId) {
      try {
        const response = await fetch(`${baseURL}/users/exists/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
  
        if (response.ok) {
          const { exists } = await response.json();
          const addButton = document.querySelector(`.addButton[data-userid="${userId}"]`);
          const openButton = document.querySelector(`.openButton[data-userid="${userId}"]`);
          if (exists) {
            openButton.style.display = 'block'; // User exists, then "Open" button
          } else {
            addButton.style.display = 'block'; // User does not exist, then "Add" button
          }
        } else {
          console.error('Error checking if user exists:', response.statusText);
        }
      } catch (error) {
        console.error('Error checking if user exists:', error.message);
      }
    }
  
    // Event listener for "All Users" button
    allUsersButton.addEventListener('click', fetchUsers);
  
    // Event delegation for "Add" and "Open" buttons
    userContainer.addEventListener('click', async (event) => {
        const targetButton = event.target;
        if (targetButton.classList.contains('addButton')) {
          const userId = targetButton.getAttribute('data-userid');
          try {
            // Fetch user data from backend
            const response = await fetch(`${baseURL}/users/${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                website: data.website,
                city: data.address.city,
                company: data.company.name
            }
            console.log(userData)
            await addUserToDatabase(userData);
            
            targetButton.style.display = 'none';
            const openButton = document.querySelector(`.openButton[data-userid="${userId}"]`);
            openButton.style.display = 'block';
          } catch (error) {
            console.error('Error adding user:', error);
          }
        } else if (targetButton.classList.contains('openButton')) {
          const userId = targetButton.getAttribute('data-userid');
        //   openPostPage(userId);
        console.log(userId)
        localStorage.setItem("userId", userId);
          window.location.href ="../frontend/view/posts.html"
        }
      });
      
  
      async function addUserToDatabase(userData) {
        try {
          const response = await fetch(`${baseURL}/users/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });
          
          if (!response.ok) {
            throw new Error('Failed to add user to database');
          }
          const addedUserData = await response.json();
          console.log('User added to database:', addedUserData);
          return addedUserData;
        } catch (error) {
          console.error('Error adding user to database:', error);

          throw error;
        }
      }
      
  
    
    window.addEventListener('load', () => {
      const addButtonList = document.querySelectorAll('.addButton');
      addButtonList.forEach(addButton => {
        const userId = addButton.getAttribute('data-userid');
        checkUserExists(userId);
      });
    });
  });
  