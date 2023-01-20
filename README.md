# reMarkable2 to Notion

Allows to send notes taken with reMarkable2 to a Notion database using a Gmail address, and Google Apps Script platform.

Anyone can set up this automation in a few minutes, and it's free to use.

_⚠️ Notion does not supports uploading files through API yet, so email attachments will be ignored for now. Future plan is to add them to the notion page with PDF or files blocks._

## Pre-requisites

You will need a Gmail account as we're going to use Google Apps Script to run the code needed for the sync to work. You can create one for free [here](https://accounts.google.com/SignUp).

👉 I have created a new dedicated account for this automation, but you can use an existing one if you like.

## Setup

##### 📥 Gmail
1. Create two labels in Gmail, named `NotionToSync` & `SyncedToNotion`.
2. Setup a filter to automatically tag as `NotionToSync` all incoming emails from `my@remarkable.com`.

##### 📚 Notion
1. Setup integration by going in **Settings & Members** > **Connexions** > **Develop or manage integrations**:
    - Click on `Add a new integration`.
    - Name it `reMarkable Integration`.
    - Give it `Insert Content` & `No user information` permissions.
    - Finally copy the generated secret key and save it for later.
2. Create a new database to store your notes, or use an existing one<sup>1</sup>:
    - Copy the database link, and retrieve the database ID from it, saving it for later.
        Ex: `https://www.notion.so/acme/853bfb7d652e412b8d327af945b8cd7c?v=795767a84df041418092cc2c2b44863e` → `853bfb7d652e412b8d327af945b8cd7c`
    - Copy the name of the primary title database property _(usually called `Name`)_
3. On the database main page, go to the page settings by clicking the three dots on your window upper right corner, then click **Add connections**, and then search for `reMarkable Integration` and select it.


##### 🤖 Apps Script
1. Log in to [Apps Script](https://script.google.com/home) using the same Gmail account.
2. Create a new project, and name it `reMarkable to Notion`.
3. In the **Editor** panel, create 3 files named `main`, `utils`, and `config`.
    _Google will add the `.gs` extension on its own_
4. Copy the content of the files in [scripts](./scripts/) in their respective files and save.
5. Replace the placeholders in `config.gs` by the values you copied earlier.
6. Finally, in the **Triggers** panel, click **Add a trigger**:
    - Select `gmailToNotion` as the function to execute.
    - Setup the event source to be on a time basis
    - Configure the interval you would like your script to poll emails in your inbox.
    - Then save the new trigger


That's it! You can now test your automation by sending your notes by email!


###### Notes

<sup>1</sup> If you are using an existing database, only the primary field (usually `Name`) will be populated. You can extend this script to add your properties by providing the argument `pageProperties` to the `createPageInDatabase` function call.

## Config


```js
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
```

See [config.js](./scripts/config.js)