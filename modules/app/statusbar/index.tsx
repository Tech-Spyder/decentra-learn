"use client";
import React from "react";
import { Button } from "../button";
import { usePrivy } from "@privy-io/react-auth";
import { useCrossFiNetwork } from "../hooks/useCrossfiNetwork";

export function StatusBar() {
  const { login, logout, authenticated, user } = usePrivy();
  const { isOnCrossFi, switchToCrossFi } = useCrossFiNetwork();
  
console.log(user, 'user');

  return (
    <div className="flex w-full h-16 justify-end mt-6 px-6 font-medium text-white">
      {authenticated ? (
        <Button onClick={logout} className="w-fit px-10 cursor-pointer">
          Logout
        </Button>
      ) : (
        <Button onClick={() => login()} className="w-fit px-10 cursor-pointer">
          Login
        </Button>
      )}

      {!isOnCrossFi && (
        <div className="alert">
          <p>You&apos;re not on CrossFi network!</p>
          <button onClick={switchToCrossFi}>Switch to CrossFi</button>
        </div>
      )}
    </div>
  );
}
