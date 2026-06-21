export interface ListItem {
  media_type: 'movie' | 'tv'
  media_id: number
  comment?: string
}

export interface AddListItemsResponse {
  success: boolean
  status_code: number
  status_message: string
  results: { media_type: string; media_id: number; success: boolean; comment: string | null }[]
}

export interface CommentEntry {
  name: string
  comment: string
  time: number
}

export interface ListComment {
  author: string
  comment: string
  created_at: string
  media_type: string
  media_id: number
}
