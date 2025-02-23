"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@workspace/api";

export const Epic = () => {
  const { data } = useQuery({
    queryKey: ["epic"],
    queryFn: async () => (await api.hello.index.get()).data,
  });

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <section>
      {data.map((yeet, i) => {
        return (
          <div key={i}>
            <h1>{i + 1}: {yeet}</h1>
          </div>
        );
      })}
    </section>
  );
};
