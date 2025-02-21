"use client";

import { useEffect, useState } from "react";
import ViewArticle from "@/components/ViewArticle";

export default function ViewArticlePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">View Post</h1>
      <ViewArticle
        author="Jane Doe"
        title="Child Care"
        image="/images/pregnancy1.jpg"
        content={`
      <h1>Motherhood: A Journey of Love and Growth</h1>

      <p><b>Motherhood</b> is one of the most beautiful and rewarding experiences in life. A mother provides unconditional love, care, and guidance that shapes a child's development.</p>

      <section>
        <h2>Child Care: Nurturing the Future</h2>
        <p>Child care is an essential aspect of parenting. From infancy to adolescence, children require emotional, physical, and cognitive support. Proper nutrition, education, and a nurturing environment help in their overall growth.</p>
        <img src="/images/pregnancy1.jpg" alt="Mother and Child" /> </section>

      <section>
        <h2>The Bond of Love</h2>
        <p>The bond between a mother and child is built through small, everyday moments—feeding, bedtime stories, or simply holding hands. These create a sense of security and belonging that lasts a lifetime.</p>
        <ul>
          <li>Feeding</li>
          <li>Bedtime Stories</li>
          <li>Holding Hands</li>
        </ul>
      </section>

      <section>
        <h2>Modern Motherhood: Balancing Act</h2>
        <p>Modern mothers balance work and family responsibilities, making time management and self-care crucial. Seeking support from family and professional caregivers can ease the challenges of raising a child.</p>
      </section>

      <section>
        <h2>The Joy of Motherhood</h2>
        <p>Ultimately, motherhood is a journey filled with love, sacrifice, and joy. Every small effort contributes to a child's happiness and success in life.</p>
      </section>
    `}
      />
    </div>
  );
}
