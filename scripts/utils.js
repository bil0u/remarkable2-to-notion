// Base function to POST data
function postToNotion(url, body) {
    let response = UrlFetchApp.fetch(url, {
        method: 'post',
        contentType: "application/json",
        muteHttpExceptions: true,
        headers: {
            Authorization: `Bearer ${NOTION_SECRET_KEY}`,
            'Notion-Version': '2022-06-28',
        },
        payload: JSON.stringify(body)
    });
    Logger.log("code: " + response.getResponseCode());
    Logger.log("text: " + response.getContentText());
    return Boolean(response.getResponseCode() >= 400)
}

// Create a page in any Notion database.
// (Rights must be given to the automation in Notion first)
function createPageInDatabase(databaseID, nameKey, pageIcon, pageName, pageContent, pageProperties = {}) {
    return postToNotion('https://api.notion.com/v1/pages', {
        parent: {
            type: "database_id",
            database_id: databaseID,
        },
        icon: {
            type: "emoji",
            emoji: pageIcon
        },
        children: pageContent,
        properties: {
            [nameKey]: {
                title: [
                    {
                        text: {
                            content: pageName,
                        },
                    },
                ],
            },
            ...pageProperties
        }
    })
}

// Generate rich text chunks from a text
function getRichTextChunks(messageBody) {
    let remainingString = messageBody;
    const content = [];
    while (remainingString.length > 0) {
        // https://developers.notion.com/reference/request-limits#limits-for-property-values
        if (remainingString.length <= 2000) {
            content.push(getRichTextObject(remainingString));
            remainingString = '';
        } else {
            const maximalChunk = remainingString.substring(0, 2000);
            const lastLineBreakInChunk = maximalChunk.lastIndexOf('\n');
            const actualChunk = remainingString.substring(0, lastLineBreakInChunk);
            content.push(getRichTextObject(actualChunk));
            remainingString = remainingString.substring(lastLineBreakInChunk + 1);
        }
    }
    return content;
}

// Generate a rich text chunk
function getRichTextObject(messageChunk) {
    return {
        type: 'text',
        text: {
            content: messageChunk
        },
    }
}