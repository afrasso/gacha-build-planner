// "use client";

// import { useEffect, useState } from "react";

// import { getToken, login as loginAction, logout as logoutAction, validateToken } from "../app/actions/auth";

// interface User {
//   email: string;
// }

// export function useAuth() {
//   const [user, setUser] = useState<undefined | User>();
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await getToken();
//       if (token) {
//         const result = await validateToken(token);
//         if (result.success) {
//           setUser(result.user);
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const result = await loginAction(email, password);
//     if (result.success) {
//       setUser(result.user);
//     }
//     return result.success;
//   };

//   const logout = async () => {
//     await logoutAction();
//     setUser(undefined);
//   };

//   return { loading, login, logout, user };
// }

"use client";

import { useEffect, useState } from "react";

import { getToken, login as loginAction, logout as logoutAction, validateToken } from "../app/actions/auth";

interface User {
  email: string;
  // Add other user properties as needed
}

export function useAuth() {
  const [user, setUser] = useState<undefined | User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token) {
        const result = await validateToken(token);
        if (result.success) {
          setUser(result.user);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await loginAction(email, password);
    if (result.success) {
      setUser(result.user);
    }
    return result.success;
  };

  const logout = async () => {
    await logoutAction();
    setUser(undefined);
  };

  return { loading, login, logout, user };
}
