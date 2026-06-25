import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const COMMENT_WEIGHT = 3;

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

/**
 * One-time migration script.
 * Recalculates post scores for existing posts.
 */
async function recalc() {
  console.log("🚀 Starting recalculation...");

  const snapshot = await db.collection("posts").get();

  const batch = db.batch();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    const likes = data.likesCount ?? 0;
    const dislikes = data.dislikesCount ?? 0;
    const comments = data.commentsCount ?? 0;

    const score = likes - dislikes + comments * COMMENT_WEIGHT;

    batch.update(doc.ref, {
      score,
      updatedAt: FieldValue.serverTimestamp(),
    });

    count++;

    if (count === 500) {
      await batch.commit();
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
  }

  console.log("✅ Done recalculating scores");
  process.exit(0);
}

recalc().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
