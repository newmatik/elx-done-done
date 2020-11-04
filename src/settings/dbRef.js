import { db } from './db'

export const listRef = routeName => {
  return db
    .collection('boards')
    .doc(routeName)
    .collection('list')
}

export const docListRef = (routeName, listId) => {
  return db
    .collection('boards')
    .doc(routeName)
    .collection('list')
    .doc(listId)
}
