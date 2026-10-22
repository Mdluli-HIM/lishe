import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PostGrid from "@/components/sections/PostGrid";
import { getArticle, getPosts } from "@/lib/wp";
import { longDate } from "@/lib/format";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    openGraph: a.image ? { images: [a.image.src] } : undefined,
  };
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const [article, latest] = await Promise.all([getArticle(slug), getPosts({ perPage: 4 })]);
  if (!article) notFound();

  return (
    <main data-side="journal">
      <article className="ar">
        <header className="ar__head wrap">
          <nav className="pi__crumbs label" aria-label="Breadcrumb">
            <span><Link href="/">Lishe</Link></span>
            <span><Link href="/journal">Journal</Link></span>
            <span aria-current="page">{article.category}</span>
          </nav>
          <h1 className="ar__title">{article.title}</h1>
          <div className="ar__meta label">
            <span>{longDate(article.date)}</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </header>

        {article.image && (
          <figure className="ar__figure wrap">
            <span className="ar__img">
              <Image
                src={article.image.src}
                alt={article.image.alt}
                fill
                priority
                sizes="(min-width: 1200px) 1100px, 100vw"
                style={{ objectFit: "cover" }}
              />
            </span>
          </figure>
        )}

        <div className="ar__body wrap">
          <div className="prose" dangerouslySetInnerHTML={{ __html: article.html }} />
          <Link href="/journal" className="label ar__back">
            ← Back to the Journal
          </Link>
        </div>
      </article>

      <PostGrid
        posts={latest.filter((p) => p.id !== article.id).slice(0, 3)}
        label="Keep reading"
        more={{ href: "/journal/features", label: "Features →" }}
      />
    </main>
  );
}
