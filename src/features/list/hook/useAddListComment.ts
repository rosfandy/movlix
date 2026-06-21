import { useMutation } from '@tanstack/react-query'
import { addListItems } from './useListComments'
import type { ListItem, AddListItemsResponse } from '@/features/list/types'

const SESSION_KEY = 'tmdb_session_id'

export function useAddListComment(listId: number) {
  return useMutation<AddListItemsResponse, Error, ListItem[]>({
    mutationFn: (items) => addListItems(listId, items, localStorage.getItem(SESSION_KEY) ?? undefined),
  })
}
