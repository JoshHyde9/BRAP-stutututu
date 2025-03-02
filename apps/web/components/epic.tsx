"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/api";

export const Epic = () => {
  const { data: users } = useQuery({
    queryKey: ["epic"],
    queryFn: async () => (await api.hello.index.get()).data,
  });

  if (!users) {
    return <h1>Loading...</h1>;
  }

  return (
    <section>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <h1>{user.name}</h1>
          </div>
        );
      })}
    </section>
  );
};
