
const gmailToNotion = () => {
    const toSyncLabel = GmailApp.getUserLabelByName(INCOMING_LABEL);
    const successLabel = GmailApp.getUserLabelByName(SYNCED_LABEL);
    const incomingMails = toSyncLabel.getThreads(0, 20);
    let failed = 0

    // Check if there is any mail to process
    if (!incomingMails.length) {
        Logger.log('No emails to process.');
        return
    }

    // Processing each mail
    incomingMails.forEach((thread) => {
        const [message] = thread.getMessages().reverse();
        // Extract message needed parts
        const messageSubject = trimMessageSubject(message.getSubject());
        const messageBody = trimMessageBody(message.getPlainBody());
        const messageAttachments = message.getAttachments();
        // Upload to Notion as a new page
        let uploadFailed = createPageInDatabase(NOTION_DATABASE_ID, NOTION_DATABASE_NAME_KEY, '📝', messageSubject, convertToNotionPage(messageBody, messageAttachments));
        if (!uploadFailed) {
            // Update labels if we suceeded
            thread.removeLabel(toSyncLabel);
            thread.addLabel(successLabel);
        }
        failed += uploadFailed
    });

    // Logging results
    Logger.log(`${incomingMails.length} emails processed.\n\t${incomingMails.length - failed} succeeded.\n\t${failed} failed.`);
    if (failed) {
        throw new Error(`${failed} messages failed to process.`);
    }
};

function trimMessageSubject(original) {
    return original.replace('Document from my reMarkable: ', '');
}

function trimMessageBody(original) {
    return original.replace('--\nSent from my reMarkable paper tablet\nGet yours at www.remarkable.com\n\nPS: You cannot reply to this email', '');
}


function convertToNotionPage(body, attachments) {
    // Base content with email body as raw text
    const pageContent = [
        {
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: getRichTextChunks(body),
            },
        }
    ]
    // Add attachments if there's any at the beginning
    // if (attachments.length) {
    //     attachments.forEach(attachment => {
    //         pageContent.unshift(attachment.getContentType() === 'application/pdf' ? {
    //             object: 'block',
    //             type: 'pdf',
    //             pdf: {
    //                 type: 'external',
    //                 url: attachment.getUrl(),
    //             }
    //         } : {
    //             object: 'block',
    //             type: 'file',
    //             file: {
    //                 type: 'external',
    //                 url: attachment.getUrl(),
    //             }
    //         });
    //     });
    // }
    // Finally returning page content
    return pageContent;
}


