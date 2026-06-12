import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { firebaseAdmin } from "../config/firebase.config";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { Post } from "./post.entity";
import { mapDoc } from "../common/utils/firestore.mapper";

@Injectable()
export class PostsService {
  private postsCollection = firebaseAdmin.firestore().collection("posts");

  async create(authorId: string, dto: CreatePostDto): Promise<Post> {
    const docRef = this.postsCollection.doc();

    const post: Omit<Post, "id"> = {
      authorId,

      title: dto.title,
      text: dto.text,
      photoUrl: dto.photoUrl ?? null,

      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await docRef.set(post);

    const snapshot = await docRef.get();

    return mapDoc(snapshot);
  }

  async findOne(id: string): Promise<Post> {
    const doc = await this.postsCollection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException("Post not found");
    }

    return mapDoc(doc);
  }

  async findFeed(limit = 10, cursor?: string) {
    let query = this.postsCollection.orderBy("createdAt", "desc").limit(limit);

    if (cursor) {
      const cursorDoc = await this.postsCollection.doc(cursor).get();
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    const posts = snapshot.docs.map((doc) => mapDoc(doc));

    const lastDoc = snapshot.docs[snapshot.docs.length - 1];

    return {
      data: posts,
      nextCursor: lastDoc ? lastDoc.id : null,
    };
  }

  async findByUser(userId: string, limit = 10, cursor?: string) {
    let query = this.postsCollection
      .where("authorId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (cursor) {
      const cursorDoc = await this.postsCollection.doc(cursor).get();
      query = query.startAfter(cursorDoc);
    }

    const snapshot = await query.get();

    return {
      data: snapshot.docs.map((doc) => mapDoc(doc)),
      nextCursor:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1].id
          : null,
    };
  }

  async update(
    userId: string,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<Post> {
    const docRef = this.postsCollection.doc(postId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException("Post not found");
    }

    const post = doc.data() as Post;

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot edit this post");
    }

    await docRef.update({
      ...dto,
      updatedAt: new Date(),
    });

    const updated = await docRef.get();

    return mapDoc(updated);
  }

  async delete(userId: string, postId: string): Promise<void> {
    const docRef = this.postsCollection.doc(postId);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException("Post not found");
    }

    const post = doc.data() as Post;

    if (post.authorId !== userId) {
      throw new ForbiddenException("You cannot delete this post");
    }

    await docRef.delete();
  }
}
