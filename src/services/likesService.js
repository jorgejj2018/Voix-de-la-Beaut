import { doc, updateDoc, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

export async function toggleLike(articleId, uid, isLiked) {
  return updateDoc(doc(db, 'articles', articleId), {
    likedBy: isLiked ? arrayRemove(uid) : arrayUnion(uid),
  })
}

export async function toggleFavorite(uid, articleId, isFavorited) {
  const batch = writeBatch(db)

  batch.update(doc(db, 'users', uid), {
    favoriteIds: isFavorited ? arrayRemove(articleId) : arrayUnion(articleId),
  })

  batch.update(doc(db, 'articles', articleId), {
    savedBy: isFavorited ? arrayRemove(uid) : arrayUnion(uid),
  })

  return batch.commit()
}
