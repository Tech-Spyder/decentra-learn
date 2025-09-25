"use client";

import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User as PrivyUser } from "@privy-io/react-auth";

const supabase = createClientComponentClient();

type PrivyJwtUser = PrivyUser & {
  getIdToken?: () => Promise<string>;
};

export function PrivySupabaseSync() {
  const { user, ready } = usePrivy();

  useEffect(() => {
    const syncSession = async () => {
      if (!ready) return;

      const idToken = await (user as PrivyJwtUser)?.getIdToken?.();

      if (idToken) {
        await supabase.auth.setSession({
          access_token: idToken,
          refresh_token: idToken, 
        });
      } else {
        await supabase.auth.signOut();
      }
    };

    syncSession();
  }, [user, ready]);

  return null;
}
