"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/api";

export const Epic = () => {
  const { data: messages } = useQuery({
    queryKey: ["epic"],
    queryFn: async () => (await api.hello.index.get()).data,
  });

  if (!messages) {
    return <h1>Loading...</h1>;
  }

  return (
    <section>
      {messages.map((message) => {
        return (
          <div key={message.id}>
            <h1>{message.message}</h1>
          </div>
        );
      })}
    </section>
  );
};
