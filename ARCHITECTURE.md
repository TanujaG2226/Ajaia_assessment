# Architecture Note
## Repo Structure
Ajaia_assessment/
├── frontend/        
├── backend/         
│   ├── prisma/     
│   ├── tests/       
│   └── server.js    
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md

## Prioritization
Funtionality that was prioritized in the first round of code was the ability to switch users, create a document, and have changes to the document persist after saving. This is because the sharing and file upload behahvior build off of the core functionality, so it was important to get that done first. After the creation of the document and the saving of the document was working, I then moved on to the ability to uplaod a .txt and .md file as well as sharing between users, with the ability of both users able to edit the file. With the sharing ability now working, I made the destiction of the files based on "Owned" and "Shared" to make it easier for users to know what they own and what they don't. Once this functionality was done, UI changes were made to make it easier for users to navigate and use the page.