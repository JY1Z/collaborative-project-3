# Coding Marathon 3  

- **Group #:**  Group 3
- Link to the backend: 
  - [Backend Code for API V1 (without authentication) ](https://github.com/JY1Z/collaborative-project-3/tree/BE-API-noAuth/backend)
  - [Backend Code for API V2 (with authentication)]([https://github.com/JY1Z/collaborative-project-3/tree/main/backend](https://github.com/JY1Z/collaborative-project-3/tree/BE-API-Auth/backend))  
- Link to the frontend:  
[Frontend Code for API V2](https://github.com/JY1Z/collaborative-project-3/tree/main/frontend)

   Code for Frontend V1, which worked with API V1:
[Frontend Code for API V1](https://github.com/JY1Z/collaborative-project-3/tree/FE-no-auth/frontend/frontend-no-auth)

- URLs for the deployed APIs:
  - URL for API V1:[API for V1 deployed on Render](https://test-cm3-11.onrender.com/)
  - URL for API V2: [API for V2 deployed on Render](https://collaborative-project-3-ft0l.onrender.com)

---

## Self-Assessment of Code

### Frontend

```js
// File name or function
// Your code part A
```

```js
// File name or function
// Your code part B
```

### Backend

```js
// middleware\requireAuth.js
// Your code part A
//  try {
//    const { _id } = jwt.verify(token, process.env.SECRET);
//
//    req.user = await User.findOne({ _id }).select("_id name username phone_number gender date_of_birth membership_status address profile_picture");
//    next();
//  } catch (error) {
//    console.log(error);
//    res.status(401).json({ error: "Request is not authorized" });
//  }
//};

if (!token) {
  return res.status(401).json({ error: "No token provided" });
}

if (error.name === "TokenExpiredError") {
  return res.status(401).json({ error: "Token has expired" });
}

if (!process.env.SECRET) {
  throw new Error("JWT secret is missing in environment variables");
}


```

```js
// File name or function
// Your code part B
```
