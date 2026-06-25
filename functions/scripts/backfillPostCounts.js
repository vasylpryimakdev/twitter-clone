import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

const WEIGHTS = {
  LIKE: 2,
  DISLIKE: -2,
  COMMENT: 3,
};

async function backfillPosts() {
  console.log("🚀 Starting FULL posts backfill...");

  const postsSnap = await db.collection("posts").get();

  console.log(`📝 Posts loaded: ${postsSnap.size}`);

  const batch = db.batch();
  let opCount = 0;
  let updated = 0;

  for (const postDoc of postsSnap.docs) {
    const postId = postDoc.id;

    const reactionsSnap = await db
      .collection("reactions")
      .where("postId", "==", postId)
      .get();

    let likesCount = 0;
    let dislikesCount = 0;
    let score = 0;

    for (const r of reactionsSnap.docs) {
      const data = r.data();

      if (data.type === "LIKE") {
        likesCount++;
        score += WEIGHTS.LIKE;
      }

      if (data.type === "DISLIKE") {
        dislikesCount++;
        score += WEIGHTS.DISLIKE;
      }
    }

    const commentsSnap = await db
      .collection("comments")
      .where("postId", "==", postId)
      .get();

    const commentsCount = commentsSnap.size;
    score += commentsCount * WEIGHTS.COMMENT;

    batch.update(postDoc.ref, {
      likesCount,
      dislikesCount,
      commentsCount,
      score,
    });

    updated++;
    opCount++;

    if (opCount === 500) {
      await batch.commit();
      console.log(`💾 Batch committed (${updated} posts updated)`);
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log(`✅ DONE. Updated posts: ${updated}`);
  process.exit(0);
}

backfillPosts().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
