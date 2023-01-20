// Any email tagged with this label will be processed
const INCOMING_LABEL = 'NotionToSync';
// Any processed email will have it's label updated with this one
const SYNCED_LABEL = 'SyncedToNotion';

// Notion secret key obtained by setting up a Notion integration
const NOTION_SECRET_KEY = '<Paste your secret key here>';
// Destination Notion Database ID to store new notes
const NOTION_DATABASE_ID = '<Paste the target notion database ID here>';
// Key of the primary database property used for the page name
const NOTION_DATABASE_NAME_KEY = 'Name';