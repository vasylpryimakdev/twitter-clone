import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: cert("yourKey.json"),
  projectId: "yourProjectId",
});

const db = getFirestore();

async function backfillRepliesCount() {
  console.log("🚀 Starting repliesCount backfill...");

  const commentsSnap = await db.collection("comments").get();

  console.log(`💬 Comments loaded: ${commentsSnap.size}`);

  const batch = db.batch();
  let opCount = 0;
  let updated = 0;

  for (const commentDoc of commentsSnap.docs) {
    const commentId = commentDoc.id;

    const repliesSnap = await db
      .collection("comments")
      .where("parentId", "==", commentId)
      .get();

    const repliesCount = repliesSnap.size;

    batch.update(commentDoc.ref, {
      repliesCount,
    });

    updated++;
    opCount++;

    if (opCount === 500) {
      await batch.commit();
      console.log(`💾 Batch committed (${updated} comments updated)`);
      opCount = 0;
    }
  }

  if (opCount > 0) {
    await batch.commit();
  }

  console.log(`✅ Done. Updated comments: ${updated}`);
  process.exit(0);
}

backfillRepliesCount().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
