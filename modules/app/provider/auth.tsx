"use client";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, useCallback } from "react";

// Define PrivyUser interface to match Privy's User type
interface PrivyUser {
  id: string;
  email?: { address: string };
  wallet?: { address: string };
  createdAt: Date; // Matches Privy's User type
}

export function AuthHandler() {
  const { user, authenticated } = usePrivy();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize saveUser to prevent unnecessary re-renders
  const saveUser = useCallback(async (user: PrivyUser) => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/save-user", {
        method: "POST",
        body: JSON.stringify({
          id: user.id,
          email: user.email?.address || null,
          wallet: user.wallet?.address || null,
          createdAt: user.createdAt.toISOString(), // Convert Date to ISO string for API
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Failed to save user"); // Fixed throw statement
      }

      const { user: savedUser } = await res.json();
      console.log("User saved successfully:", savedUser);
    } catch (err) {
      console.error("Error saving user:", err);
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated || !user) return;

    // Only save if user.id is present and valid
    if (typeof user.id === "string" && user.id.startsWith("did:privy:")) {
      saveUser(user); // No type assertion needed
    }
  }, [user?.id, authenticated, saveUser]); // Depend on user.id to avoid unnecessary calls

  // Optionally render error or loading state for debugging
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  if (isSaving) {
    return <div>Saving user...</div>;
  }
  return null;
}