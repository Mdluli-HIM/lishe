import Hero from "@/components/sections/Hero";
import CategoryIndex from "@/components/sections/CategoryIndex";
import StoryStage from "@/components/sections/StoryStage";
import CategoryFeature from "@/components/sections/CategoryFeature";
import { getPosts } from "@/lib/wp";
import { getDepartments } from "@/lib/departments";
import { HERO_IMAGE } from "@/lib/site";

export default async function Home() {
  const [posts, departments] = await Promise.all([getPosts({ perPage: 12 }), getDepartments()]);
  const featured = posts[0];
  const rest = posts.filter((p) => p.id !== featured.id);

  const fitness = departments.find((d) => d.dept.key === "fitness");

  return (
    <main>
      <Hero post={featured} image={HERO_IMAGE} />
      <CategoryIndex items={departments} />
      <StoryStage posts={rest.slice(0, 5)} />

      {fitness && fitness.posts.length > 0 && (
        <CategoryFeature
          deptKey="fitness"
          label="Fitness"
          headline={["Move", "better.", "Live", "stronger."]}
          featured={fitness.posts[0]}
          latest={fitness.posts.slice(1, 3)}
          topics={["Pilates", "Training", "Running", "Strength", "Recovery"]}
        />
      )}
    </main>
  );
}
