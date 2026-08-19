export interface InboxEmail {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  received_at: string;
  is_read: boolean;
  is_editorial: boolean;
}
